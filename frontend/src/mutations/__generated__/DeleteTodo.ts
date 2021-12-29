/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTodo
// ====================================================

export interface DeleteTodo_user_todo {
  __typename: "TodoMutation";
  delete: string;
}

export interface DeleteTodo_user {
  __typename: "UserMutation";
  todo: DeleteTodo_user_todo;
}

export interface DeleteTodo {
  user: DeleteTodo_user;
}

export interface DeleteTodoVariables {
  userId: string;
  todoId: string;
}
