'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react'
import type Keycloak from 'keycloak-js'

import keycloak from '@/lib/keycloak'

export interface KeycloakContextType {
  keycloak: Keycloak | null
  initialized: boolean
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  initialized: false,
})

interface KeycloakProviderProps {
  children: ReactNode
}

export function KeycloakProvider({ children }: KeycloakProviderProps) {
  const isRun = useRef(false)
  const [auth, setAuth] = useState<KeycloakContextType>({
    keycloak: null,
    initialized: false,
  })

  useEffect(() => {
    if (isRun.current) return
    isRun.current = true

    if (!keycloak) return

    keycloak
      .init({
        onLoad: 'login-required', // or 'check-sso'
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then(() => {
        setAuth({ keycloak, initialized: true })
      })
      .catch(async (error) => {
        console.error('Keycloak Init Error:', error)
        if (error.response) {
          try {
            const errorBody = await error.response.text()
            console.error('Keycloak Server Error Details:', errorBody)
          } catch (e) {
            console.error('Could not read Keycloak error body', e)
          }
        }
      })
  }, [])

  if (!auth.initialized) return <div>Loading...</div>

  return (
    <KeycloakContext.Provider value={auth}>{children}</KeycloakContext.Provider>
  )
}

export function useKeycloak(): Keycloak | null {
  const { keycloak } = useContext(KeycloakContext)
  return keycloak
}
