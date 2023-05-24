export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  account?: string;
  email?: string;
  role?: string;
}
