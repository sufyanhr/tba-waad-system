import { useState, useEffect, useMemo } from 'react';
import { DataTable, RBACGuard } from 'components/tba';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import { medicalCategoriesService } from 'services/api';

export default function MedicalCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await medicalCategoriesService.getAll();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load medical categories:', error);
      enqueueSnackbar('Failed to load medical categories', { variant: 'error' });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const columns = useMemo(() => [
    { header: 'Code', accessorKey: 'code' },
    { header: 'Name (Arabic)', accessorKey: 'nameAr' },
    { header: 'Name (English)', accessorKey: 'nameEn' },
    { header: 'Description', accessorKey: 'description' },
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
    <RBACGuard requiredPermissions={['READ_MEDICAL_CATEGORY']}>
      <DataTable
        title="Medical Categories"
        columns={columns}
        data={categories}
        loading={loading}
        enableRowActions={false}
      />
    </RBACGuard>
  );
}
