/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: UpdatedTodos
// ====================================================

export interface UpdatedTodos_updatedTodos_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface UpdatedTodos_updatedTodos {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (UpdatedTodos_updatedTodos_files | null)[] | null;
}

export interface UpdatedTodos {
  updatedTodos: UpdatedTodos_updatedTodos;
}

export interface UpdatedTodosVariables {
  userId: string;
}
