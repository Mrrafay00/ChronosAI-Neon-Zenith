
export interface Task {
  id: string;
  description: string;
  startTime: number;
  endTime: number | null;
  duration: number; // In seconds
  category: string;
  aiImpact: number; // 1-10 scale
}

export interface PlannedTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Account {
  name: string;
  createdAt: number;
  avatarColor: string;
  persona: string; // User's job role/identity
  categories: string[]; // These are now "Mission Contexts" or "Projects"
  dailyFocusGoal: number; // In seconds
}

export interface DailySummary {
  date: string;
  totalDuration: number;
  categoryDistribution: Record<string, number>;
  productivityScore: number;
}
