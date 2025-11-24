import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'components/MainCard';
import { openSnackbar } from 'api/snackbar';
import { createProduct, getMedicalCategoryOptions } from 'api/products';

// assets
import UploadOutlined from '@ant-design/icons/UploadOutlined';

// ==============================|| ADD NEW PRODUCT - MAIN ||============================== //

export default function AddNewProduct() {
  const history = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    code: '',
    categoryId: '',
    price: '',
    cost: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      try {
        const categoryOptions = await getMedicalCategoryOptions();
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Failed to load categories:', error);
        openSnackbar({
          open: true,
          message: 'Failed to load categories',
          variant: 'alert',
          alert: { color: 'error' }
        });
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name) {
      openSnackbar({
        open: true,
        message: 'Please enter product name',
        variant: 'alert',
        alert: { color: 'warning' }
      });
      return;
    }

    if (!formData.price) {
      openSnackbar({
        open: true,
        message: 'Please enter price',
        variant: 'alert',
        alert: { color: 'warning' }
      });
      return;
    }

    setSubmitting(true);
    try {
      await createProduct({
        name: formData.name,
        nameAr: formData.nameAr || formData.description || formData.name,
        code: formData.code || `SVC${Date.now()}`,
        description: formData.description,
        categoryId: formData.categoryId || null,
        offerPrice: parseFloat(formData.price) || 0,
        price: parseFloat(formData.cost) || parseFloat(formData.price) || 0
      });

      openSnackbar({
        open: true,
        message: 'Medical service created successfully',
        variant: 'alert',
        alert: { color: 'success' }
      });

      // Navigate back to list
      setTimeout(() => {
        history(`/apps/e-commerce/product-list`);
      }, 1000);
    } catch (error) {
      console.error('Failed to create product:', error);
      openSnackbar({
        open: true,
        message: error.message || 'Failed to create product',
        variant: 'alert',
        alert: { color: 'error' }
      });
    } finally {
      setSubmitting(false);
    }
  };

  const prices = [
    { value: '1', label: '$ 100' },
    { value: '2', label: '$ 200' },
    { value: '3', label: '$ 300' },
    { value: '4', label: '$ 400' }
  ];

  const quantities = [
    { value: 'one', label: '1' },
    { value: 'two', label: '2' },
    { value: 'three', label: '3' }
  ];

  const statuss = [
    { value: 'in stock', label: 'In Stock' },
    { value: 'out of stock', label: 'Out of Stock' }
  ];

  const [quantity, setQuantity] = useState('one');
  const [price, setPrice] = useState('1');
  const [status, setStatus] = useState('in stock');

  const handlePrice = (event) => {
    setPrice(event.target.value);
  };

  const handleQuantity = (event) => {
    setQuantity(event.target.value);
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
  };

  const handleCancel = () => {
    history(`/apps/e-commerce/product-list`);
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard>
            <Stack sx={{ gap: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Service Name (English)*</InputLabel>
                <TextField 
                  placeholder="Enter service name" 
                  fullWidth 
                  value={formData.name}
                  onChange={handleChange('name')}
                />
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Service Name (Arabic)</InputLabel>
                <TextField 
                  placeholder="أدخل اسم الخدمة" 
                  fullWidth 
                  value={formData.nameAr}
                  onChange={handleChange('nameAr')}
                />
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Description</InputLabel>
                <TextField 
                  placeholder="Enter service description" 
                  fullWidth 
                  multiline 
                  rows={3} 
                  value={formData.description}
                  onChange={handleChange('description')}
                />
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Service Code</InputLabel>
                <TextField 
                  placeholder="Enter service code (auto-generated if empty)" 
                  fullWidth 
                  value={formData.code}
                  onChange={handleChange('code')}
                />
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Category</InputLabel>
                <TextField 
                  placeholder="Select category" 
                  fullWidth 
                  select 
                  value={formData.categoryId}
                  onChange={handleChange('categoryId')}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Uncategorized</em>
                  </MenuItem>
                  {categories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Price (LYD)*</InputLabel>
                <TextField 
                  placeholder="Enter price in Libyan Dinar" 
                  fullWidth 
                  type="number"
                  value={formData.price}
                  onChange={handleChange('price')}
                />
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Cost (LYD)</InputLabel>
                <TextField 
                  placeholder="Enter cost (optional)" 
                  fullWidth 
                  type="number"
                  value={formData.cost}
                  onChange={handleChange('cost')}
                />
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <MainCard>
            <Stack sx={{ gap: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Qty</InputLabel>
                <TextField placeholder="Select quantity" fullWidth select value={quantity} onChange={handleQuantity}>
                  {quantities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack sx={{ gap: 1 }}>
                <InputLabel>Status</InputLabel>
                <TextField placeholder="Select status" fullWidth select value={status} onChange={handleStatus}>
                  {statuss.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
              <Stack sx={{ gap: 1, alignItems: 'flex-start' }}>
                <Typography color="error.main">
                  *{' '}
                  <Typography component="span" color="text.secondary">
                    Recommended resolution is 640*640 with file size
                  </Typography>
                </Typography>
                <Button variant="outlined" color="secondary" startIcon={<UploadOutlined />} sx={{ textTransform: 'none' }}>
                  Click to Upload
                </Button>
              </Stack>

              <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'right', mt: 11 }}>
                <Button variant="outlined" color="secondary" onClick={handleCancel} disabled={submitting}>
                  Cancel
                </Button>
                <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Creating...' : 'Add Medical Service'}
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}
