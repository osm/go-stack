import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'

import MUTATION from './mutations/Signup.graphql'
import { SignupMutation, SignupMutationVariables } from './types'

const SignUpPage: React.FC = () => {
  const navigate = useNavigate()

  const [mutate] = useMutation<SignupMutation, SignupMutationVariables>(MUTATION)

  const [error, setError] = React.useState<string | undefined>(undefined)
  const [username, setUsername] = React.useState<string | undefined>(undefined)
  const [email, setEmail] = React.useState<string | undefined>(undefined)
  const [password, setPassword] = React.useState<string | undefined>(undefined)
  const [confirmPassword, setConfirmPassword] = React.useState<string | undefined>(undefined)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables:
        !username || !email || !password
          ? undefined
          : {
              input: {
                username,
                email,
                password,
              },
            },
    })
      .then(() => navigate('/login'))
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <Form>
        <FormGroup>
          <Label>
            <FormattedMessage id="sign-up.username-label" defaultMessage="Username" />
          </Label>
          <Input autoComplete="username" onChange={({ target }) => setUsername(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="sign-up.email-label" defaultMessage="Email" />
          </Label>
          <Input type="email" onChange={({ target }) => setEmail(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="sign-up.password-label" defaultMessage="Password" />
          </Label>
          <Input
            valid={!!password}
            type="password"
            autoComplete="new-password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="sign-up.confirm-password-label" defaultMessage="Confirm password" />
          </Label>
          <Input
            invalid={!!(password && confirmPassword && password !== confirmPassword)}
            valid={!!(password && confirmPassword && password === confirmPassword)}
            type="password"
            autoComplete="confirm-password"
            onChange={({ target }) => setConfirmPassword(target.value)}
          />
          <FormFeedback>
            <FormattedMessage id="sign-up.password-mismatch-label" defaultMessage="The passwords doesn't match" />
          </FormFeedback>
        </FormGroup>
        <Button type="submit" color="primary" onClick={submit}>
          <FormattedMessage id="sign-up.sign-up-button" defaultMessage="Sign up" />
        </Button>
      </Form>
      {error && <p className="mt-2">Error: {error}</p>}
    </>
  )
}

export default SignUpPage
