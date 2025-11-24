import { useState, useEffect, useMemo } from 'react';
import { DataTable, RBACGuard } from 'components/tba';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import { medicalServicesService } from 'services/api';

export default function MedicalServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await medicalServicesService.getAll();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load medical services:', error);
      enqueueSnackbar('Failed to load medical services', { variant: 'error' });
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = useMemo(() => [
    { header: 'Code', accessorKey: 'code' },
    { header: 'Name (Arabic)', accessorKey: 'nameAr' },
    { header: 'Name (English)', accessorKey: 'nameEn' },
    { header: 'Category', accessorKey: 'categoryNameEn' },
    { 
      header: 'Price (LYD)', 
      accessorKey: 'priceLyd', 
      cell: ({ getValue }) => getValue() ? `${getValue()?.toFixed(2)}` : '-' 
    },
    { 
      header: 'Cost (LYD)', 
      accessorKey: 'costLyd', 
      cell: ({ getValue }) => getValue() ? `${getValue()?.toFixed(2)}` : '-' 
    },
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
    <RBACGuard requiredPermissions={['READ_MEDICAL_SERVICE']}>
      <DataTable
        title="Medical Services"
        columns={columns}
        data={services}
        loading={loading}
        enableRowActions={false}
      />
    </RBACGuard>
  );
}
