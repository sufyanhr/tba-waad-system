import { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { HistoryOutlined } from '@ant-design/icons';

import MainCard from 'components/MainCard';
import { useAuditLog } from '../../hooks/systemadmin/useAuditLog';
import { useUsers } from '../../hooks/systemadmin/useUsers';

export default function AuditLog() {
  const {
    auditLogs,
    actionTypes,
    loading,
    pagination,
    fetchAuditLogs,
    getAuditLogsByUser,
    getAuditLogsByAction,
    fetchActionTypes
  } = useAuditLog();

  const { users, fetchUsers } = useUsers();

  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    entityType: '',
    startDate: '',
    endDate: ''
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20
  });

  useEffect(() => {
    fetchUsers(0, 100);
    fetchActionTypes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [paginationModel.page, paginationModel.pageSize]);

  const applyFilters = () => {
    if (filters.userId) {
      getAuditLogsByUser(filters.userId, paginationModel.page, paginationModel.pageSize);
    } else if (filters.action) {
      getAuditLogsByAction(filters.action, paginationModel.page, paginationModel.pageSize);
    } else {
      fetchAuditLogs(paginationModel.page, paginationModel.pageSize);
    }
  };

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleApplyFilters = () => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
    applyFilters();
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2">
          {new Date(params.row.timestamp).toLocaleString()}
        </Typography>
      )
    },
    {
      field: 'userId',
      headerName: 'User',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const user = users.find((u) => u.id === params.row.userId);
        return (
          <Typography variant="body2">
            {user?.username || `User ${params.row.userId}`}
          </Typography>
        );
      }
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        const colorMap = {
          CREATE: 'success',
          UPDATE: 'info',
          DELETE: 'error',
          LOGIN: 'primary',
          LOGOUT: 'default'
        };
        return (
          <Chip
            label={params.row.action}
            size="small"
            color={colorMap[params.row.action] || 'default'}
          />
        );
      }
    },
    {
      field: 'entityType',
      headerName: 'Entity Type',
      width: 130
    },
    {
      field: 'entityId',
      headerName: 'Entity ID',
      width: 100
    },
    {
      field: 'ipAddress',
      headerName: 'IP Address',
      width: 140
    },
    {
      field: 'details',
      headerName: 'Details',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.row.details || '-'}
        </Typography>
      )
    }
  ];

  return (
    <MainCard title="Audit Log" avatar={<HistoryOutlined style={{ fontSize: 24 }} />}>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>User</InputLabel>
            <Select
              value={filters.userId}
              onChange={handleFilterChange('userId')}
              label="User"
            >
              <MenuItem value="">All Users</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Action</InputLabel>
            <Select
              value={filters.action}
              onChange={handleFilterChange('action')}
              label="Action"
            >
              <MenuItem value="">All Actions</MenuItem>
              {actionTypes.map((action) => (
                <MenuItem key={action} value={action}>
                  {action}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            label="Entity Type"
            value={filters.entityType}
            onChange={handleFilterChange('entityType')}
            placeholder="e.g., User, Role"
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 2, cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => {
                setFilters({
                  userId: '',
                  action: '',
                  entityType: '',
                  startDate: '',
                  endDate: ''
                });
                fetchAuditLogs(paginationModel.page, paginationModel.pageSize);
              }}
            >
              Clear
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* DataGrid */}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={auditLogs}
          columns={columns}
          loading={loading}
          pagination
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            }
          }}
        />
      </Box>
    </MainCard>
  );
}
