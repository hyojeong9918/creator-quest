const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

function send(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8').json(body);
}

export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (req.method === 'GET') {
    return send(res, 200, { configured: Boolean(apiKey), provider: 'gemini', model: MODEL });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { code: 'method_not_allowed', message: 'GET 또는 POST만 지원합니다.' });
  }
  if (!apiKey) {
    return send(res, 503, { code: 'api_not_configured', message: 'Vercel에 GEMINI_API_KEY가 설정되지 않았습니다.' });
  }

  const prompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
  if (!prompt) {
    return send(res, 400, { code: 'invalid_request', message: '프롬프트가 비어 있습니다.' });
  }
  if (prompt.length > 120000) {
    return send(res, 413, { code: 'prompt_too_large', message: '프롬프트가 너무 깁니다.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);

  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
      + encodeURIComponent(MODEL) + ':generateContent?key=' + encodeURIComponent(apiKey);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7
        }
      })
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const code = response.status === 429 ? 'rate_limited'
        : response.status === 400 ? 'invalid_request'
        : response.status === 401 || response.status === 403 ? 'not_granted'
        : 'upstream_error';
      return send(res, response.status, {
        code,
        message: payload?.error?.message || 'Gemini API 요청에 실패했습니다.'
      });
    }

    const text = (payload.candidates?.[0]?.content?.parts || [])
      .map(part => part.text || '')
      .join('')
      .trim();
    if (!text) {
      return send(res, 502, { code: 'empty_completion', message: 'Gemini 응답이 비어 있습니다.' });
    }

    let data;
    try {
      data = JSON.parse(text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, ''));
    } catch {
      return send(res, 502, { code: 'invalid_json', message: 'Gemini가 올바른 JSON을 반환하지 않았습니다.' });
    }
    return send(res, 200, { data, provider: 'gemini', model: MODEL });
  } catch (error) {
    const code = error?.name === 'AbortError' ? 'upstream_error' : 'upstream_error';
    return send(res, 502, { code, message: error?.name === 'AbortError' ? 'Gemini 응답 시간이 초과됐습니다.' : String(error?.message || error) });
  } finally {
    clearTimeout(timeout);
  }
}
