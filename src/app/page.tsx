import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Typography, Grid, Paper } from "@mui/material";

export default function Home() {
  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome back, User!
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h4">$12,450</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">1,204</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Subscription Rate</Typography>
            <Typography variant="h4">84%</Typography>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
}
