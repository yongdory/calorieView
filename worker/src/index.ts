export interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  MFDS_API_KEY?: string;
  IMG_CACHE?: KVNamespace;
}

interface AnalyzeRequest {
  imageBase64: string;
  mimeType?: string;
}

interface FoodItem {
  name: string;
  estimatedGrams: number;
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
}

interface AnalyzeResponse {
  items: FoodItem[];
  totals: { kcal: number; carbG: number; proteinG: number; fatG: number };
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const PROMPT = `You are a nutrition estimator. Analyze the food photo and respond with ONLY valid JSON matching this schema:
{"items":[{"name":string,"estimatedGrams":number,"kcal":number,"carbG":number,"proteinG":number,"fatG":number}],"totals":{"kcal":number,"carbG":number,"proteinG":number,"fatG":number}}
Rules:
- Identify each distinct food. Use common Korean food names when applicable.
- Estimate portion in grams from visual cues (plate size, utensils).
- Compute macros per item and the overall totals.
- No prose, no markdown fences. JSON only.`;

async function verifyUser(env: Env, request: Request): Promise<{ id: string } | null> {
  const auth = request.headers.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  const token = auth.slice(7);
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: env.SUPABASE_ANON_KEY,
    },
  });
  if (!res.ok) return null;
  const user = await res.json() as { id?: string };
  return user.id ? { id: user.id } : null;
}

async function callGemini(env: Env, imageBase64: string, mimeType: string): Promise<AnalyzeResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`;
  const body = {
    contents: [{
      parts: [
        { text: PROMPT },
        { inline_data: { mime_type: mimeType, data: imageBase64 } },
      ],
    }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Gemini ${res.status} raw:`, errText.slice(0, 1500));
    if (res.status === 429) {
      const isDaily = /PerDay/i.test(errText);
      const retryMatch = errText.match(/"retryDelay":\s*"(\d+)s"/);
      const retrySec = retryMatch ? retryMatch[1] : '?';
      if (isDaily && retrySec !== '?' && parseInt(retrySec) > 3600) {
        throw new Error(`Gemini 일일 한도 소진. ${retrySec}초 후 재시도 가능.`);
      }
      throw new Error(`Gemini 분당 한도 초과. ${retrySec}초 후 재시도.`);
    }
    if (res.status === 403) {
      throw new Error('Gemini API 키가 유효하지 않거나 권한이 없습니다.');
    }
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    console.error('Gemini response missing text:', JSON.stringify(data).slice(0, 500));
    throw new Error('Empty Gemini response');
  }
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
  try {
    return JSON.parse(cleaned) as AnalyzeResponse;
  } catch (e) {
    console.error('Gemini JSON parse failed. Raw text:', cleaned.slice(0, 500));
    throw new Error('Gemini returned non-JSON');
  }
}

async function hashBase64(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function jsonResponse(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders, ...extra },
  });
}

