import { useState, useEffect, useCallback } from 'react';
import { providersService } from 'services/api';

export const useProvidersList = (initialParams = { page: 0, size: 10 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getProviders(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'فشل تحميل المزودين');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh: fetchData
  };
};

export const useProviderDetails = (id) => {
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProvider = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getProviderById(id);
      setProvider(result);
    } catch (err) {
      setError(err.message || 'فشل تحميل تفاصيل المزود');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  return {
    provider,
    loading,
    error,
    refresh: fetchProvider
  };
};

export const useCreateProvider = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setCreating(true);
    setError(null);
    try {
      const result = await createProvider(data);
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || 'فشل إنشاء المزود';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setCreating(false);
    }
  };

  return { create, creating, error };
};

export const useUpdateProvider = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, data) => {
    setUpdating(true);
    setError(null);
    try {
      const result = await updateProvider(id, data);
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || 'فشل تحديث المزود';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUpdating(false);
    }
  };

  return { update, updating, error };
};

export const useDeleteProvider = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setDeleting(true);
    setError(null);
    try {
      await deleteProvider(id);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'فشل حذف المزود';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setDeleting(false);
    }
  };

  return { remove, deleting, error };
};
