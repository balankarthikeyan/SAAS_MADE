'use client'

import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import {
  Typography,
  Grid,
  Paper,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Button,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import Link from 'next/link'
import { getKeycloakUsers, deleteKeycloakUsers } from '@/actions/keycloak-users'

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  
  // Selection and Deletion State
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false)
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([])
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoadingUsers(true)
    const data = await getKeycloakUsers()
    setUsers(data)
    setLoadingUsers(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(users.map((u) => u.id))
    } else {
      setSelectedIds([])
    }
  }

  const openDeleteDialog = (ids: string[]) => {
    setDeleteTargetIds(ids)
    setConfirmDeleteDialog(true)
  }

  const closeDeleteDialog = () => {
    setConfirmDeleteDialog(false)
    setDeleteTargetIds([])
    setDeleteError(null)
  }

  const handleDeleteConfirm = async () => {
    setDeleteError(null)
    const result = await deleteKeycloakUsers(deleteTargetIds)
    if (result.error) {
      setDeleteError(result.error)
    } else {
      closeDeleteDialog()
      // Deselect successfully deleted items
      setSelectedIds((prev) => prev.filter(id => !deleteTargetIds.includes(id)))
      fetchUsers()
    }
  }

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {selectedIds.length > 0 && (
             <Button
               variant="outlined"
               color="error"
               startIcon={<DeleteIcon />}
               onClick={() => openDeleteDialog(selectedIds)}
             >
               Delete Selected ({selectedIds.length})
             </Button>
          )}
          <Button 
            component={Link} 
            href="/portal/users/create" 
            variant="contained" 
            startIcon={<AddIcon />}
          >
            Create User
          </Button>
        </Box>
      </Box>

      {deleteError && !confirmDeleteDialog && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setDeleteError(null)}>
          {deleteError}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 4, minHeight: 400 }}>
            {loadingUsers ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', px: { xs: 1, sm: 2 }, mb: 1 }}>
                  <Checkbox 
                    checked={users.length > 0 && selectedIds.length === users.length}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < users.length}
                    onChange={handleSelectAll}
                  />
                  <Typography variant="subtitle2" color="text.secondary">
                    Select All
                  </Typography>
                </Box>
                <List sx={{ width: '100%' }}>
                  {users.map((user) => {
                    const isSelected = selectedIds.includes(user.id)
                    return (
                      <ListItem 
                        key={user.id} 
                        divider 
                        sx={{ px: { xs: 1, sm: 2 }, bgcolor: isSelected ? 'action.selected' : 'transparent' }}
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" color="error" onClick={() => openDeleteDialog([user.id])}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <Checkbox
                          edge="start"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(user.id)}
                          sx={{ mr: 2 }}
                        />
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                          secondary={user.email}
                          slotProps={{
                            primary: { noWrap: true },
                            secondary: { noWrap: true }
                          }}
                        />
                      </ListItem>
                    )
                  })}
                  {users.length === 0 && (
                    <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                      No users found inside Keycloak. Click 'Create User' to add one.
                    </Typography>
                  )}
                </List>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDeleteDialog}
        onClose={closeDeleteDialog}
      >
        <DialogTitle>{"Confirm User Deletion"}</DialogTitle>
        <DialogContent>
          {deleteError && (
             <Alert severity="error" sx={{ mb: 2 }}>
               {deleteError}
             </Alert>
          )}
          <DialogContentText>
            Are you sure you want to permanently delete {deleteTargetIds.length === 1 ? 'this user' : `these ${deleteTargetIds.length} users`} from Keycloak? This action cannot be undone and they will instantly lose access.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
