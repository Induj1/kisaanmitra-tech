// Simple local proxy server to call OpenAI for development
// Run: OPENAI_API_KEY=sk-... node server/server.js

const http = require('http');
const { URL } = require('url');
const { Buffer, Blob } = require('buffer');

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8787;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_KEY) {
  console.error('OPENAI_API_KEY is not set. Set it and restart the server.');
  // don't exit here to allow the server to start and return helpful errors
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

async function callOpenAIChat(messages, max_tokens = 1500) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_KEY}`
    },
    body: JSON.stringify({ model: 'gpt-3.5-turbo', messages, temperature: 0.7, max_tokens })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`OpenAI error: ${resp.status} ${text}`);
  }

  const data = await resp.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (url.pathname === '/api/chat' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const json = body ? JSON.parse(body) : {};

      const { message, cropData, language = 'english' } = json;

      if (!message && !cropData) {
        return sendJson(res, 400, { success: false, error: 'Missing message or cropData in request body' });
      }

      const languageLabel = language === 'hindi' ? 'Hindi' : language === 'kannada' ? 'Kannada' : 'English';

      const systemPrompt = `You are an expert agricultural assistant for smallholder farmers in India. Provide concise, practical, and actionable advice about crops, weather, markets, and government schemes. Always answer in the user's requested language: ${languageLabel}. If asked for structured analysis, return STRICT JSON as requested.`;

      if (message) {
        const messages = [{ role: 'system', content: systemPrompt }, { role: 'user', content: message }];
        if (!OPENAI_KEY) return sendJson(res, 500, { success: false, error: 'OPENAI_API_KEY is not set on the server.' });
        const reply = await callOpenAIChat(messages, 800);
        return sendJson(res, 200, { success: true, data: { text: reply } });
      }

      // structured cropData analysis
      const userPrompt = `Analyze this crop cultivation data and provide the following (use STRICT JSON output):\n\nCrop Specifics:\n- Type: ${cropData.crop_type}\n- Land Size: ${cropData.land_size}\n- Sowing Date: ${cropData.sowing_date}\n- Cultivation Method: ${cropData.cultivation_method}\n- Watering Method: ${cropData.watering_method}\n\nKey Observations and Analysis:\n1) Provide 3-4 specific strengths in the current cultivation approach\n2) Identify 3-4 critical areas for improvement\n3) Offer targeted, practical recommendations for enhancing crop yield and sustainability\n4) Assess overall agricultural practices with a comprehensive score (0-100)\n\nResponse Format (STRICT JSON):\n{\n  "positives": ["..."],\n  "improvements": ["..."],\n  "recommendations": ["..."],\n  "overallScore": number\n}`;

      if (!OPENAI_KEY) return sendJson(res, 500, { success: false, error: 'OPENAI_API_KEY is not set on the server.' });
      const reply = await callOpenAIChat([{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], 1500);

      // try to extract JSON
      const match = reply.match(/\{[\s\S]*\}/);
      const cleaned = match ? match[0] : reply;
      try {
        const analysisJson = JSON.parse(cleaned);
        return sendJson(res, 200, { success: true, data: analysisJson });
      } catch (err) {
        return sendJson(res, 200, { success: false, error: 'OpenAI returned invalid JSON', raw: reply });
      }
    } catch (err) {
      console.error('Server error:', err);
      return sendJson(res, 500, { success: false, error: String(err) });
    }
  }

  if (url.pathname === '/api/whisper' && req.method === 'POST') {
    try {
      let body = '';
      for await (const chunk of req) body += chunk;
      const json = body ? JSON.parse(body) : {};

      const { audioBase64, mimeType = 'audio/webm' } = json;
      if (!audioBase64) {
        return sendJson(res, 400, { success: false, error: 'Missing audioBase64 in request body' });
      }
      if (!OPENAI_KEY) {
        return sendJson(res, 500, { success: false, error: 'OPENAI_API_KEY is not set on the server.' });
      }

      const audioBuffer = Buffer.from(audioBase64, 'base64');
      const formData = new FormData();
      const filename = mimeType.includes('wav') ? 'audio.wav' : 'audio.webm';
      formData.append('file', new Blob([audioBuffer], { type: mimeType }), filename);
      formData.append('model', 'whisper-1');

      const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: formData
      });

      const raw = await resp.text();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return sendJson(res, resp.status, { success: false, error: 'OpenAI Whisper returned non-JSON', raw });
      }

      if (!resp.ok) {
        return sendJson(res, resp.status, { success: false, error: data?.error || 'OpenAI Whisper error', raw: data });
      }

      return sendJson(res, 200, { success: true, data });
    } catch (err) {
      console.error('Whisper error:', err);
      return sendJson(res, 500, { success: false, error: String(err) });
    }
  }

  // Fallback
  sendJson(res, 404, { success: false, error: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Local OpenAI proxy server listening on http://localhost:${PORT}`);
});
