export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Time: any
  Upload: any
}

export type ConfirmPasswordResetInput = {
  password: Scalars['String']
  token: Scalars['String']
}

export type InitiatePasswordResetInput = {
  username: Scalars['String']
}

export type LoginInput = {
  password: Scalars['String']
  username: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  login: Scalars['String']
  refreshToken: Scalars['String']
  resetPassword: ResetPasswordMutation
  signup?: Maybe<User>
  user: UserMutation
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationRefreshTokenArgs = {
  input: RefreshTokenInput
}

export type MutationSignupArgs = {
  input: SignupInput
}

export type MutationUserArgs = {
  userId: Scalars['ID']
}

export type PageInfo = {
  __typename?: 'PageInfo'
  endCursor?: Maybe<Scalars['ID']>
  hasNextPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['ID']>
}

export type Query = {
  __typename?: 'Query'
  user?: Maybe<User>
}

export type QueryUserArgs = {
  userId: Scalars['ID']
}

export type RefreshTokenInput = {
  token: Scalars['String']
}

export type ResetPasswordMutation = {
  __typename?: 'ResetPasswordMutation'
  confirm: Scalars['Boolean']
  initiate: Scalars['Boolean']
}

export type ResetPasswordMutationConfirmArgs = {
  input: ConfirmPasswordResetInput
}

export type ResetPasswordMutationInitiateArgs = {
  input: InitiatePasswordResetInput
}

export type SignupInput = {
  email: Scalars['String']
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  password: Scalars['String']
  username: Scalars['String']
}

export type Subscription = {
  __typename?: 'Subscription'
  createdTodos: Todo
  deletedTodos: Scalars['ID']
  updatedTodos: Todo
}

export type SubscriptionCreatedTodosArgs = {
  userId: Scalars['ID']
}

export type SubscriptionDeletedTodosArgs = {
  userId: Scalars['ID']
}

export type SubscriptionUpdatedTodosArgs = {
  userId: Scalars['ID']
}

export type Todo = {
  __typename?: 'Todo'
  content?: Maybe<Scalars['String']>
  createdAt: Scalars['Time']
  files?: Maybe<Array<Maybe<TodoFile>>>
  id: Scalars['ID']
  isDone: Scalars['Boolean']
  title: Scalars['String']
  updatedAt?: Maybe<Scalars['Time']>
  userId: Scalars['ID']
}

export type TodoEdge = {
  __typename?: 'TodoEdge'
  cursor: Scalars['ID']
  node?: Maybe<Todo>
}

export type TodoFile = {
  __typename?: 'TodoFile'
  createdAt: Scalars['Time']
  id: Scalars['ID']
  updatedAt?: Maybe<Scalars['Time']>
}

export type TodoFileMutation = {
  __typename?: 'TodoFileMutation'
  delete?: Maybe<Todo>
}

export type TodoFilesMutation = {
  __typename?: 'TodoFilesMutation'
  create?: Maybe<Todo>
}

export type TodoFilesMutationCreateArgs = {
  file: Scalars['Upload']
}

export type TodoInput = {
  content?: InputMaybe<Scalars['String']>
  isDone?: InputMaybe<Scalars['Boolean']>
  title: Scalars['String']
}

export type TodoMutation = {
  __typename?: 'TodoMutation'
  delete: Scalars['ID']
  file?: Maybe<TodoFileMutation>
  files?: Maybe<TodoFilesMutation>
  update?: Maybe<Todo>
}

export type TodoMutationFileArgs = {
  fileId: Scalars['ID']
}

export type TodoMutationUpdateArgs = {
  patch: TodoPatch
}

export type TodoPatch = {
  content?: InputMaybe<Scalars['String']>
  isDone?: InputMaybe<Scalars['Boolean']>
  title?: InputMaybe<Scalars['String']>
}

export type Todos = {
  __typename?: 'Todos'
  edges: Array<TodoEdge>
  pageInfo: PageInfo
}

export type TodosMutation = {
  __typename?: 'TodosMutation'
  create?: Maybe<Todo>
}

export type TodosMutationCreateArgs = {
  input: TodoInput
}

export type User = {
  __typename?: 'User'
  createdAt: Scalars['Time']
  email: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  id: Scalars['ID']
  lastName?: Maybe<Scalars['String']>
  todo?: Maybe<Todo>
  todos?: Maybe<Todos>
  updatedAt?: Maybe<Scalars['Time']>
  username: Scalars['String']
}

export type UserTodoArgs = {
  todoId: Scalars['ID']
}

export type UserTodosArgs = {
  after?: InputMaybe<Scalars['String']>
  first?: InputMaybe<Scalars['Int']>
}

export type UserMutation = {
  __typename?: 'UserMutation'
  delete: Scalars['ID']
  todo: TodoMutation
  todos: TodosMutation
  update?: Maybe<User>
}

export type UserMutationTodoArgs = {
  todoId: Scalars['ID']
}

export type UserMutationUpdateArgs = {
  input: UserPatch
}

export type UserPatch = {
  currentPassword?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  firstName?: InputMaybe<Scalars['String']>
  lastName?: InputMaybe<Scalars['String']>
  newPassword?: InputMaybe<Scalars['String']>
  username?: InputMaybe<Scalars['String']>
}

export type TodoFragment = {
  __typename?: 'Todo'
  id: string
  title: string
  content?: string | null
  isDone: boolean
  createdAt: any
  updatedAt?: any | null
  userId: string
  files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
}

export type ConfirmPasswordResetMutationVariables = Exact<{
  input: ConfirmPasswordResetInput
}>

export type ConfirmPasswordResetMutation = {
  __typename?: 'Mutation'
  resetPassword: { __typename?: 'ResetPasswordMutation'; confirm: boolean }
}

export type CreateTodoMutationVariables = Exact<{
  userId: Scalars['ID']
  input: TodoInput
}>

export type CreateTodoMutation = {
  __typename?: 'Mutation'
  user: {
    __typename?: 'UserMutation'
    todos: {
      __typename?: 'TodosMutation'
      create?: {
        __typename?: 'Todo'
        id: string
        title: string
        content?: string | null
        isDone: boolean
        createdAt: any
        updatedAt?: any | null
        userId: string
        files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
      } | null
    }
  }
}

export type CreateTodoFileMutationVariables = Exact<{
  userId: Scalars['ID']
  todoId: Scalars['ID']
  file: Scalars['Upload']
}>

export type CreateTodoFileMutation = {
  __typename?: 'Mutation'
  user: {
    __typename?: 'UserMutation'
    todo: {
      __typename?: 'TodoMutation'
      files?: {
        __typename?: 'TodoFilesMutation'
        create?: {
          __typename?: 'Todo'
          id: string
          title: string
          content?: string | null
          isDone: boolean
          createdAt: any
          updatedAt?: any | null
          userId: string
          files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
        } | null
      } | null
    }
  }
}

export type DeleteTodoMutationVariables = Exact<{
  userId: Scalars['ID']
  todoId: Scalars['ID']
}>

export type DeleteTodoMutation = {
  __typename?: 'Mutation'
  user: { __typename?: 'UserMutation'; todo: { __typename?: 'TodoMutation'; delete: string } }
}

export type DeleteTodoFileMutationVariables = Exact<{
  userId: Scalars['ID']
  todoId: Scalars['ID']
  fileId: Scalars['ID']
}>

export type DeleteTodoFileMutation = {
  __typename?: 'Mutation'
  user: {
    __typename?: 'UserMutation'
    todo: {
      __typename?: 'TodoMutation'
      file?: {
        __typename?: 'TodoFileMutation'
        delete?: {
          __typename?: 'Todo'
          id: string
          title: string
          content?: string | null
          isDone: boolean
          createdAt: any
          updatedAt?: any | null
          userId: string
          files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
        } | null
      } | null
    }
  }
}

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID']
}>

