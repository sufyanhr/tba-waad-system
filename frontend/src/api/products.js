// ==============================|| PRODUCTS API - MEDICAL SERVICES ADAPTER ||============================== //
// LEGACY COMPATIBILITY LAYER
// This file maintains backward compatibility with Mantis template "Products" UI
// while connecting to real TBA Medical Services backend
//
// DOMAIN MAPPING:
// - Template "Products" → TBA "Medical Services" (procedures, tests, imaging)
// - This adapter allows existing UI components to work without modification
//
// NOTE: For new code, use `services/api/medicalServicesService.js` directly

import medicalServicesService from 'services/api/medicalServicesService';
import medicalCategoriesService from 'services/api/medicalCategoriesService';

// ==============================|| DATA TRANSFORMATION ||============================== //

/**
 * Transform backend medical service to template product format
 * @param {Object} service - Medical service from backend
 * @returns {Object} Template-compatible product object
 */
function transformServiceToProduct(service) {
  if (!service) return null;
  
  return {
    // Map backend fields to template fields
    id: service.id,
    name: service.nameEn || service.nameAr || 'Unnamed Service',
    description: service.nameAr || service.nameEn || '',
    code: service.code,
    
    // Price mapping
    offerPrice: service.priceLyd || 0,
    salePrice: service.priceLyd || 0,
    price: service.costLyd || service.priceLyd || 0,
    
    // Category mapping
    categories: service.categoryNameEn ? [service.categoryNameEn] : ['Uncategorized'],
    categoryId: service.categoryId,
    categoryNameAr: service.categoryNameAr,
    categoryNameEn: service.categoryNameEn,
    
    // Stock/availability (default to in-stock for medical services)
    isStock: true,
    quantity: 999,
    
    // Template-specific fields with defaults
    image: null,
    rating: 0,
    discount: 0,
    
    // Preserve original backend fields for reference
    _original: service
  };
}

/**
 * Transform array of services to products
 */
function transformServicesToProducts(services) {
  if (!Array.isArray(services)) return [];
  return services.map(transformServiceToProduct).filter(Boolean);
}

// ==============================|| BACKWARD-COMPATIBLE WRAPPERS ||============================== //

/**
 * @deprecated Use medicalServicesService.getAll() instead
 * Legacy wrapper for template compatibility
 */
export async function getProducts(params) {
  try {
    const services = await medicalServicesService.getAll(params);
    return transformServicesToProducts(services);
  } catch (error) {
    console.error('[Products API] Failed to fetch medical services:', error);
    return [];
  }
}

/**
 * @deprecated Use medicalServicesService.create() instead
 */
export async function createProduct(data) {
  try {
    // Transform template format to backend format
    const serviceData = {
      code: data.code || `SVC${Date.now()}`,
      nameEn: data.name || data.nameEn,
      nameAr: data.nameAr || data.description || data.name,
      priceLyd: data.offerPrice || data.price || 0,
      costLyd: data.price || data.cost || 0,
      categoryId: data.categoryId || null
    };
    
    const created = await medicalServicesService.create(serviceData);
    return transformServiceToProduct(created);
  } catch (error) {
    console.error('[Products API] Failed to create medical service:', error);
    throw error;
  }
}

/**
 * @deprecated Use medicalServicesService.update() instead
 */
export async function updateProduct(id, data) {
  try {
    // Transform template format to backend format
    const serviceData = {
      code: data.code,
      nameEn: data.name || data.nameEn,
      nameAr: data.nameAr || data.description || data.name,
      priceLyd: data.offerPrice || data.price || 0,
      costLyd: data.price || data.cost || 0,
      categoryId: data.categoryId || null
    };
    
    const updated = await medicalServicesService.update(id, serviceData);
    return transformServiceToProduct(updated);
  } catch (error) {
    console.error('[Products API] Failed to update medical service:', error);
    throw error;
  }
}

/**
 * @deprecated Use medicalServicesService.remove() instead
 */
export async function deleteProduct(id) {
  try {
    return await medicalServicesService.remove(id);
  } catch (error) {
    console.error('[Products API] Failed to delete medical service:', error);
    throw error;
  }
}

// ==============================|| TEMPLATE-SPECIFIC LOADERS ||============================== //

