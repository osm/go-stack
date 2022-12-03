import React from 'react'
import jwt from 'jwt-decode'
import { useMutation } from '@apollo/client'

import MUTATION from './mutations/RefreshToken.graphql'
import { RefreshTokenMutation, RefreshTokenMutationVariables } from './types'

interface IAuthContext {
  token: string | null
  setToken: (token: null | string) => void
  userId: string | null
}

interface IAuth {
  token: string
  userId: string
}

const Context = React.createContext<IAuthContext>({
  token: null,
  userId: null,
  setToken: () => undefined,
})

const useAuthContext = (): IAuthContext => React.useContext(Context)

const getAuth = (): IAuth => {
  const authEncoded = localStorage.getItem('__AUTH__')
  const auth: IAuth = authEncoded ? JSON.parse(authEncoded) : null
  return auth ?? { userId: undefined, token: undefined }
}

const AuthProvider: React.FC<{
  children?: React.ReactNode
}> = ({ children }: { children?: React.ReactNode }) => {
  const auth = getAuth()

  const [token, setToken] = React.useState<string | null>(auth?.token ?? null)
  const [userId, setUserId] = React.useState<string | null>(auth?.userId ?? null)

  const [mutate] = useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(MUTATION)

  React.useEffect(() => {
    if (token) {
      const { exp, sub }: { exp: number; iat: number; sub: string } = jwt(token)
      localStorage.setItem('__AUTH__', JSON.stringify({ token, userId: sub }))
      setUserId(sub)

      const now = Math.floor(new Date().getTime() / 1000)
      const refreshTime = now > exp ? 0 : exp - now / 2

      // Refresh the token when half of the lifetime is reached.
      setTimeout(
        () =>
          mutate({
            variables: {
              input: {
                token,
              },
            },
          }).then(({ data }) => setToken(data?.refreshToken ?? null)),
        refreshTime,
      )
    } else {
      localStorage.removeItem('__AUTH__')
      setUserId(null)
    }

    setToken(token)
  }, [token, userId, mutate])

  return (
    <>
      <Context.Provider value={{ token, setToken, userId }}>{children}</Context.Provider>
    </>
  )
}

export default AuthProvider
export { getAuth, useAuthContext }
