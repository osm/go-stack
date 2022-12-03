import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

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
          <Routes>
            <Route path="/login" element={<LogIn />} />
            <Route path="/create-todo" element={<CreateTodo />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/todo/:id" element={<EditTodo />} />
            <Route path="/" element={userId ? <ListTodos /> : <SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
