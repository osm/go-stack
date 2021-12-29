/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TodoPatch } from "./../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTodo
// ====================================================

export interface UpdateTodo_user_todo_update_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface UpdateTodo_user_todo_update {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (UpdateTodo_user_todo_update_files | null)[] | null;
}

export interface UpdateTodo_user_todo {
  __typename: "TodoMutation";
  update: UpdateTodo_user_todo_update | null;
}

export interface UpdateTodo_user {
  __typename: "UserMutation";
  todo: UpdateTodo_user_todo;
}

export interface UpdateTodo {
  user: UpdateTodo_user;
}

export interface UpdateTodoVariables {
  userId: string;
  todoId: string;
  patch: TodoPatch;
}