async function fetchKakaoAppFriends(accessToken: string): Promise<string[]> {
  const ids: string[] = [];
  let url: string | null = 'https://kapi.kakao.com/v1/api/talk/friends?limit=100';
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Kakao friends ${res.status}: ${txt.slice(0, 200)}`);
    }
    const data = await res.json() as {
      elements?: Array<{ id: number | string }>;
      after_url?: string | null;
    };
    for (const el of data.elements ?? []) ids.push(String(el.id));
    url = data.after_url ?? null;
  }
  return ids;
}

async function syncFriendships(env: Env, userId: string, kakaoFriendIds: string[]): Promise<{ matched: number; added: number }> {
  const headers = {
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    apikey: env.SUPABASE_SERVICE_ROLE_KEY!,
    'Content-Type': 'application/json',
  };

  if (kakaoFriendIds.length === 0) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ kakao_friends_synced_at: new Date().toISOString() }),
    });
    return { matched: 0, added: 0 };
  }

  const inList = kakaoFriendIds.map(s => `"${s}"`).join(',');
  const profRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/profiles?select=id,kakao_id&kakao_id=in.(${inList})`,
    { headers },
  );
  if (!profRes.ok) throw new Error(`profiles lookup ${profRes.status}: ${await profRes.text()}`);
  const matched = await profRes.json() as Array<{ id: string; kakao_id: string }>;
  const matchedIds = matched.map(p => p.id).filter(id => id !== userId);

  if (matchedIds.length === 0) {
    await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH', headers,
      body: JSON.stringify({ kakao_friends_synced_at: new Date().toISOString() }),
    });
    return { matched: 0, added: 0 };
  }

  const rows = matchedIds.flatMap(fid => [
    { user_id: userId, friend_id: fid, source: 'kakao' },
    { user_id: fid, friend_id: userId, source: 'kakao' },
  ]);
  const insertRes = await fetch(
    `${env.SUPABASE_URL}/rest/v1/friendships?on_conflict=user_id,friend_id`,
    {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify(rows),
    },
  );
  if (!insertRes.ok) throw new Error(`friendships insert ${insertRes.status}: ${await insertRes.text()}`);

  await fetch(`${env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
    method: 'PATCH', headers,
    body: JSON.stringify({ kakao_friends_synced_at: new Date().toISOString() }),
  });

  return { matched: matchedIds.length, added: rows.length };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return jsonResponse({ ok: true });
    }

    if (url.pathname === '/account' && request.method === 'DELETE') {
      const user = await verifyUser(env, request);
      if (!user) return jsonResponse({ error: 'unauthorized' }, 401);
      if (!env.SUPABASE_SERVICE_ROLE_KEY) {
        return jsonResponse({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, 500);
      }
      const res = await fetch(`${env.SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        },
      });
      if (!res.ok) return jsonResponse({ error: `delete failed: ${res.status}` }, 500);
      return jsonResponse({ ok: true });
    }

    if (url.pathname === '/friends/sync' && request.method === 'POST') {
      const user = await verifyUser(env, request);
      if (!user) return jsonResponse({ error: 'unauthorized' }, 401);
      if (!env.SUPABASE_SERVICE_ROLE_KEY) {
        return jsonResponse({ error: 'SUPABASE_SERVICE_ROLE_KEY not configured' }, 500);
      }
      try {
        const { kakaoAccessToken } = await request.json() as { kakaoAccessToken?: string };
        if (!kakaoAccessToken) return jsonResponse({ error: 'kakaoAccessToken required' }, 400);

        const kakaoFriendIds = await fetchKakaoAppFriends(kakaoAccessToken);
        const result = await syncFriendships(env, user.id, kakaoFriendIds);
        return jsonResponse({ ok: true, ...result });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown';
        console.error('/friends/sync error:', msg);
        return jsonResponse({ error: msg }, 500);
      }
    }

    if (url.pathname === '/analyze' && request.method === 'POST') {
      const user = await verifyUser(env, request);
      if (!user) return jsonResponse({ error: 'unauthorized' }, 401);

      try {
        const { imageBase64, mimeType = 'image/jpeg' } = await request.json() as AnalyzeRequest;
        if (!imageBase64) return jsonResponse({ error: 'imageBase64 required' }, 400);

        const cacheKey = await hashBase64(imageBase64);
        if (env.IMG_CACHE) {
          const cached = await env.IMG_CACHE.get(cacheKey);
          if (cached) {
            return new Response(cached, {
              headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT', ...corsHeaders },
            });
          }
        }

        const result = await callGemini(env, imageBase64, mimeType);
        const payload = JSON.stringify(result);

        if (env.IMG_CACHE) {
          await env.IMG_CACHE.put(cacheKey, payload, { expirationTtl: 60 * 60 * 24 * 30 });
        }

        return new Response(payload, {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'MISS', ...corsHeaders },
        });
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'unknown';
        console.error('/analyze error:', msg, e instanceof Error ? e.stack : '');
        return jsonResponse({ error: msg }, 500);
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
};
