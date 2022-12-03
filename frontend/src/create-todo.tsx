import React from 'react'
import { useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { FormattedMessage } from 'react-intl'
import { Button, Input, Form, FormGroup, Label } from 'reactstrap'

import userCurrentUserId from './use-current-user-id'
import { addTodoToCache } from './todo-cache'

import MUTATION from './mutations/CreateTodo.graphql'
import { CreateTodoMutation, CreateTodoMutationVariables } from './types'

const CreateTodoPage: React.FC = () => {
  const history = useHistory()
  const userId = userCurrentUserId()

  const [mutate, { loading }] = useMutation<CreateTodoMutation, CreateTodoMutationVariables>(MUTATION, {
    update: (cache, ret) => {
      addTodoToCache({
        cache,
        userId,
        data: ret?.data?.user?.todos?.create,
      })
    },
  })

  const [error, setError] = React.useState<null | string>(null)
  const [title, setTitle] = React.useState<null | string>(null)
  const [content, setContent] = React.useState<null | string>(null)

  const submit = (e: React.MouseEvent) => {
    e.preventDefault()

    mutate({
      variables:
        !userId || !title || !content
          ? undefined
          : {
              userId,
              input: {
                title,
                content,
              },
            },
    })
      .then(() => history.goBack())
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <Form>
        <FormGroup>
          <Label>
            <FormattedMessage id="create-todo.title-label" defaultMessage="Title" />
          </Label>
          <Input onChange={({ target }) => setTitle(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="create-todo.content-label" defaultMessage="Content" />
          </Label>
          <Input onChange={({ target }) => setContent(target.value)} />
        </FormGroup>
        <Button disabled={loading || !title || !content} type="submit" color="primary" onClick={submit}>
          <FormattedMessage id="create-todo.create-button" defaultMessage="Create" />
        </Button>
      </Form>
      {error && <p>{error}</p>}
    </>
  )
}

export default CreateTodoPage
