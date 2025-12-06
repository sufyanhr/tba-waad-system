import { useState, useEffect, useCallback } from 'react';
import { getClaims, getClaimById, createClaim, updateClaim, deleteClaim } from 'services/claims.service';

export const useClaimsList = (initialParams = { page: 0, size: 10 }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getClaims(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'فشل تحميل المطالبات');
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

export const useClaimDetails = (id) => {
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClaim = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await getClaimById(id);
      setClaim(result);
    } catch (err) {
      setError(err.message || 'فشل تحميل تفاصيل المطالبة');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClaim();
  }, [fetchClaim]);

  return {
    claim,
    loading,
    error,
    refresh: fetchClaim
  };
};

export const useCreateClaim = () => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  const create = async (data) => {
    setCreating(true);
    setError(null);
    try {
      const result = await createClaim(data);
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || 'فشل إنشاء المطالبة';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setCreating(false);
    }
  };

  return { create, creating, error };
};

export const useUpdateClaim = () => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, data) => {
    setUpdating(true);
    setError(null);
    try {
      const result = await updateClaim(id, data);
      return { success: true, data: result };
    } catch (err) {
      const errorMsg = err.message || 'فشل تحديث المطالبة';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setUpdating(false);
    }
  };

  return { update, updating, error };
};

export const useDeleteClaim = () => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const remove = async (id) => {
    setDeleting(true);
    setError(null);
    try {
      await deleteClaim(id);
      return { success: true };
    } catch (err) {
      const errorMsg = err.message || 'فشل حذف المطالبة';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setDeleting(false);
    }
  };

  return { remove, deleting, error };
};
