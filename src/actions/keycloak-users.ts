'use server'

import KcAdminClient from '@keycloak/keycloak-admin-client'

// We expect these to be provided via environment variables in a real scenario
const KEYCLOAK_URL = process.env.KEYCLOAK_URL || 'http://127.0.0.1:4000'
const KEYCLOAK_REALM = process.env.KEYCLOAK_REALM || 'sashti'
const ADMIN_USERNAME = process.env.KEYCLOAK_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.KEYCLOAK_ADMIN_PASSWORD || 'admin'

export async function createKeycloakUser(formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const password = formData.get('password') as string

  if (!username || !email || !password) {
    return { error: 'Username, email, and password are required.' }
  }

  try {
    const kcAdminClient = new KcAdminClient({
      baseUrl: KEYCLOAK_URL,
      realmName: 'master', // Admin API auth usually goes through master
    })

    await kcAdminClient.auth({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli',
    })

    kcAdminClient.setConfig({
      realmName: KEYCLOAK_REALM, // Switch context to our specific realm
    })

    const user = await kcAdminClient.users.create({
      username,
      email,
      firstName,
      lastName,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: password,
          temporary: false,
        },
      ],
    })

    return { success: true, userId: user.id }
  } catch (error: any) {
    console.error('Failed to create Keycloak user:', error)
    return { error: error?.response?.data?.errorMessage || 'Failed to create user.' }
  }
}

export async function getKeycloakUsers() {
  try {
    const kcAdminClient = new KcAdminClient({
      baseUrl: KEYCLOAK_URL,
      realmName: 'master',
    })

    await kcAdminClient.auth({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli',
    })

    kcAdminClient.setConfig({
      realmName: KEYCLOAK_REALM,
    })

    const users = await kcAdminClient.users.find()

    // Map to a clean object to avoid Next.js RSC serialization issues
    return users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      enabled: user.enabled,
    }))
  } catch (error) {
    console.error('Failed to fetch Keycloak users:', error)
    return []
  }
}

export async function deleteKeycloakUsers(userIds: string[]) {
  if (!userIds || userIds.length === 0) {
    return { error: 'No user IDs provided for deletion.' }
  }

  try {
    const kcAdminClient = new KcAdminClient({
      baseUrl: KEYCLOAK_URL,
      realmName: 'master',
    })

    await kcAdminClient.auth({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      grantType: 'password',
      clientId: 'admin-cli',
    })

    kcAdminClient.setConfig({
      realmName: KEYCLOAK_REALM,
    })

    // Execute deletion loop
    for (const id of userIds) {
      await kcAdminClient.users.del({ id })
    }

    return { success: true }
  } catch (error: any) {
    console.error('Failed to delete Keycloak users:', error)
    return { error: error?.response?.data?.errorMessage || 'Failed to delete selected users.' }
  }
}
