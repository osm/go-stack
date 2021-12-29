/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteUser
// ====================================================

export interface DeleteUser_user {
  __typename: "UserMutation";
  delete: string;
}

export interface DeleteUser {
  user: DeleteUser_user;
}

export interface DeleteUserVariables {
  userId: string;
}