/**
 * Legacy loader function for React Router compatibility
 * Used by Mantis template routing system
 */
export async function loader() {
  const services = await getProducts();
  return services; // Already transformed by getProducts()
}

/**
 * Legacy filter function
 * Filters medical services by search term, category, price range, etc.
 * Enhanced with Medical Categories support
 * @param {Object} filter - Filter object with search, categories, price, categoryId, etc.
 */
export async function filterProducts(filter) {
  try {
    const allProducts = await getProducts(); // Already transformed
    
    if (!filter) return { data: allProducts };
    
    let filtered = [...allProducts];
    
    // Search filter (nameAr, nameEn, code)
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.nameAr?.toLowerCase().includes(searchTerm) || 
        item.nameEn?.toLowerCase().includes(searchTerm) ||
        item.code?.toLowerCase().includes(searchTerm) ||
        item.categoryNameAr?.toLowerCase().includes(searchTerm) ||
        item.categoryNameEn?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Category ID filter (new - domain-aligned)
    if (filter.categoryId) {
      filtered = filtered.filter(item => item.categoryId === filter.categoryId);
    }
    
    // Category name filter (legacy - string-based)
    if (filter.categories && filter.categories.length > 0 && !filter.categories.includes('all')) {
      filtered = filtered.filter(item => {
        // Support both old category string and new categoryNameEn/categoryNameAr
        const categoryMatch = filter.categories.some(cat => {
          const catLower = cat.toLowerCase();
          return (
            item.category?.toLowerCase().includes(catLower) ||
            item.categoryNameEn?.toLowerCase().includes(catLower) ||
            item.categoryNameAr?.toLowerCase().includes(catLower)
          );
        });
        return categoryMatch;
      });
    }
    
    // Price range filter
    if (filter.price) {
      const [min, max] = filter.price.split('-').map(Number);
      filtered = filtered.filter(item => {
        const price = item.priceLyd || 0;
        return price >= min && price <= max;
      });
    }
    
    // Sort
    if (filter.sort) {
      filtered.sort((a, b) => {
        const priceA = a.priceLyd || 0;
        const priceB = b.priceLyd || 0;
        
        switch (filter.sort) {
          case 'low':
            return priceA - priceB;
          case 'high':
            return priceB - priceA;
          case 'popularity':
            return 0; // No popularity field yet
          case 'new':
            return b.id - a.id; // Newer IDs first
          case 'category':
            // Sort by category name
            const catA = a.categoryNameEn || a.categoryNameAr || '';
            const catB = b.categoryNameEn || b.categoryNameAr || '';
            return catA.localeCompare(catB);
          default:
            return 0;
        }
      });
    }
    
    return { data: filtered };
  } catch (error) {
    console.error('[Products API] Failed to filter medical services:', error);
    return { data: [] };
  }
}

/**
 * Legacy product detail loader for React Router
 */
export async function productLoader({ params }) {
  try {
    const service = await medicalServicesService.getById(params.id);
    return transformServiceToProduct(service);
  } catch (error) {
    console.error('[Products API] Failed to fetch medical service details:', error);
    return null;
  }
}

// ==============================|| STUB FUNCTIONS FOR TEMPLATE ||============================== //

/**
 * Not applicable for medical services
 * Returns empty array for template compatibility
 */
export async function getRelatedProducts(id) {
  console.warn('[Products API] getRelatedProducts not implemented for medical services');
  return [];
}

/**
 * Not applicable for medical services
 * Returns empty array for template compatibility
 */
export async function getProductReviews() {
  console.warn('[Products API] getProductReviews not implemented for medical services');
  return [];
}

// ==============================|| DOMAIN-ALIGNED EXPORTS ||============================== //

// Export medical services service for direct use
export { default as medicalServicesService } from 'services/api/medicalServicesService';
export { default as medicalCategoriesService } from 'services/api/medicalCategoriesService';

// Alias exports with domain-correct naming
export const getMedicalServices = getProducts;
export const createMedicalService = createProduct;
export const updateMedicalService = updateProduct;
export const deleteMedicalService = deleteProduct;

// Category helper functions
export const getMedicalCategories = medicalCategoriesService.getAll;
export const getMedicalCategoryOptions = medicalCategoriesService.getOptions;
