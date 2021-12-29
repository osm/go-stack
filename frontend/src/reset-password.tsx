import React from 'react'
import { useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap'

import MUTATION from './mutations/ConfirmPasswordReset.graphql'
import { ConfirmPasswordReset, ConfirmPasswordResetVariables } from './mutations/__generated__/ConfirmPasswordReset'

const ResetPasswordPage: React.FC = () => {
  const history = useHistory()
  const { token }: { token: string } = useParams()

  const [mutate, { loading }] = useMutation<ConfirmPasswordReset, ConfirmPasswordResetVariables>(MUTATION)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [newPassword, setNewPassword] = React.useState<string | undefined>(undefined)
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string | undefined>(undefined)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables: !newPassword
        ? undefined
        : {
            input: {
              token,
              password: newPassword,
            },
          },
    })
      .then(() => history.push('/login'))
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
