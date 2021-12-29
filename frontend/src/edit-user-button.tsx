import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NavItem,
  NavLink,
} from 'reactstrap'

import userCurrentUserId from './use-current-user-id'
import DeleteUserModal from './delete-user-modal'

import QUERY from './queries/GetUser.graphql'
import { GetUser, GetUserVariables } from './queries/__generated__/GetUser'

import MUTATION from './mutations/UpdateUser.graphql'
import { UpdateUser, UpdateUserVariables } from './mutations/__generated__/UpdateUser'

const EditUserButton: React.FC = () => {
  const userId = userCurrentUserId()

  const [mutate, { loading }] = useMutation<UpdateUser, UpdateUserVariables>(MUTATION)

  const { data } = useQuery<GetUser, GetUserVariables>(QUERY, {
    variables: !userId
      ? undefined
      : {
          userId,
        },
  })
  const user = data?.user

  const [isOpen, setIsOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [email, setEmail] = React.useState<string>('')
  const [firstName, setFirstName] = React.useState<string | undefined>(undefined)
  const [lastName, setLastName] = React.useState<string | undefined>(undefined)
  const [currentPassword, setCurrentPassword] = React.useState<string | undefined>(undefined)
  const [newPassword, setNewPassword] = React.useState<string | undefined>(undefined)
  const [confirmNewPassword, setConfirmNewPassword] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    if (user) {
      setEmail(user?.email ?? '')
      setFirstName(user?.firstName ?? undefined)
      setLastName(user?.lastName ?? undefined)
    }
  }, [user])

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables: !userId
        ? undefined
        : {
            userId,
            input: {
              email,
              firstName: firstName === undefined ? null : firstName,
              lastName: lastName === undefined ? null : lastName,
              ...(currentPassword ? { currentPassword } : {}),
              ...(newPassword ? { newPassword } : {}),
            },
          },
      refetchQueries: ['GetUser'],
    })
      .then(() => setIsOpen(false))
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <NavItem>
        <NavLink style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
          <FormattedMessage id="edit-user-button.button" defaultMessage="Edit user" />
        </NavLink>
      </NavItem>
      <Modal isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <ModalHeader toggle={() => setIsOpen(!isOpen)}>
          <FormattedMessage id="edit-user-button.header-label" defaultMessage="Edit user" />
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label>
                <FormattedMessage id="edit-user-button.email-label" defaultMessage="Email" />
              </Label>
              <Input type="email" value={email} onChange={({ target }) => setEmail(target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>
                <FormattedMessage id="edit-user-button.first-name-label" defaultMessage="First name" />
              </Label>
              <Input
                value={firstName ?? ''}
                autoComplete="first-name"
                onChange={({ target }) => setFirstName(target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <FormattedMessage id="edit-user-button.last-name-label" defaultMessage="Last name" />
              </Label>
              <Input
                value={lastName ?? ''}
                autoComplete="last-name"
                onChange={({ target }) => setLastName(target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <FormattedMessage id="edit-user-button.current-password-label" defaultMessage="Current password" />
              </Label>
              <Input
                type="password"
                autoComplete="current-password"
                onChange={({ target }) => setCurrentPassword(target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label>
                <FormattedMessage id="edit-user-button.new-password-label" defaultMessage="New password" />
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
                <FormattedMessage
                  id="edit-user-button.confirm-new-password-label"
                  defaultMessage="Confirm new password"
                />
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
                  id="edit-user-button.password-mismatch-label"
                  defaultMessage="The passwords doesn't match"
                />
              </FormFeedback>
            </FormGroup>
          </Form>
          {error && <p className="mt-2">Error: {error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
            <FormattedMessage id="edit-user-button.cancel-button" defaultMessage="Cancel" />
          </Button>
          <Button type="submit" color="primary" disabled={loading} onClick={submit}>
            <FormattedMessage id="edit-user-button.save-button" defaultMessage="Save" />
          </Button>
          <DeleteUserModal />
        </ModalFooter>
      </Modal>
    </>
  )
}

export default EditUserButton
