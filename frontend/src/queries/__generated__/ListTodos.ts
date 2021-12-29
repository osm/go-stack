/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListTodos
// ====================================================

export interface ListTodos_user_todos_pageInfo {
  __typename: "PageInfo";
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface ListTodos_user_todos_edges_node_files {
  __typename: "TodoFile";
  id: string;
  createdAt: any;
  updatedAt: any | null;
}

export interface ListTodos_user_todos_edges_node {
  __typename: "Todo";
  id: string;
  title: string;
  content: string | null;
  isDone: boolean;
  createdAt: any;
  updatedAt: any | null;
  files: (ListTodos_user_todos_edges_node_files | null)[] | null;
}

export interface ListTodos_user_todos_edges {
  __typename: "TodoEdge";
  node: ListTodos_user_todos_edges_node | null;
}

export interface ListTodos_user_todos {
  __typename: "Todos";
  pageInfo: ListTodos_user_todos_pageInfo;
  edges: ListTodos_user_todos_edges[];
}

export interface ListTodos_user {
  __typename: "User";
  id: string;
  todos: ListTodos_user_todos | null;
}

export interface ListTodos {
  user: ListTodos_user | null;
}

export interface ListTodosVariables {
  userId: string;
  first?: number | null;
  after?: string | null;
}