export type DeleteUserMutation = { __typename?: 'Mutation'; user: { __typename?: 'UserMutation'; delete: string } }

export type InitiatePasswordResetMutationVariables = Exact<{
  input: InitiatePasswordResetInput
}>

export type InitiatePasswordResetMutation = {
  __typename?: 'Mutation'
  resetPassword: { __typename?: 'ResetPasswordMutation'; initiate: boolean }
}

export type LoginMutationVariables = Exact<{
  input: LoginInput
}>

export type LoginMutation = { __typename?: 'Mutation'; login: string }

export type RefreshTokenMutationVariables = Exact<{
  input: RefreshTokenInput
}>

export type RefreshTokenMutation = { __typename?: 'Mutation'; refreshToken: string }

export type SignupMutationVariables = Exact<{
  input: SignupInput
}>

export type SignupMutation = { __typename?: 'Mutation'; signup?: { __typename?: 'User'; id: string } | null }

export type UpdateTodoMutationVariables = Exact<{
  userId: Scalars['ID']
  todoId: Scalars['ID']
  patch: TodoPatch
}>

export type UpdateTodoMutation = {
  __typename?: 'Mutation'
  user: {
    __typename?: 'UserMutation'
    todo: {
      __typename?: 'TodoMutation'
      update?: {
        __typename?: 'Todo'
        id: string
        title: string
        content?: string | null
        isDone: boolean
        createdAt: any
        updatedAt?: any | null
        userId: string
        files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
      } | null
    }
  }
}

