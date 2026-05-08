import { supabase } from './supabase';
import { dailyMacroTargets, type MacroTargets, type UserProfile } from './nutrition';

export interface ProfileRow {
  id: string;
  nickname: string | null;
  sex: 'male' | 'female' | null;
  age_years: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  activity: UserProfile['activity'] | null;
  daily_kcal_target: number | null;
  kakao_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  share_with_friends: boolean | null;
  kakao_friends_synced_at: string | null;
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, nickname, sex, age_years, weight_kg, height_cm, activity, daily_kcal_target, kakao_id, display_name, avatar_url, share_with_friends, kakao_friends_synced_at')
    .eq('id', userId)
    .maybeSingle();
  return (data as ProfileRow) ?? null;
}

export function isProfileComplete(p: ProfileRow | null): boolean {
  if (!p) return false;
  return !!(p.nickname && p.sex && p.age_years && p.weight_kg && p.height_cm && p.activity);
}

export function targetsFromProfile(p: ProfileRow): MacroTargets {
  return dailyMacroTargets({
    sex: p.sex!,
    ageYears: p.age_years!,
    weightKg: Number(p.weight_kg),
    heightCm: Number(p.height_cm),
    activity: p.activity!,
  });
}
