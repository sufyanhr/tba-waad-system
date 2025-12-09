import { useEffect, useState, useCallback } from 'react';
import { membersService } from 'services/api/members.service';

export const useMembersList = (initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    size: 10,
    sortBy: 'id',
    sortDir: 'desc',
    search: '',
    ...initialParams
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    size: 10
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await membersService.getMembers(params);
      setData({
        items: response.items ?? [],
        total: response.total ?? 0,
        page: response.page ?? params.page,
        size: response.size ?? params.size
      });
    } catch (err) {
      console.error('Failed to load members list', err);
      setError(err);
      setData({ items: [], total: 0, page: params.page, size: params.size });
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    params,
    setParams,
    refresh
  };
};

export const useMemberDetails = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await membersService.getMemberById(id);
      setData(response);
    } catch (err) {
      console.error('Failed to load member details', err);
      setError(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    load();
  }, [load]);

  return {
    data,
    loading,
    error,
    refresh
  };
};
