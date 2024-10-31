'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { auth } from '@/lib/firebase'
import { signInWithCustomToken } from 'firebase/auth'

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { getToken, userId } = useAuth()

  useEffect(() => {
    const signInWithClerk = async () => {
      if (!userId) return
      try {
        // Get the Firebase token from Clerk
        const token = await getToken({ template: 'integration_firebase' })
        if (!token) return

        // Sign in to Firebase with the token
        await signInWithCustomToken(auth, token)
      } catch (error) {
        console.error('Error signing in to Firebase:', error)
      }
    }

    signInWithClerk()
  }, [getToken, userId])

  return <>{children}</>
}
