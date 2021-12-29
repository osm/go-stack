/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InitiatePasswordResetInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: InitiatePasswordReset
// ====================================================

export interface InitiatePasswordReset_resetPassword {
  __typename: "ResetPasswordMutation";
  initiate: boolean;
}

export interface InitiatePasswordReset {
  resetPassword: InitiatePasswordReset_resetPassword;
}

export interface InitiatePasswordResetVariables {
  input: InitiatePasswordResetInput;
}
