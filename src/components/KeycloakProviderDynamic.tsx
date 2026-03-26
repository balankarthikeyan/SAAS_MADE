'use client'

import dynamic from 'next/dynamic'

export const KeycloakProviderDynamic = dynamic(
  () => import('./KeycloakProvider').then((m) => m.KeycloakProvider),
  { ssr: false },
)
