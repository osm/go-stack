/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTodoFile
// ====================================================

export interface CreateTodoFile_user_todo_files_create_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface CreateTodoFile_user_todo_files_create {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (CreateTodoFile_user_todo_files_create_files | null)[] | null;
}

export interface CreateTodoFile_user_todo_files {
  __typename: "TodoFilesMutation";
  create: CreateTodoFile_user_todo_files_create | null;
}

export interface CreateTodoFile_user_todo {
  __typename: "TodoMutation";
  files: CreateTodoFile_user_todo_files | null;
}

export interface CreateTodoFile_user {
  __typename: "UserMutation";
  todo: CreateTodoFile_user_todo;
}

export interface CreateTodoFile {
  user: CreateTodoFile_user;
}

export interface CreateTodoFileVariables {
  userId: string;
  todoId: string;
  file: any;
}
