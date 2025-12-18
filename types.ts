
export interface Problem {
  id: number;
  frontendId: string;
  title: string;
  titleSlug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface DailyState {
  date: string;
  problem: Problem;
  status: 'todo' | 'completed';
  code: string;
}

export interface NotificationConfig {
  enabled: boolean;
  time: string; // HH:mm format
}
