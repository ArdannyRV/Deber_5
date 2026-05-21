export interface User {
  id: string;
  email: string;
  name?: string;
}

export type ActivityType = 'deber' | 'taller' | 'prueba' | 'reunion';

export interface Activity {
  id: string;
  user_id: string;
  type: ActivityType;
  subject: string;
  deadline: string;
  created_at: string;
}
