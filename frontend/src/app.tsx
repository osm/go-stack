import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import CreateTodo from './create-todo'
import EditTodo from './edit-todo'
import ForgotPassword from './forgot-password'
import ListTodos from './list-todos'
import LogIn from './log-in'
import Menu from './menu'
import NotFound from './not-found'
import ResetPassword from './reset-password'
import SignUp from './sign-up'

import { useAuthContext } from './auth-provider'

const App: React.FC = () => {
  const { userId } = useAuthContext()

  return (
    <div className="container-fluid">
      <Router>
        <Menu />
        <div className="container mt-4">
          <Switch>
            <Route exact path="/login">
              <LogIn />
            </Route>
            <Route exact path="/create-todo">
              <CreateTodo />
            </Route>
            <Route exact path="/forgot-password">
              <ForgotPassword />
            </Route>
            <Route exact path="/reset-password/:token">
              <ResetPassword />
            </Route>
            <Route exact path="/todo/:id">
              <EditTodo />
            </Route>
            <Route exact path="/">
              {userId ? <ListTodos /> : <SignUp />}
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
