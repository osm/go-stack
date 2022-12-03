import { ApolloCache } from '@apollo/client'

import TodoFragment from './fragments/Todo.graphql'
import { Todo, Todos } from './types'

const addTodoToCache = ({
  cache,
  userId,
  data,
}: {
  cache: ApolloCache<unknown>
  userId: string | null
  data: Todo | null | undefined
}): void => {
  cache.modify({
    id: cache.identify({ __typename: 'User', id: userId }),
    fields: {
      todos(existing: Todos) {
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
