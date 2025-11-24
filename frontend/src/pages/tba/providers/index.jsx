import { useState, useEffect, useMemo } from 'react';
import { DataTable, RBACGuard } from 'components/tba';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import { providersService } from 'services/api';

export default function ProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await providersService.getAll();
      setProviders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load providers:', error);
      enqueueSnackbar('Failed to load providers', { variant: 'error' });
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = useMemo(() => [
    { header: 'Code', accessorKey: 'code' },
    { header: 'Name (Arabic)', accessorKey: 'nameAr' },
    { header: 'Name (English)', accessorKey: 'nameEn' },
    {
      header: 'Type',
      accessorKey: 'providerType',
      cell: ({ getValue }) => {
        const type = getValue();
        const colorMap = { 
          HOSPITAL: 'primary', 
          CLINIC: 'success', 
          LAB: 'warning', 
          PHARMACY: 'info' 
        };
        return <Chip label={type} color={colorMap[type] || 'default'} size="small" />;
      }
    },
    { header: 'City', accessorKey: 'city' },
    { header: 'Phone', accessorKey: 'phone' },
    { 
      header: 'Status', 
      accessorKey: 'active', 
      cell: ({ getValue }) => (
        <Chip
          label={getValue() ? 'Active' : 'Inactive'}
          color={getValue() ? 'success' : 'default'}
          size="small"
        />
      )
    }
  ], []);

  return (
    <RBACGuard requiredPermissions={['READ_PROVIDER']}>
      <DataTable
        title="Healthcare Providers"
        columns={columns}
        data={providers}
        loading={loading}
        enableRowActions={false}
      />
    </RBACGuard>
  );
}
