// src/components/admin/AdminPasswordReset.js
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import passwordService from '../../services/passwordService';
import api from '../../services/api';

function AdminPasswordReset({ open, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate password strength
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const result = await passwordService.adminResetUserPassword(
        formData.email,
        formData.newPassword
      );

      setSuccess(`Password reset successfully for ${result.email} (${result.role})`);
      
      // Clear form
      setFormData({
        email: '',
        newPassword: ''
      });

      // Refresh users list
      fetchUsers();

    } catch (err) {
      setError(err.error || 'Failed to reset user password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        email: '',
        newPassword: ''
      });
      setError('');
      setSuccess('');
      setUsers([]);
      onClose();
    }
  };

  const handleEditUser = (email) => {
    setFormData(prev => ({
      ...prev,
      email: email
    }));
  };

  React.useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Barangay President': return 'warning';
      case 'PWD Member': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h5" sx={{ color: '#2C3E50' }}>
          Admin Password Reset
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Password Reset Form */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2C3E50' }}>
              Reset User Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="User Email"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="newPassword"
                label="New Password"
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading}
                helperText="Password must be at least 6 characters long"
                sx={{ mb: 2 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  backgroundColor: '#E74C3C',
                  '&:hover': {
                    backgroundColor: '#C0392B',
                  }
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Box>
          </Paper>

          {/* Users List */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#2C3E50' }}>
              All Users
            </Typography>
            {loadingUsers ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.userID}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={getRoleColor(user.role)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditUser(user.email)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ color: '#7F8C8D' }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AdminPasswordReset;
