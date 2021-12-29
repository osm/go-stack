import { useAuthContext } from './auth-provider'

const useCurrentUserId = (): string | null => {
  const { userId } = useAuthContext()
  return userId
}

export default useCurrentUserId