export type UpdateUserMutationVariables = Exact<{
  userId: Scalars['ID']
  input: UserPatch
}>

export type UpdateUserMutation = {
  __typename?: 'Mutation'
  user: { __typename?: 'UserMutation'; update?: { __typename?: 'User'; id: string } | null }
}

export type GetTodoQueryVariables = Exact<{
  userId: Scalars['ID']
  todoId: Scalars['ID']
}>

export type GetTodoQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'User'
    id: string
    todo?: {
      __typename?: 'Todo'
      id: string
      title: string
      content?: string | null
      isDone: boolean
      createdAt: any
      updatedAt?: any | null
      userId: string
      files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
    } | null
  } | null
}

export type GetUserQueryVariables = Exact<{
  userId: Scalars['ID']
}>

export type GetUserQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'User'
    id: string
    username: string
    email: string
    firstName?: string | null
    lastName?: string | null
  } | null
}

export type ListTodosQueryVariables = Exact<{
  userId: Scalars['ID']
  first?: InputMaybe<Scalars['Int']>
  after?: InputMaybe<Scalars['String']>
}>

export type ListTodosQuery = {
  __typename?: 'Query'
  user?: {
    __typename?: 'User'
    id: string
    todos?: {
      __typename?: 'Todos'
      pageInfo: { __typename?: 'PageInfo'; hasNextPage: boolean; endCursor?: string | null }
      edges: Array<{
        __typename?: 'TodoEdge'
        node?: {
          __typename?: 'Todo'
          id: string
          title: string
          content?: string | null
          isDone: boolean
          createdAt: any
          updatedAt?: any | null
          userId: string
          files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
        } | null
      }>
    } | null
  } | null
}

export type CreatedTodosSubscriptionVariables = Exact<{
  userId: Scalars['ID']
}>

export type CreatedTodosSubscription = {
  __typename?: 'Subscription'
  createdTodos: {
    __typename?: 'Todo'
    id: string
    title: string
    content?: string | null
    isDone: boolean
    createdAt: any
    updatedAt?: any | null
    userId: string
    files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
  }
}

export type DeletedTodosSubscriptionVariables = Exact<{
  userId: Scalars['ID']
}>

export type DeletedTodosSubscription = { __typename?: 'Subscription'; deletedTodos: string }

export type UpdatedTodosSubscriptionVariables = Exact<{
  userId: Scalars['ID']
}>

export type UpdatedTodosSubscription = {
  __typename?: 'Subscription'
  updatedTodos: {
    __typename?: 'Todo'
    id: string
    title: string
    content?: string | null
    isDone: boolean
    createdAt: any
    updatedAt?: any | null
    userId: string
    files?: Array<{ __typename?: 'TodoFile'; id: string; createdAt: any; updatedAt?: any | null } | null> | null
  }
}
