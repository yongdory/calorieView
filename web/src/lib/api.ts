import { getAccessToken, supabase } from './supabase';

export interface FoodItem {
  name: string;
  estimatedGrams: number;
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
}

export interface AnalyzeResponse {
  items: FoodItem[];
  totals: { kcal: number; carbG: number; proteinG: number; fatG: number };
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

export async function analyzeFoodImage(file: File): Promise<AnalyzeResponse> {
  const resized = await resizeImage(file, 768);
  const imageBase64 = await toBase64(resized);
  const token = await getAccessToken();
  if (!token) throw new Error('로그인이 필요합니다');

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ imageBase64, mimeType: 'image/jpeg' }),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const result = (await res.json()) as AnalyzeResponse;

  const imageHash = await hashString(imageBase64);
  const imageUrl = await uploadMealImage(resized, imageHash);
  await saveMeal(result, imageHash, imageUrl);
  return result;
}

async function uploadMealImage(blob: Blob, hash: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const path = `${user.id}/${Date.now()}_${hash.slice(0, 12)}.jpg`;
  const { error } = await supabase.storage.from('meals').upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (error) {
    console.warn('image upload failed', error);
    return null;
  }
  const { data } = supabase.storage.from('meals').getPublicUrl(path);
  return data.publicUrl ?? null;
}

async function saveMeal(r: AnalyzeResponse, imageHash: string, imageUrl: string | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('meals').insert({
    user_id: user.id,
    total_kcal: r.totals.kcal,
    total_carb_g: r.totals.carbG,
    total_protein_g: r.totals.proteinG,
    total_fat_g: r.totals.fatG,
    items: r.items,
    image_hash: imageHash,
    image_url: imageUrl,
  });
  if (error) console.warn('meal save failed', error);
}

async function toBase64(blob: Blob): Promise<string> {
  const buf = await blob.arrayBuffer();
  const bytes = new Uint8Array(buf);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

async function hashString(s: string): Promise<string> {
  const buf = new TextEncoder().encode(s);
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function resizeImage(file: File, maxDim: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.85 });
}
