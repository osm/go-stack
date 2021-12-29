/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TodoInput } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTodo
// ====================================================

export interface CreateTodo_user_todos_create_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface CreateTodo_user_todos_create {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (CreateTodo_user_todos_create_files | null)[] | null;
}

export interface CreateTodo_user_todos {
  __typename: "TodosMutation";
  create: CreateTodo_user_todos_create | null;
}

export interface CreateTodo_user {
  __typename: "UserMutation";
  todos: CreateTodo_user_todos;
}

export interface CreateTodo {
  user: CreateTodo_user;
}

export interface CreateTodoVariables {
  userId: string;
  input: TodoInput;
}
