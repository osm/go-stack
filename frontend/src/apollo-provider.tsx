import React from 'react'
import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider as ReactApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'
import { relayStylePagination } from '@apollo/client/utilities'

import { getAuth } from './auth-provider'

const graphqlUrl = process.env.GRAPHQL_URL || 'http://localhost:4000/graphql'
const graphqlWsUrl = process.env.GRAPHQL_WS_URL || 'ws://localhost:4000/graphql'

const wsLink = new WebSocketLink({
  uri: graphqlWsUrl,
  options: {
    reconnect: true,
    connectionParams: () => {
      const { token } = getAuth()
      return token ? { Authorization: `Bearer ${token}` } : {}
    },
  },
})

const httpLink = createUploadLink({
  uri: graphqlUrl,
})

const newSplitLink = () =>
  split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink,
  )

const authLink = setContext((_, { headers }) => {
  const { token } = getAuth()

  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(newSplitLink()),
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        fields: {
          todos: relayStylePagination(),
        },
      },
      Todo: {
        fields: {
          files: {
            merge(_, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }),
})

const ApolloProvider: React.FC = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <ReactApolloProvider client={client}>{children}</ReactApolloProvider>
    </>
  )
}

export default ApolloProvider
