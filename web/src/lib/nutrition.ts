export interface UserProfile {
  sex: 'male' | 'female';
  ageYears: number;
  weightKg: number;
  heightCm: number;
  activity: 'sedentary' | 'light' | 'moderate' | 'active';
}

const ACTIVITY_FACTOR = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
} as const;

export function dailyKcalTarget(p: UserProfile): number {
  const bmr = p.sex === 'male'
    ? 88.362 + 13.397 * p.weightKg + 4.799 * p.heightCm - 5.677 * p.ageYears
    : 447.593 + 9.247 * p.weightKg + 3.098 * p.heightCm - 4.330 * p.ageYears;
  return Math.round(bmr * ACTIVITY_FACTOR[p.activity]);
}

export interface MacroTargets {
  kcal: number;
  carbG: number;
  proteinG: number;
  fatG: number;
}

export function dailyMacroTargets(p: UserProfile): MacroTargets {
  const kcal = dailyKcalTarget(p);
  return {
    kcal,
    carbG: Math.round((kcal * 0.5) / 4),
    proteinG: Math.round((kcal * 0.2) / 4),
    fatG: Math.round((kcal * 0.3) / 9),
  };
}
