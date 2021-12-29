/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: Todo
// ====================================================

export interface Todo_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface Todo {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (Todo_files | null)[] | null;
}
