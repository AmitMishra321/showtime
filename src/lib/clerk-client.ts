import { useUser } from '@clerk/nextjs'

export const useClientUser = () => {
  const { user } = useUser()
  return user
}
