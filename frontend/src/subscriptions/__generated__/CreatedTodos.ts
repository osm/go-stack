/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL subscription operation: CreatedTodos
// ====================================================

export interface CreatedTodos_createdTodos_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface CreatedTodos_createdTodos {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (CreatedTodos_createdTodos_files | null)[] | null;
}

export interface CreatedTodos {
  createdTodos: CreatedTodos_createdTodos;
}

export interface CreatedTodosVariables {
  userId: string;
}
