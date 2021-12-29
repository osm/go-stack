/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTodo
// ====================================================

export interface GetTodo_user_todo_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface GetTodo_user_todo {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (GetTodo_user_todo_files | null)[] | null;
}

export interface GetTodo_user {
  __typename: "User";
  id: string;
  todo: GetTodo_user_todo | null;
}

export interface GetTodo {
  user: GetTodo_user | null;
}

export interface GetTodoVariables {
  userId: string;
  todoId: string;
}
