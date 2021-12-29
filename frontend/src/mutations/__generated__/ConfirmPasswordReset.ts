/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ConfirmPasswordResetInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: ConfirmPasswordReset
// ====================================================

export interface ConfirmPasswordReset_resetPassword {
  __typename: "ResetPasswordMutation";
  confirm: boolean;
}

export interface ConfirmPasswordReset {
  resetPassword: ConfirmPasswordReset_resetPassword;
}

export interface ConfirmPasswordResetVariables {
  input: ConfirmPasswordResetInput;
}
