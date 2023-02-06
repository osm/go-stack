import 'bootstrap/dist/css/bootstrap.css'
import './custom.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import AuthProvider from './auth-provider'
import ApolloProvider from './apollo-provider'
import IntlProvider from './intl-provider'
import App from './app'

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <ApolloProvider>
    <AuthProvider>
      <IntlProvider>
        <App />
      </IntlProvider>
    </AuthProvider>
  </ApolloProvider>,
)
