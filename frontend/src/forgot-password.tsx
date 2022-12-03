import React from 'react'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { Button, Input, Form, FormGroup, Label } from 'reactstrap'

import MUTATION from './mutations/InitiatePasswordReset.graphql'
import { InitiatePasswordResetMutation, InitiatePasswordResetMutationVariables } from './types'

const ForgotPasswordPage: React.FC = () => {
  const [mutate, { loading }] = useMutation<InitiatePasswordResetMutation, InitiatePasswordResetMutationVariables>(
    MUTATION,
  )
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [username, setUsername] = React.useState<string | undefined>(undefined)
  const [instructionsSent, setInstructionsSent] = React.useState<boolean>(false)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables: !username
        ? undefined
        : {
            input: {
              username,
            },
          },
    })
      .then(() => setInstructionsSent(true))
      .catch((e) => setError(e.message))
  }

  return (
    <>
      {!instructionsSent ? (
        <Form>
          <FormGroup>
            <Label>
              <FormattedMessage id="forgot-password.username-label" defaultMessage="Username" />
            </Label>
            <Input autoComplete="username" onChange={({ target }) => setUsername(target.value)} />
          </FormGroup>

          <Button disabled={loading} type="submit" color="primary" onClick={submit}>
            <FormattedMessage id="forgot-password.forgot-password-button" defaultMessage="Send instructions" />
          </Button>
        </Form>
      ) : (
        <p className="mt-2">
          <FormattedMessage
            id="forgot-password.instructions-sent"
            defaultMessage="Instructions has been sent to the email assigned to the username you provided."
          />
        </p>
      )}
      {error && <p className="mt-2">Error: {error}</p>}
    </>
  )
}

export default ForgotPasswordPage
