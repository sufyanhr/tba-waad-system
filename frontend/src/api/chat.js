/**
 * CHAT API - TBA-WAAD INTERNAL OFFICE CHAT
 * 
 * Domain Purpose:
 * - Internal staff communication only (NOT member-facing)
 * - Used by Claims Reviewers, Medical Staff, and Admin teams
 * - Facilitates quick discussions about claims, providers, or member cases
 * 
 * Current Status: Mock template with SWR state management
 * 
 * Future Integration:
 * - Backend: WebSocket service for real-time messaging
 * - Channels: Claims Review, Provider Network, Member Services, General
 * - Features: File attachments, @mentions, claim/member references
 * 
 * @note This is NOT a member-facing chat system
 * @see For member communications, use dedicated support ticket system
 */

import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// utils
import { fetcher, fetcherPost } from 'utils/axios';

const endpoints = {
  key: 'api/chat',
  list: '/users', // server URL
  update: '/filter' // server URL
};

export function useGetUsers() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      users: data?.users,
      usersLoading: isLoading,
      usersError: error,
      usersValidating: isValidating,
      usersEmpty: !isLoading && !data?.users?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetUserChat(userName) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      chat: data || [],
      chatLoading: isLoading,
      chatError: error,
      chatValidating: isValidating,
      chatEmpty: !isLoading && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertChat(userName, newChat) {
  const URL = [endpoints.key + endpoints.update, { user: userName, endpoints: 'chat' }];

  // to update local state based on key
  mutate(
    URL,
    (currentChat) => {
      const addedChat = [...currentChat, newChat];
      return addedChat;
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  // const data = { chat: newChat };
  // await axios.post(endpoints.key + endpoints.update, data);
}
