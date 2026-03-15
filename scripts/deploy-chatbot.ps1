<#
Supabase deployment helper (PowerShell)

Usage:
  Open PowerShell in the repo root and run:
    ./scripts/deploy-chatbot.ps1

  Or pass parameters:
    ./scripts/deploy-chatbot.ps1 -ProjectRef cdfndnpqlpifhndfffxd -DeployCropAnalysis

What it does:
 - Installs `supabase` CLI via npm if not available
 - Prompts you to login (opens browser)
 - Prompts for your OpenAI key securely (not echoed)
 - Sets the `OPENAI_API_KEY` secret on the project
 - Deploys the `chatbot` edge function from supabase/functions/chatbot
 - Optionally deploys `crop-analysis` if you pass -DeployCropAnalysis
 - Tails logs for the deployed `chatbot` function

Security note: this script will convert the secure string to plain text briefly to pass to the CLI. The key is not written to disk by this script.
#>
param(
  [string]$ProjectRef = "cdfndnpqlpifhndfffxd",
  [switch]$DeployCropAnalysis
)

function Ensure-SupabaseCLI {
  Write-Host "Checking for supabase CLI..." -ForegroundColor Cyan
  $sup = Get-Command supabase -ErrorAction SilentlyContinue
  if (-not $sup) {
    Write-Host "Supabase CLI not found in PATH. We'll use 'npx supabase' as a fallback (no global install required)." -ForegroundColor Yellow
    Write-Host "If you prefer a global install, run: npm install -g supabase" -ForegroundColor Gray
  } else {
    Write-Host "Supabase CLI available:" -NoNewline; supabase --version
  }
}

# Helper to run supabase CLI either via global binary or npx fallback
function Invoke-Supabase {
  param(
    [Parameter(Mandatory=$true)] [string[]] $Args
  )

  if (Get-Command supabase -ErrorAction SilentlyContinue) {
    & supabase @Args
    return $LASTEXITCODE
  } else {
    & npx supabase @Args
    return $LASTEXITCODE
  }
}

try {
  Push-Location (Split-Path -Path $MyInvocation.MyCommand.Definition -Parent) | Out-Null
  Pop-Location
} catch { }

# Ensure CLI
Ensure-SupabaseCLI

# Authenticate
Write-Host "Opening browser to authenticate supabase CLI (if not already logged in)..." -ForegroundColor Cyan
Invoke-Supabase -Args @('login')
if ($LASTEXITCODE -ne 0) {
  Write-Error "supabase login failed or was cancelled. Aborting."
  exit 1
}

# Ask for OpenAI key securely
Write-Host "Enter your OpenAI API key (sk-...). It will be set as a Supabase secret for project: $ProjectRef" -ForegroundColor Cyan
$secureKey = Read-Host -AsSecureString "OpenAI API key"
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
$openaiKey = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

if (-not $openaiKey) {
  Write-Error "No key entered. Aborting."
  exit 1
}

# Set secret
Write-Host "Setting OPENAI_API_KEY secret on project $ProjectRef..." -ForegroundColor Cyan
Invoke-Supabase -Args @('secrets','set',"OPENAI_API_KEY=$openaiKey",'--project-ref',$ProjectRef)
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to set secret. Ensure you have permission to set project secrets and the project-ref is correct."
  exit 1
}

# Deploy chatbot function
Write-Host "Deploying function: chatbot..." -ForegroundColor Cyan
Invoke-Supabase -Args @('functions','deploy','chatbot','--project-ref',$ProjectRef)
if ($LASTEXITCODE -ne 0) {
  Write-Error "Failed to deploy chatbot function. Check the output above for errors."
  exit 1
}

if ($DeployCropAnalysis) {
  Write-Host "Deploying function: crop-analysis..." -ForegroundColor Cyan
  Invoke-Supabase -Args @('functions','deploy','crop-analysis','--project-ref',$ProjectRef)
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "crop-analysis deploy failed; continuing to tail chatbot logs."
  }
}

# Tail logs
Write-Host "Tailing logs for chatbot (Ctrl+C to stop)..." -ForegroundColor Cyan
Invoke-Supabase -Args @('functions','logs','chatbot','--project-ref',$ProjectRef,'--follow')

Write-Host "Done." -ForegroundColor Green
