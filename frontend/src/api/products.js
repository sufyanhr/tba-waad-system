import axiosClient from 'api/axiosClient';

// ⬇️ this is the loader for the detail route
export async function loader() {
  try {
    return (await axiosClient.get('/products/list')).data.products;
  } catch (e) {
    return e;
  }
}

export async function filterProducts(filter) {
  return axiosClient.post('/products/filter', { filter });
}

export async function productLoader({ params }) {
  try {
    return (await axiosClient.post('/product/details', { id: params.id })).data;
  } catch (e) {
    return e;
  }
}

export async function getRelatedProducts(id) {
  return axiosClient.post('/product/related', { id });
}

export async function getProductReviews() {
  return axiosClient.get('/review/list');
}
