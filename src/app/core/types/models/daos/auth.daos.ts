import { AccountType } from '../user';

export type LoginResponse = {
  token: string;
  role: AccountType;
};

export type RegisterResponse = LoginResponse;

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = LoginRequest;
