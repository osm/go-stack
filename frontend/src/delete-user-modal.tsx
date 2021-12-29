import React from 'react'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'

import { useAuthContext } from './auth-provider'

import MUTATION from './mutations/DeleteUser.graphql'
import { DeleteUser, DeleteUserVariables } from './mutations/__generated__/DeleteUser'

const DeleteUserModal: React.FC = () => {
  const { userId, setToken } = useAuthContext()

  const [mutate, { loading }] = useMutation<DeleteUser, DeleteUserVariables>(MUTATION)

  const [isOpen, setIsOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  return (
    <>
      <Button color="danger" onClick={() => setIsOpen(true)}>
        <FormattedMessage id="delete-user.delete-user-button" defaultMessage="Delete" />
      </Button>
      <Modal isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <ModalHeader toggle={() => setIsOpen(!isOpen)}>
          <FormattedMessage id="delete-user.header-label" defaultMessage="Delete your user" />
        </ModalHeader>
        <ModalBody>
          <FormattedMessage
            id="delete-user.warning"
            defaultMessage="Are you sure that you want to delete your user? This action irreversible and all your data will be deleted."
          />
          {error && <p className="mt-2">Error: {error}</p>}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setIsOpen(false)} disabled={loading}>
            <FormattedMessage id="delete-user.cancel-button" defaultMessage="Cancel" />
          </Button>
          <Button
            type="submit"
            color="danger"
            disabled={loading}
            onClick={() => {
              mutate({
                variables: !userId
                  ? undefined
                  : {
                      userId,
                    },
              })
                .then(() => setToken(null))
                .catch((e) => setError(e.message))
            }}
          >
            <FormattedMessage id="delete-user.delete-button" defaultMessage="Delete" />
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default DeleteUserModal
