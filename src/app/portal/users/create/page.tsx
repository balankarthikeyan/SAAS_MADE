'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createKeycloakUser } from '@/actions/keycloak-users'

export default function CreateUser() {
  const router = useRouter()
  const [success, setSuccess] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSuccess(null)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const result = await createKeycloakUser(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(true)
      ;(event.target as HTMLFormElement).reset()
      
      // Optionally redirect back to the user list after a short delay
      setTimeout(() => {
        router.push('/portal/users')
      }, 1500)
    }
  }

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Button 
          component={Link} 
          href="/portal/users" 
          startIcon={<ArrowBackIcon />}
        >
          Back to Users
        </Button>
        <Typography variant="h4" sx={{ mb: 0 }}>
          Create New User
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                User successfully created in Keycloak! Redirecting...
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                name="username"
                label="Username"
                required
                fullWidth
                autoComplete="off"
              />
              <TextField
                name="email"
                type="email"
                label="Email Address"
                required
                fullWidth
                autoComplete="off"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  name="firstName"
                  label="First Name"
                  fullWidth
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  fullWidth
                />
              </Box>
              <TextField
                name="password"
                type="password"
                label="Initial Password"
                required
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ mt: 2 }}
              >
                Create Keycloak User
              </Button>
             </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  )
}
