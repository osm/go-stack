/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SignupInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Signup
// ====================================================

export interface Signup_signup {
  __typename: "User";
  id: string;
}

export interface Signup {
  signup: Signup_signup | null;
}

export interface SignupVariables {
  input: SignupInput;
}
