import React from 'react'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'

import MUTATION from './mutations/ConfirmPasswordReset.graphql'
import { ConfirmPasswordResetMutation, ConfirmPasswordResetMutationVariables } from './types'

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useParams<{ token: string }>()

  const [mutate, { loading }] = useMutation<ConfirmPasswordResetMutation, ConfirmPasswordResetMutationVariables>(
    MUTATION,
  )
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [newPassword, setNewPassword] = React.useState<string | undefined>(undefined)
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string | undefined>(undefined)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables:
        !newPassword || !token
          ? undefined
          : {
              input: {
                token,
                password: newPassword,
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
            <FormattedMessage id="reset-password.new-password-label" defaultMessage="New password" />
          </Label>
          <Input
            valid={!!newPassword}
            type="password"
            autoComplete="new-password"
            onChange={({ target }) => setNewPassword(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="reset-password.confirm-new-password-label" defaultMessage="Confirm new password" />
          </Label>
          <Input
            invalid={!!(newPassword && confirmNewPassword && newPassword !== confirmNewPassword)}
            valid={!!(newPassword && confirmNewPassword && newPassword === confirmNewPassword)}
            type="password"
            autoComplete="confirm-new-password"
            onChange={({ target }) => setConfirmNewPassword(target.value)}
          />
          <FormFeedback>
            <FormattedMessage
              id="reset-password.password-mismatch-label"
              defaultMessage="The passwords doesn't match"
            />
          </FormFeedback>
        </FormGroup>
        <Button disabled={loading || newPassword !== confirmNewPassword} type="submit" color="primary" onClick={submit}>
          <FormattedMessage id="reset-password.set-password-button" defaultMessage="Set password" />
        </Button>
      </Form>
      {error && <p className="mt-2">Error: {error}</p>}
    </>
  )
}

export default ResetPasswordPage
