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
  Avatar,
  Card,
  CardContent,
  CardActions,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import { useForm } from 'react-hook-form'

export default function SettingsPage() {
  const keycloak = useKeycloak() as {
    tokenParsed?: { 
      preferred_username?: string
      email?: string
      name?: string
      given_name?: string
      family_name?: string
    }
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

      {/* Account Information Section */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Account Information
      </Typography>
      <Card sx={{ maxWidth: 600, mb: 5, p: 1 }}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {keycloak?.tokenParsed?.name || 'Authorized User'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Username: {keycloak?.tokenParsed?.preferred_username || 'N/A'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {keycloak?.tokenParsed?.email || 'No email associated'}
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button 
            variant="outlined" 
            color="error"
            onClick={() => keycloak?.logout?.()}
          >
            Sign Out of Keycloak
          </Button>
        </CardActions>
      </Card>

      <Typography variant="h5" sx={{ mb: 3 }}>
        System Preferences
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
      </Paper>
    </DashboardLayout>
  )
}
