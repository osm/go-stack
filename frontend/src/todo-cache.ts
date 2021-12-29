import { ApolloCache } from '@apollo/client'

import TodoFragment from './fragments/Todo.graphql'
import { CreateTodo_user_todos_create } from './mutations/__generated__/CreateTodo'
import { ListTodos_user_todos } from './queries/__generated__/ListTodos'

const addTodoToCache = ({
  cache,
  userId,
  data,
}: {
  cache: ApolloCache<unknown>
  userId: string | null
  data: CreateTodo_user_todos_create | null | undefined
}): void => {
  cache.modify({
    id: cache.identify({ __typename: 'User', id: userId }),
    fields: {
      todos(existing: ListTodos_user_todos) {
        const ref = cache.writeFragment({
          data,
          fragment: TodoFragment,
        })

        return {
          __typename: 'Todos',
          edges: [{ __typename: 'TodoEdge', node: ref }, ...existing?.edges],
          pageInfo: existing?.pageInfo,
        }
      },
    },
  })
}

const deleteTodoFromCache = ({ cache, id }: { cache: ApolloCache<unknown>; id: string | undefined }): void => {
  cache.evict({ id: cache.identify({ __typename: 'Todo', id }) })
  cache.gc()
}

export { addTodoToCache, deleteTodoFromCache }
