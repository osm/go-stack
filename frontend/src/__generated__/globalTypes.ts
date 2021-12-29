/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface ConfirmPasswordResetInput {
  token: string;
  password: string;
}

export interface InitiatePasswordResetInput {
  username: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RefreshTokenInput {
  token: string;
}

export interface SignupInput {
  username: string;
  password: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface TodoInput {
  title: string;
  content?: string | null;
  isDone?: boolean | null;
}

export interface TodoPatch {
  title?: string | null;
  content?: string | null;
  isDone?: boolean | null;
}

export interface UserPatch {
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  currentPassword?: string | null;
  newPassword?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
