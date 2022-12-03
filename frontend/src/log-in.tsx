import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap'

import { useAuthContext } from './auth-provider'

import MUTATION from './mutations/Login.graphql'
import { LoginMutation, LoginMutationVariables } from './types'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { setToken } = useAuthContext()

  const [mutate, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(MUTATION)

  const [username, setUsername] = React.useState<string | null>(null)
  const [password, setPassword] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables:
        !username || !password
          ? undefined
          : {
              input: {
                username,
                password,
              },
            },
    })
      .then((res) => setToken(res?.data?.login || ''))
      .then(() => navigate('/'))
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <Form>
        <FormGroup>
          <Label>
            <FormattedMessage id="log-in.username-label" defaultMessage="Username" />
          </Label>
          <Input type="text" autoComplete="username" onChange={({ target }) => setUsername(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="log-in.password-label" defaultMessage="Password" />
          </Label>
          <Input type="password" autoComplete="current-password" onChange={({ target }) => setPassword(target.value)} />
        </FormGroup>
        <Button disabled={loading || !username || !password} type="submit" color="primary" onClick={submit}>
          <FormattedMessage id="log-in.log-in-button" defaultMessage="Log in" />
        </Button>
        <Button tag={Link} to="/forgot-password" color="secondary" outline style={{ marginLeft: '5px' }}>
          <FormattedMessage id="log-in.forgot-password-button" defaultMessage="Forgot password?" />
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </>
  )
}

export default LoginPage
