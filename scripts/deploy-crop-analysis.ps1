<#
PowerShell helper to deploy the `crop-analysis` supabase function and set OPENAI_API_KEY secret.

Usage: run this from the repository root (where the `supabase/` folder is).
PowerShell:
  ./scripts/deploy-crop-analysis.ps1

The script will:
 - check for `supabase` CLI
 - optionally run `supabase login` (interactive)
 - optionally link to a project ref
 - deploy `crop-analysis` function
 - set the `OPENAI_API_KEY` secret (you will be prompted to paste it)
 - tail the function logs for 30 seconds

Security: this script will prompt for your OpenAI key; it will not store it in the repo.
#>

param(
    [string]$ProjectRef = "",
    [switch]$SkipLogin
)

function ExitWithError($msg) {
    Write-Error $msg
    exit 1
}

# Ensure we're in repo root (has supabase/ folder)
if (-not (Test-Path -Path "./supabase")) {
    ExitWithError "Cannot find 'supabase' folder. Run this script from the repository root."
}

# Check supabase CLI
$sb = Get-Command supabase -ErrorAction SilentlyContinue
if (-not $sb) {
    ExitWithError "Supabase CLI not found. Install it first: npm install -g supabase"
}

if (-not $SkipLogin) {
    Write-Host "Opening browser to login to Supabase (if not already logged in)..."
    & supabase login
}

if (-not $ProjectRef) {
    $ProjectRef = Read-Host "Enter Supabase project ref (leave blank to skip linking)"
}

if ($ProjectRef) {
    Write-Host "Linking to project: $ProjectRef"
    & supabase link --project-ref $ProjectRef
}

# Deploy function
Write-Host "Deploying function: crop-analysis"
$deploy = & supabase functions deploy crop-analysis
if ($LASTEXITCODE -ne 0) {
    ExitWithError "Function deploy failed. See output above."
}

# Set OpenAI key
Write-Host "Now set the OPENAI_API_KEY secret for this project. This value will be stored securely in Supabase."
$openai = Read-Host -AsSecureString "Paste your OpenAI API key (it will not be displayed)"
if (-not $openai) {
    ExitWithError "OpenAI key not provided. Aborting."
}
# Convert SecureString to plain text for CLI; we avoid writing to disk.
$ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($openai)
$openaiPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) | Out-Null

Write-Host "Setting secret OPENAI_API_KEY..."
$setSecret = & supabase secrets set OPENAI_API_KEY="$openaiPlain"
if ($LASTEXITCODE -ne 0) {
    ExitWithError "Failed to set secret. See output above."
}

Write-Host "Deployment and secret setup complete. Tailing logs for 30 seconds..."
try {
    & supabase functions logs crop-analysis --follow --since 30s
} catch {
    Write-Warning "Could not tail logs. Check them in the dashboard or run 'supabase functions logs crop-analysis --follow' manually."
}

Write-Host "Done. Test the function from the frontend or with the example Invoke-RestMethod commands provided in the repo README or the earlier assistant message."