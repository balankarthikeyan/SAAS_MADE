"use client";
import DashboardLayout from "@/components/DashboardLayout";
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
} from "@mui/material";
import { useForm } from "react-hook-form";

export default function SettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      appName: "My SaaS Product",
      emailNotifications: true,
      supportEmail: "admin@mysaas.com",
    },
  });

  const onSubmit = (data: any) => {
    console.log("Saving Settings:", data);
    alert("Settings Saved! (Check console)");
  };

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
              {...register("appName")}
              label="Application Name"
              fullWidth
            />

            <TextField
              {...register("supportEmail")}
              label="Support Contact Email"
              fullWidth
            />

            <Divider />

            <Typography variant="h6">Notifications</Typography>

            <FormControlLabel
              control={
                <Switch defaultChecked {...register("emailNotifications")} />
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
  );
}
