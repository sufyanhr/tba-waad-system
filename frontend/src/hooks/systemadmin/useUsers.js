import { useState, useEffect } from 'react';
import { usersService } from '../../services/systemadmin/users.service';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    total: 0
  });

  // Fetch all users
  const fetchUsers = async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.getAllUsers(page, size);
      setUsers(response.data.data || []);
      setPagination({
        page: response.data.page || page,
        size: response.data.size || size,
        total: response.data.total || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.getUserById(id);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const searchUsers = async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.searchUsers(query);
      setUsers(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  // Create user
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.createUser(userData);
      await fetchUsers(pagination.page, pagination.size);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.updateUser(id, userData);
      await fetchUsers(pagination.page, pagination.size);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.deleteUser(id);
      await fetchUsers(pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async (id, active) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.toggleUserStatus(id, active);
      await fetchUsers(pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle user status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (id, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.resetPassword(id, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Assign roles
  const assignRoles = async (id, roles) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.assignRoles(id, roles);
      await fetchUsers(pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign roles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove roles
  const removeRoles = async (id, roles) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.removeRoles(id, roles);
      await fetchUsers(pagination.page, pagination.size);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove roles');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    getUserById,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    resetPassword,
    assignRoles,
    removeRoles
  };
};
