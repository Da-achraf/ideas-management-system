type BaseUser = {
  firstName: string;
  lastName: string;
  email: string;
};

export type User = BaseUser & {
  id: string;
  isActive: boolean;
  createdAt: string;
  role: number;
};

export type UpdateUser = User;

export type LoginUser = {
  email: string;
  password: string;
};

export type RegisterUser = BaseUser & {
  password: string;
};

type UserState = User & { token: string };

export type AuthState = {
  initialized: boolean; // whether the auth state data is initialized or not
  loggedIn: boolean;
  user: UserState;
};

export const initialUserValue: UserState = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  role: 0,
  token: '',
  isActive: false,
  createdAt: '',
};

export const authInitialState: AuthState = {
  initialized: false,
  loggedIn: false,
  user: initialUserValue,
};

export enum UserRole {
  Submitter = 0,
  Reviewer = 1,
  Admin = 2,
}

export enum RoleEnum {
  Submitter = 0,
  Reviewer = 1,
  Admin = 2,
  All = 3,
}

export const RoleDisplayNames: Record<RoleEnum, string> = {
  [RoleEnum.Submitter]: 'Submitter',
  [RoleEnum.Reviewer]: 'Reviewer',
  [RoleEnum.Admin]: 'Administrator',
  [RoleEnum.All]: 'All',
};

export type RoleDisplayNameType = (typeof RoleDisplayNames)[RoleEnum];
