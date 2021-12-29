/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserPatch } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_user_update {
  __typename: "User";
  id: string;
}

export interface UpdateUser_user {
  __typename: "UserMutation";
  update: UpdateUser_user_update | null;
}

export interface UpdateUser {
  user: UpdateUser_user;
}

export interface UpdateUserVariables {
  userId: string;
  input: UserPatch;
}
