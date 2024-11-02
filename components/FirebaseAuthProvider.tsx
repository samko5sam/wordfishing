'use client'

import React, { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '@clerk/nextjs'
import { auth } from '@/lib/firebase'
import { signInWithCustomToken } from 'firebase/auth'

// Define a context for authentication status
interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing the authentication status
export function useFirebaseAuthStatus() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthStatus must be used within a FirebaseAuthProvider');
  }
  return context;
}

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, userId } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const signInWithClerk = async () => {
      if (!userId) return;
      try {
        // Get the Firebase token from Clerk
        const token = await getToken({ template: 'integration_firebase' });
        if (!token) return;

        // Sign in to Firebase with the token
        await signInWithCustomToken(auth, token);

        // Update authentication status on successful sign-in
        setIsAuthenticated(true);
        
      } catch (error) {
        console.error('Error signing in to Firebase:', error);
        setIsAuthenticated(false);
      }
    };

    signInWithClerk();
  }, [getToken, userId]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
