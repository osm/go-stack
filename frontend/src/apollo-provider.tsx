import React from 'react'
import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider as ReactApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'
import { relayStylePagination } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'

import { getAuth } from './auth-provider'

const graphqlUrl = process.env.GRAPHQL_URL || null
const graphqlWsUrl = process.env.GRAPHQL_WS_URL || null

const newSplitLink = () => {
  const host = window.location.host.replace(/\/$/, '')

  return split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    new GraphQLWsLink(
      createClient({
        url: graphqlWsUrl || `ws://${host}/graphql`,
        connectionParams: () => {
          const { token } = getAuth()
          return token ? { Authorization: `Bearer ${token}` } : {}
        },
      }),
    ),
    createUploadLink({
      uri: graphqlUrl || '/graphql',
    }),
  )
}

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

const ApolloProvider: React.FC<{
  children?: React.ReactNode
}> = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <ReactApolloProvider client={client}>{children}</ReactApolloProvider>
    </>
  )
}

export default ApolloProvider
