'use client'
import DashboardLayout from '@/components/DashboardLayout'
import { useKeycloak } from '@/components/KeycloakProvider'
import {
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Stack,
  Grid,
} from '@mui/material'
import { useForm } from 'react-hook-form'

export default function SettingsPage() {
  const keycloak = useKeycloak() as {
    tokenParsed?: { preferred_username: string }
    logout?: () => void
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      appName: 'My SaaS Product',
      emailNotifications: true,
      supportEmail: 'admin@mysaas.com',
    },
  })

  const onSubmit = (data: unknown) => {
    console.log('Saving Settings:', data)
    alert('Settings Saved! (Check console)')
  }

  const username = keycloak?.tokenParsed?.preferred_username as string
  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 600 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Typography variant="h6">General Configuration</Typography>

            <TextField
              {...register('appName')}
              label="Application Name"
              fullWidth
            />

            <TextField
              {...register('supportEmail')}
              label="Support Contact Email"
              fullWidth
            />

            <Divider />

            <Typography variant="h6">Notifications</Typography>

            <FormControlLabel
              control={
                <Switch defaultChecked {...register('emailNotifications')} />
              }
              label="Enable Email Notifications"
            />

            <Box sx={{ mt: 2 }}>
              <Button variant="contained" type="submit" size="large">
                Save Changes
              </Button>
            </Box>
          </Stack>
        </form>
        <Grid>
          <p>Logged in as: {username}</p>
          <button onClick={() => keycloak?.logout?.()}>Logout</button>
        </Grid>
      </Paper>
    </DashboardLayout>
  )
}
