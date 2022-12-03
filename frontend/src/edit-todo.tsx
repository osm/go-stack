import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { useParams } from 'react-router'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button, Input, Form, FormGroup, Table, Label } from 'reactstrap'

import useCurrentUserId from './use-current-user-id'
import { deleteTodoFromCache } from './todo-cache'
import download from './download'

import QUERY from './queries/GetTodo.graphql'
import {
  GetTodoQuery,
  GetTodoQueryVariables,
  DeleteTodoMutation,
  DeleteTodoMutationVariables,
  UpdateTodoMutation,
  UpdateTodoMutationVariables,
  CreateTodoFileMutation,
  CreateTodoFileMutationVariables,
  DeleteTodoFileMutation,
  DeleteTodoFileMutationVariables,
} from './types'

import MUTATION_DELETE from './mutations/DeleteTodo.graphql'
import MUTATION_UPDATE from './mutations/UpdateTodo.graphql'
import MUTATION_CREATE_FILE from './mutations/CreateTodoFile.graphql'
import MUTATION_DELETE_FILE from './mutations/DeleteTodoFile.graphql'

const EditTodo: React.FC = () => {
  const navigate = useNavigate()
  const intl = useIntl()
  const userId = useCurrentUserId()
  const { id: todoId } = useParams<{ id: string }>()

  const { data } = useQuery<GetTodoQuery, GetTodoQueryVariables>(QUERY, {
    skip: !userId || !todoId,
    variables:
      !userId || !todoId
        ? undefined
        : {
            userId,
            todoId,
          },
    fetchPolicy: 'no-cache',
  })
  const todo = data?.user?.todo

  const [mutateDelete] = useMutation<DeleteTodoMutation, DeleteTodoMutationVariables>(MUTATION_DELETE, {
    update: (cache, ret) => {
      deleteTodoFromCache({ cache, id: ret?.data?.user?.todo?.delete })
    },
  })
  const [mutateDeleteFile] = useMutation<DeleteTodoFileMutation, DeleteTodoFileMutationVariables>(MUTATION_DELETE_FILE)

  const [mutateUpdate] = useMutation<UpdateTodoMutation, UpdateTodoMutationVariables>(MUTATION_UPDATE)
  const [mutateCreateTodoFile] = useMutation<CreateTodoFileMutation, CreateTodoFileMutationVariables>(
    MUTATION_CREATE_FILE,
  )

  const [error, setError] = React.useState<string | null>(null)
  const [title, setTitle] = React.useState<string>('')
  const [content, setContent] = React.useState<string>('')
  const [isDone, setIsDone] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (todo) {
      setTitle(todo?.title ?? '')
      setContent(todo?.content ?? '')
      setIsDone(todo?.isDone ?? false)
    }
  }, [todo])

  const updateTodo = (e: React.MouseEvent) => {
    e.preventDefault()

    mutateUpdate({
      variables:
        !userId || !todoId
          ? undefined
          : {
              userId,
              todoId,
              patch: {
                title,
                content,
                isDone,
              },
            },
    })
      .then(() => navigate(-1))
      .catch((e) => setError(e.message))
  }

  const deleteTodo = (e: React.MouseEvent) => {
    e.preventDefault()

    mutateDelete({
      variables:
        !userId || !todoId
          ? undefined
          : {
              userId,
              todoId,
            },
    })
      .then(() => navigate(-1))
      .catch((e) => setError(e.message))
  }

  return (
    <>
      <Form>
        <FormGroup>
          <Label>
            <FormattedMessage id="edit-todo.title-label" defaultMessage="Title" />
          </Label>
          <Input value={title} onChange={({ target }) => setTitle(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>
            <FormattedMessage id="edit-todo.content-label" defaultMessage="Content" />
          </Label>
          <Input value={content} onChange={({ target }) => setContent(target.value)} />
        </FormGroup>
        <FormGroup>
          <Label className="mr-4">
            <FormattedMessage id="edit-todo.is-done-label" defaultMessage="Is done" />
          </Label>
          <Input type="checkbox" checked={isDone} onChange={() => setIsDone(!isDone)} />
        </FormGroup>
        <Button disabled={!title || !content} type="submit" color="primary" onClick={updateTodo}>
          <FormattedMessage id="edit-todo.edit-button" defaultMessage="Save" />
        </Button>
        <Button color="danger" style={{ marginLeft: '5px' }} onClick={deleteTodo}>
          <FormattedMessage id="edit-todo.delete-button" defaultMessage="Delete" />
        </Button>
      </Form>
      <br />
      <Table>
        <thead>
          <tr>
            <th>
              <FormattedMessage id="edit-todo.file-id-label" defaultMessage="ID" />
            </th>
            <th>
              <FormattedMessage id="edit-todo.file-modified-at-label" defaultMessage="Modifed at" />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {(todo?.files ?? []).map((todoFile) => {
            const date = todoFile?.updatedAt || todoFile?.createdAt
            return (
              <tr key={todoFile?.id}>
                <td>{todoFile?.id}</td>
                <td>
                  {intl.formatDate(date)}{' '}
                  {intl.formatTime(date, { hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                </td>
                <td>
                  <Button
                    size="sm"
                    color="success"
                    outline
                    onClick={() => download(`/todos/${todo?.id}/files/${todoFile?.id}`, todoFile?.id || 'file')}
                  >
                    <FormattedMessage id="edit-todo.download-file-button" defaultMessage="Download" />
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    outline
                    style={{ marginLeft: '5px' }}
                    onClick={() => {
                      mutateDeleteFile({
                        variables:
                          !userId || !todo?.id || !todoFile?.id
                            ? undefined
                            : {
                                userId,
                                todoId: todo?.id,
                                fileId: todoFile?.id,
                              },
                        refetchQueries: ['GetTodo'],
                      }).catch((e) => setError(e.message))
                    }}
                  >
                    <FormattedMessage id="edit-todo.delete-file-button" defaultMessage="Delete" />
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      <Form>
        <FormGroup>
          <Input
            type="file"
            onChange={({ target: { validity, files: fileList } }) => {
              if (!validity.valid || !fileList || fileList.length !== 1) {
                return
              }

              mutateCreateTodoFile({
                refetchQueries: ['GetTodo'],
                variables:
                  !userId || !todoId
                    ? undefined
                    : {
                        userId,
                        todoId,
                        file: fileList[0],
                      },
              }).catch((e) => setError(e.message))
            }}
          />
        </FormGroup>
      </Form>
      {error && <p className="mt-2">Error: {error}</p>}
    </>
  )
}

export default EditTodo
