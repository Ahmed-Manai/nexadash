export type UserRole = 'Admin' | 'Editor' | 'Viewer';

export type UserStatus = 'active' | 'invited' | 'suspended';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  // ISO date (yyyy-mm-dd) — sorts correctly as a plain string
  joined: string;
}

// The signed-in user's editable profile (Settings page)
export interface UserProfile {
  fullName: string;
  email: string;
  jobTitle: string;
  company: string;
  bio: string;
}
