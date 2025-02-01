// The useRedirectHomeUnlessUserIsAdmin.ts file defines a custom React hook that redirects the user to the home page unless they are an admin.
import { type AuthUser } from 'wasp/auth'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useRedirectHomeUnlessUserIsAdmin({ user }: { user: AuthUser }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user.isAdmin) {
      navigate('/')
    }
  }, [user, history])
}
