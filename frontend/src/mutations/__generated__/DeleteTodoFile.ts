/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTodoFile
// ====================================================

export interface DeleteTodoFile_user_todo_file_delete_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface DeleteTodoFile_user_todo_file_delete {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (DeleteTodoFile_user_todo_file_delete_files | null)[] | null;
}

export interface DeleteTodoFile_user_todo_file {
  __typename: "TodoFileMutation";
  delete: DeleteTodoFile_user_todo_file_delete | null;
}

export interface DeleteTodoFile_user_todo {
  __typename: "TodoMutation";
  file: DeleteTodoFile_user_todo_file | null;
}

export interface DeleteTodoFile_user {
  __typename: "UserMutation";
  todo: DeleteTodoFile_user_todo;
}

export interface DeleteTodoFile {
  user: DeleteTodoFile_user;
}

export interface DeleteTodoFileVariables {
  userId: string;
  todoId: string;
  fileId: string;
}
