import { useEffect, useState, useCallback } from 'react';
import * as employersService from 'services/employers.service';

export const useEmployersList = (initialParams = {}) => {
  const [params, setParams] = useState({
    page: 0,
    size: 10,
    sortBy: 'id',
    sortDir: 'ASC',
    search: '',
    ...initialParams
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 0,
    size: 10
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employersService.getEmployers(params);
      setData({
        items: response.items ?? [],
        total: response.total ?? 0,
        page: response.page ?? params.page,
        size: response.size ?? params.size
      });
    } catch (err) {
      console.error('Failed to load employers list', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh: load
  };
};

export const useEmployerDetails = (id) => {
  const [employer, setEmployer] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await employersService.getEmployerById(id);
      setEmployer(response);
    } catch (err) {
      console.error('Failed to load employer details', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return {
    employer,
    loading,
    error,
    refresh: load
  };
};
