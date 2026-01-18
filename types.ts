
export interface User {
  id: string;
  username: string;
  level: number;
  xp: number;
}

export interface Resolution {
  id: string;
  userId: string;
  title: string;
  category: 'Health' | 'Coding' | 'Reading' | 'Finance' | 'Other';
  streak: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  totalCompletions: number;
  createdAt: string;
}

export interface DailyLog {
  id: string;
  resolutionId: string;
  userId: string;
  date: string; // YYYY-MM-DD
}

export type AuthState = {
  user: User | null;
  isLoading: boolean;
};

export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  COACH = 'COACH'
}
