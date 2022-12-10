import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const CreateTodo = React.lazy(() => import('./create-todo'))
const EditTodo = React.lazy(() => import('./edit-todo'))
const ForgotPassword = React.lazy(() => import('./forgot-password'))
const ListTodos = React.lazy(() => import('./list-todos'))
const LogIn = React.lazy(() => import('./log-in'))
const Menu = React.lazy(() => import('./menu'))
const NotFound = React.lazy(() => import('./not-found'))
const ResetPassword = React.lazy(() => import('./reset-password'))
const SignUp = React.lazy(() => import('./sign-up'))

import { useAuthContext } from './auth-provider'

const App: React.FC = () => {
  const { userId } = useAuthContext()

  return (
    <div className="container-fluid">
      <Router>
        <Menu />
        <div className="container mt-4">
          <Routes>
            <Route
              path="/login"
              element={
                <React.Suspense fallback={<>...</>}>
                  <LogIn />
                </React.Suspense>
              }
            />
            <Route
              path="/create-todo"
              element={
                <React.Suspense fallback={<>...</>}>
                  <CreateTodo />
                </React.Suspense>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <React.Suspense fallback={<>...</>}>
                  <ForgotPassword />
                </React.Suspense>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <React.Suspense fallback={<>...</>}>
                  <ResetPassword />
                </React.Suspense>
              }
            />
            <Route
              path="/todo/:id"
              element={
                <React.Suspense fallback={<>...</>}>
                  <EditTodo />
                </React.Suspense>
              }
            />
            <Route
              path="/"
              element={<React.Suspense fallback={<>...</>}>{userId ? <ListTodos /> : <SignUp />}</React.Suspense>}
            />
            <Route
              path="*"
              element={
                <React.Suspense fallback={<>...</>}>
                  <NotFound />
                </React.Suspense>
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
