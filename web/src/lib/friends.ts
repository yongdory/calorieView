import { supabase, getAccessToken } from './supabase';

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ?? (typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:8787'
        : 'https://calorieview-api.yongdory.workers.dev');
const KAKAO_TOKEN_KEY = 'cv_kakao_access_token';

export interface FriendSummary {
  friend_id: string;
  display_name: string | null;
  avatar_url: string | null;
  nickname: string | null;
  today_kcal: number;
  last_eaten_at: string | null;
}

export interface FriendMealRow {
  id: string;
  eaten_at: string;
  total_kcal: number;
  total_carb_g: number;
  total_protein_g: number;
  total_fat_g: number;
  items: Array<{ name: string; kcal: number; estimatedGrams: number }>;
  image_url: string | null;
}

export function rememberKakaoToken(token: string | null) {
  if (!token) return;
  try { sessionStorage.setItem(KAKAO_TOKEN_KEY, token); } catch { /* ignore */ }
}

export function getKakaoToken(): string | null {
  try { return sessionStorage.getItem(KAKAO_TOKEN_KEY); } catch { return null; }
}

export async function syncKakaoFriends(): Promise<{ matched: number; added: number }> {
  const kakaoAccessToken = getKakaoToken();
  if (!kakaoAccessToken) {
    throw new Error('카카오 로그인 후 다시 시도해주세요');
  }
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/friends/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ kakaoAccessToken }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`동기화 실패: ${t.slice(0, 200)}`);
  }
  return await res.json() as { matched: number; added: number };
}

export async function fetchFriendsToday(): Promise<FriendSummary[]> {
  const { data, error } = await supabase
    .from('friends_today_summary')
    .select('friend_id, display_name, avatar_url, nickname, today_kcal, last_eaten_at')
    .order('today_kcal', { ascending: false });
  if (error) throw error;
  return (data as FriendSummary[]) ?? [];
}

export async function fetchFriendDay(friendId: string, date: Date): Promise<FriendMealRow[]> {
  const start = new Date(date); start.setHours(0, 0, 0, 0);
  const end = new Date(start); end.setDate(end.getDate() + 1);
  const { data, error } = await supabase
    .from('meals')
    .select('id, eaten_at, total_kcal, total_carb_g, total_protein_g, total_fat_g, items, image_url')
    .eq('user_id', friendId)
    .gte('eaten_at', start.toISOString())
    .lt('eaten_at', end.toISOString())
    .order('eaten_at', { ascending: true });
  if (error) throw error;
  return (data as FriendMealRow[]) ?? [];
}
