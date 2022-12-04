import React from 'react'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import { Table, Button, Input } from 'reactstrap'
import { FormattedMessage } from 'react-intl'

import userCurrentUserId from './use-current-user-id'
import { addTodoToCache, deleteTodoFromCache } from './todo-cache'

import {
  ListTodosQuery,
  ListTodosQueryVariables,
  UpdateTodoMutation,
  UpdateTodoMutationVariables,
  CreatedTodosSubscription,
  CreatedTodosSubscriptionVariables,
  UpdatedTodosSubscription,
  UpdatedTodosSubscriptionVariables,
  DeletedTodosSubscription,
  DeletedTodosSubscriptionVariables,
} from './types'
import QUERY from './queries/ListTodos.graphql'
import MUTATION_UPDATE from './mutations/UpdateTodo.graphql'
import SUBSCRIPTION_CREATED from './subscriptions/CreatedTodos.graphql'
import SUBSCRIPTION_UPDATED from './subscriptions/UpdatedTodos.graphql'
import SUBSCRIPTION_DELETED from './subscriptions/DeletedTodos.graphql'

const ListTodosPage: React.FC = () => {
  const intl = useIntl()
  const userId = userCurrentUserId()

  const variables = !userId
    ? undefined
    : {
        userId,
        first: 5,
      }

  const {
    loading,
    data: queryData,
    fetchMore,
  } = useQuery<ListTodosQuery, ListTodosQueryVariables>(QUERY, {
    nextFetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !userId,
    variables,
  })

  const [mutateUpdate] = useMutation<UpdateTodoMutation, UpdateTodoMutationVariables>(MUTATION_UPDATE)

  useSubscription<CreatedTodosSubscription, CreatedTodosSubscriptionVariables>(SUBSCRIPTION_CREATED, {
    skip: !userId,
    variables: !userId ? undefined : { userId },
    onData: (ret) => {
      const { client, data } = ret
      addTodoToCache({
        cache: client.cache,
        userId,
        data: data?.data?.createdTodos,
      })
    },
  })

  useSubscription<UpdatedTodosSubscription, UpdatedTodosSubscriptionVariables>(SUBSCRIPTION_UPDATED, {
    skip: !userId,
    variables: !userId ? undefined : { userId },
  })

  useSubscription<DeletedTodosSubscription, DeletedTodosSubscriptionVariables>(SUBSCRIPTION_DELETED, {
    skip: !userId,
    variables: !userId ? undefined : { userId },
    onData: (ret) => {
      const { client, data } = ret
      deleteTodoFromCache({ cache: client.cache, id: data?.data?.deletedTodos })
    },
  })

  const todos = (queryData?.user?.todos?.edges ?? []).map(({ node }) => node)
  const pageInfo = queryData?.user?.todos?.pageInfo

  return loading ? (
    <p>Loading...</p>
  ) : (
    <>
      <Table>
        <thead>
          <tr>
            <th>
              <FormattedMessage id="list-todo.title-label" defaultMessage="Title" />
            </th>
            <th>
              <FormattedMessage id="list-todo.modified-at-label" defaultMessage="Modified at" />
            </th>
            <th>
              <FormattedMessage id="list-todo.number-of-files" defaultMessage="# files" />
            </th>
            <th>
              <FormattedMessage id="list-todo.is-done-label" defaultMessage="Is done" />
            </th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            const date = todo?.updatedAt || todo?.createdAt
            return (
              <tr key={todo?.id}>
                <td>
                  <Link to={`/todo/${todo?.id}`}>{todo?.title}</Link>
                </td>
                <td>
                  <Link to={`/todo/${todo?.id}`}>
                    {intl.formatDate(date)}{' '}
                    {intl.formatTime(date, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                  </Link>
                </td>
                <td>
                  <Link to={`/todo/${todo?.id}`}>{todo?.files?.length ?? 0}</Link>
                </td>
                <td>
                  <Input
                    type="checkbox"
                    checked={todo?.isDone}
                    onChange={() => {
                      mutateUpdate({
                        variables:
                          !userId || !todo?.id
                            ? undefined
                            : {
                                userId,
                                todoId: todo?.id,
                                patch: {
                                  isDone: !todo?.isDone,
                                },
                              },
                      })
                    }}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          {pageInfo?.hasNextPage && (
            <tr>
              <td colSpan={3}>
                <Button
                  disabled={loading}
                  size="sm"
                  onClick={() => {
                    fetchMore({ variables: { ...variables, after: pageInfo?.endCursor } })
                  }}
                >
                  <FormattedMessage id="list-todo.load-more-button" defaultMessage="Load more" />
                </Button>
              </td>
            </tr>
          )}
        </tfoot>
      </Table>
    </>
  )
}

export default ListTodosPage
