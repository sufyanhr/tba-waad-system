/**
 * KANBAN API ADAPTER - TBA-WAAD PROVIDER NETWORK BOARD
 * 
 * Domain Mapping:
 * - Kanban Board → Provider Network Management Board
 * - Columns → Provider Regions/Status (Tripoli, Benghazi, Sebha, Active, Pending, Blocked)
 * - Items → Healthcare Providers (Hospitals, Clinics, Labs, Pharmacies)
 * - Stories → Provider Contracts/Agreements
 * - Comments → Provider Notes/Audit Logs
 * 
 * This adapter preserves backward compatibility with the Mantis template UI
 * while connecting to the real TBA provider network backend.
 * 
 * @deprecated Legacy function names (addColumn, addItem) are maintained for UI compatibility
 * @see services/api/providersService.js for direct backend access
 */

import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// TBA Domain Services
import { providersService } from 'services/api/providersService';

// utils
import { fetcher } from 'utils/axios';

const initialState = {
  selectedItem: false
};

// Legacy endpoints structure - kept for UI compatibility
const endpoints = {
  key: 'api/kanban',
  master: 'master',
  list: '/backlogs', // server URL
  addColumn: '/add-column', // server URL
  editColumn: '/edit-column', // server URL
  updateColumnOrder: '/update-column-order', // server URL
  deleteColumn: '/delete-column', // server URL
  addItem: '/add-item', // server URL
  editItem: '/edit-item', // server URL
  updateColumnItemOrder: '/update-item-order', // server URL
  addItemComment: '/add-item-comment', // server URL
  deleteItem: '/delete-item', // server URL
  addStory: '/add-story', // server URL
  editStory: '/edit-story', // server URL
  updateStoryOrder: '/update-story-order', // server URL
  updateStoryItemOrder: '/update-storyitem-order', // server URL
  addStoryComment: '/add-story-comment', // server URL
  deleteStory: '/delete-story' // server URL
};

// ==============================|| DATA TRANSFORMATION ||============================== //

/**
 * Predefined board columns for provider regions/statuses
 */
const PROVIDER_COLUMNS = [
  { id: 'tripoli', title: 'Tripoli', region: 'TRIPOLI' },
  { id: 'benghazi', title: 'Benghazi', region: 'BENGHAZI' },
  { id: 'sebha', title: 'Sebha', region: 'SEBHA' },
  { id: 'other', title: 'Other Regions', region: 'OTHER' }
];

/**
 * Transform provider to kanban item
 * @param {Object} provider - Provider from backend
 * @returns {Object} Kanban item format
 */
function transformProviderToItem(provider) {
  if (!provider) return null;

  return {
    id: `provider-${provider.id}`,
    providerId: provider.id,
    title: provider.nameEn || provider.nameAr || 'Unnamed Provider',
    description: provider.address || provider.city || '',
    priority: provider.status === 'ACTIVE' ? 'high' : provider.status === 'PENDING' ? 'medium' : 'low',
    dueDate: provider.createdAt || new Date().toISOString(),
    
    // Provider specific fields
    type: provider.type || 'HOSPITAL',
    status: provider.status || 'ACTIVE',
    region: provider.region || provider.city || 'OTHER',
    phone: provider.phone,
    email: provider.email,
    
    // Kanban template fields
    assign: 'admin',
    commentIds: [],
    image: false,
    
    // Preserve original provider data
    _original: provider
  };
}

/**
 * Transform providers into kanban board structure
 * @param {Array} providers - Array of providers from backend
 * @returns {Object} Complete kanban backlogs structure
 */
function transformProvidersToBacklogs(providers) {
  if (!Array.isArray(providers)) providers = [];

  // Transform all providers to items
  const items = providers.map(transformProviderToItem).filter(Boolean);

  // Create columns with provider assignments by region
  const columns = PROVIDER_COLUMNS.map(col => {
    const regionItems = items.filter(item => {
      const region = (item.region || '').toUpperCase();
      if (col.region === 'OTHER') {
        return !['TRIPOLI', 'BENGHAZI', 'SEBHA'].includes(region);
      }
      return region.includes(col.region) || region.includes(col.title.toUpperCase());
    });

    return {
      id: col.id,
      title: col.title,
      itemIds: regionItems.map(item => item.id)
    };
  });

  const columnsOrder = columns.map(col => col.id);

  // Create user stories grouped by provider type
  const providerTypes = ['HOSPITAL', 'CLINIC', 'LAB', 'PHARMACY', 'OTHER'];
  const userStory = providerTypes.map((type, index) => {
    const typeItems = items.filter(item => (item.type || 'OTHER').toUpperCase() === type);
    
    return {
      id: `story-${type.toLowerCase()}`,
      title: `${type.charAt(0) + type.slice(1).toLowerCase()} Providers`,
      description: `Healthcare providers of type ${type}`,
      priority: type === 'HOSPITAL' ? 'high' : type === 'CLINIC' ? 'medium' : 'low',
      dueDate: new Date().toISOString(),
      assign: 'admin',
      columnId: columns[0]?.id || 'tripoli',
      commentIds: [],
      itemIds: typeItems.map(item => item.id)
    };
  });

  const userStoryOrder = userStory.map(story => story.id);

  // Mock profiles (admin user)
  const profiles = [
    {
      id: 'admin',
      name: 'System Admin',
      avatar: 1,
      role: 'Administrator'
    }
  ];

  return {
    columns,
    columnsOrder,
    items,
    profiles,
    userStory,
    userStoryOrder
  };
}

/**
 * Fetch providers and transform to kanban structure
 */
async function fetchProvidersAsBacklogs() {
  try {
    const providers = await providersService.getAll();
    const backlogs = transformProvidersToBacklogs(providers);
    return { backlogs };
  } catch (error) {
    console.error('[Kanban API] Failed to fetch providers:', error);
    // Return empty structure on error
    return {
      backlogs: {
        columns: PROVIDER_COLUMNS.map(col => ({ ...col, itemIds: [] })),
        columnsOrder: PROVIDER_COLUMNS.map(col => col.id),
        items: [],
        profiles: [{ id: 'admin', name: 'System Admin', avatar: 1 }],
        userStory: [],
        userStoryOrder: []
      }
    };
  }
}

export function useGetBacklogs() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key,
    fetchProvidersAsBacklogs,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      backlogs: data?.backlogs,
      backlogsLoading: isLoading,
      backlogsError: error,
      backlogsValidating: isValidating
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function addColumn(newColumn) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;
      const columns = [...backlogs.columns, newColumn];
      const columnsOrder = [...backlogs.columnsOrder, newColumn.id];

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columns,
          columnsOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { column: newColumn };
  //   await axios.post(endpoints.key + endpoints.addColumn, data);
}

export async function editColumn(newColumn) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      const column = backlogs.columns.splice(
        backlogs.columns.findIndex((c) => c.id === newColumn.id),
        1,
        newColumn
      );
      const columns = [...backlogs.columns, column];

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columns
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  // const data = { column: newColumn };
  // await axios.post(endpoints.key + endpoints.editColumn, data);
}

export async function updateColumnOrder(columnsOrder) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columnsOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { columnsOrder };
  //   await axios.post(endpoints.key + endpoints.updateColumnOrder, data);
}

export async function deleteColumn(columnId) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      const columns = backlogs.columns.filter((column) => column.id !== columnId);
      const columnsOrder = backlogs.columnsOrder.filter((id) => id !== columnId);

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columns,
          columnsOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { columnId };
  //   await axios.post(endpoints.key + endpoints.deleteColumn, data);
}

export async function addItem(columnId, item, storyId) {
  try {
    // Map kanban item to provider data
    const providerData = {
      nameEn: item.title,
      nameAr: item.title,
      type: item.type || 'HOSPITAL',
      status: item.status || 'ACTIVE',
      region: item.region || 'OTHER',
      city: item.region || 'Tripoli',
      address: item.description || '',
      phone: item.phone || '',
      email: item.email || '',
      licenseNumber: `LIC${Date.now()}`
    };

    // Create provider in backend
    const createdProvider = await providersService.create(providerData);
    const transformedItem = transformProviderToItem(createdProvider);

    // Update local state
    mutate(
      endpoints.key,
      (currentBacklog) => {
        const backlogs = currentBacklog.backlogs;

        let columns = backlogs.columns;
        if (columnId !== '0') {
          columns = backlogs.columns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                itemIds: column.itemIds ? [...column.itemIds, transformedItem.id] : [transformedItem.id]
              };
            }
            return column;
          });
        }

        let userStory = backlogs.userStory;
        if (storyId !== '0') {
          userStory = backlogs.userStory.map((story) => {
            if (story.id === storyId) {
              return {
                ...story,
                itemIds: story.itemIds ? [...story.itemIds, transformedItem.id] : [transformedItem.id]
              };
            }
            return story;
          });
        }

        const items = [...backlogs.items, transformedItem];

        return {
          ...currentBacklog,
          backlogs: {
            ...backlogs,
            columns,
            userStory,
            items
          }
        };
      },
      false
    );

    return transformedItem;
  } catch (error) {
    console.error('[Kanban API] Failed to create provider:', error);
    throw error;
  }
}

export async function editItem(columnId, newItem, storyId) {
  try {
    // Extract provider ID from item ID
    const providerId = newItem.providerId || parseInt(newItem.id.replace('provider-', ''));

    // Map kanban item back to provider data
    const providerData = {
      nameEn: newItem.title,
      nameAr: newItem.title,
      type: newItem.type || 'HOSPITAL',
      status: newItem.status || 'ACTIVE',
      region: newItem.region || 'OTHER',
      city: newItem.region || 'Tripoli',
      address: newItem.description || '',
      phone: newItem.phone || '',
      email: newItem.email || ''
    };

    // Update provider in backend
    const updatedProvider = await providersService.update(providerId, providerData);
    const transformedItem = transformProviderToItem(updatedProvider);

    // Update local state
    mutate(
      endpoints.key,
      (currentBacklog) => {
        const backlogs = currentBacklog.backlogs;

        const item = backlogs.items.splice(
          backlogs.items.findIndex((c) => c.id === transformedItem.id),
          1,
          transformedItem
        );
        const items = [...backlogs.items, item];

        let userStory = backlogs.userStory;
        if (storyId) {
          const currentStory = backlogs.userStory.filter((story) => story.itemIds.filter((itemId) => itemId === transformedItem.id)[0])[0];
          if (currentStory !== undefined && currentStory.id !== storyId) {
            userStory = backlogs.userStory.map((story) => {
              if (story.itemIds.filter((itemId) => itemId === transformedItem.id)[0]) {
                return {
                  ...story,
                  itemIds: story.itemIds.filter((itemId) => itemId !== transformedItem.id)
                };
              }
              if (story.id === storyId) {
                return {
                  ...story,
                  itemIds: story.itemIds ? [...story.itemIds, transformedItem.id] : [transformedItem.id]
                };
              }
              return story;
            });
          }

          if (currentStory === undefined) {
            userStory = backlogs.userStory.map((story) => {
              if (story.id === storyId) {
                return {
                  ...story,
                  itemIds: story.itemIds ? [...story.itemIds, transformedItem.id] : [transformedItem.id]
                };
              }
              return story;
            });
          }
        }

        let columns = backlogs.columns;
        if (columnId) {
          const currentColumn = backlogs.columns.filter((column) => column.itemIds.filter((itemId) => itemId === transformedItem.id)[0])[0];
          if (currentColumn !== undefined && currentColumn.id !== columnId) {
            columns = backlogs.columns.map((column) => {
              if (column.itemIds.filter((itemId) => itemId === transformedItem.id)[0]) {
                return {
                  ...column,
                  itemIds: column.itemIds.filter((itemId) => itemId !== transformedItem.id)
                };
              }
              if (column.id === columnId) {
                return {
                  ...column,
                  itemIds: column.itemIds ? [...column.itemIds, transformedItem.id] : [transformedItem.id]
                };
              }
              return column;
            });
          }

          if (currentColumn === undefined) {
            columns = backlogs.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  itemIds: column.itemIds ? [...column.itemIds, transformedItem.id] : [transformedItem.id]
                };
              }
              return column;
            });
          }
        }

        return {
          ...currentBacklog,
          backlogs: {
            ...backlogs,
            columns,
            userStory,
            items
          }
        };
      },
      false
    );

    return transformedItem;
  } catch (error) {
    console.error('[Kanban API] Failed to update provider:', error);
    throw error;
  }
}
                itemIds: story.itemIds ? [...story.itemIds, newItem.id] : [newItem.id]
              };
            }
            return story;
          });
        }

        if (currentStory === undefined) {
          userStory = backlogs.userStory.map((story) => {
            if (story.id === storyId) {
              return {
                ...story,
                itemIds: story.itemIds ? [...story.itemIds, newItem.id] : [newItem.id]
              };
            }
            return story;
          });
        }
      }

      let columns = backlogs.columns;
      if (columnId) {
        const currentColumn = backlogs.columns.filter((column) => column.itemIds.filter((itemId) => itemId === newItem.id)[0])[0];
        if (currentColumn !== undefined && currentColumn.id !== columnId) {
          columns = backlogs.columns.map((column) => {
            if (column.itemIds.filter((itemId) => itemId === newItem.id)[0]) {
              return {
                ...column,
                itemIds: column.itemIds.filter((itemId) => itemId !== newItem.id)
              };
            }
            if (column.id === columnId) {
              return {
                ...column,
                itemIds: column.itemIds ? [...column.itemIds, newItem.id] : [newItem.id]
              };
            }
            return column;
          });
        }

        if (currentColumn === undefined) {
          columns = backlogs.columns.map((column) => {
            if (column.id === columnId) {
              return {
                ...column,
                itemIds: column.itemIds ? [...column.itemIds, newItem.id] : [newItem.id]
              };
            }
            return column;
          });
        }
      }

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columns,
          userStory,
          items
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { columnId, item: newItem, storyId };
  //   await axios.post(endpoints.key + endpoints.editItem, data);
}

export async function updateColumnItemOrder(columns) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          columns
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { columns };
  //   await axios.post(endpoints.key + endpoints.updateColumnItemOrder, data);
}

export async function addItemComment(itemId, comment) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      const items = backlogs.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            commentIds: item.commentIds ? [...item.commentIds, comment.id] : [comment.id]
          };
        }
        return item;
      });

      const comments = [...backlogs.comments, comment];

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          items,
          comments
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { itemId, comment };
  //   await axios.post(endpoints.key + endpoints.addItemComment, data);
}

export async function deleteItem(itemId) {
  try {
    // Extract provider ID from item ID
    const providerId = parseInt(itemId.replace('provider-', ''));

    // Delete provider from backend
    await providersService.remove(providerId);

    // Update local state
    mutate(
      endpoints.key,
      (currentBacklog) => {
        const backlogs = currentBacklog.backlogs;

        const items = backlogs.items.filter((item) => item.id !== itemId);
        const columns = backlogs.columns.map((column) => {
          const itemIds = column.itemIds.filter((id) => id !== itemId);
          return {
            ...column,
            itemIds
          };
        });

        const userStory = backlogs.userStory.map((story) => {
          const itemIds = story.itemIds.filter((id) => id !== itemId);
          return {
            ...story,
            itemIds
          };
        });

        return {
          ...currentBacklog,
          backlogs: {
            ...backlogs,
            items,
            columns,
            userStory
          }
        };
      },
      false
    );
  } catch (error) {
    console.error('[Kanban API] Failed to delete provider:', error);
    throw error;
  }
}

export async function addStory(newStory) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;
      const userStory = [...backlogs.userStory, newStory];
      const userStoryOrder = [...backlogs.userStoryOrder, newStory.id];

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStory,
          userStoryOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { story: newStory };
  //   await axios.post(endpoints.key + endpoints.addStory, data);
}

export async function editStory(newStory) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;
      backlogs.userStory.splice(
        backlogs.userStory.findIndex((c) => c.id === newStory.id),
        1,
        newStory
      );
      const userStory = [...backlogs.userStory];
      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStory
        }
      };
    },
    false
  );
  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { story: newStory };
  //   await axios.post(endpoints.key + endpoints.editStory, data);
}

export async function updateStoryOrder(userStoryOrder) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStoryOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { userStoryOrder };
  //   await axios.post(endpoints.key + endpoints.updateStoryOrder, data);
}

export async function updateStoryItemOrder(userStory) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStory
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { userStory };
  //   await axios.post(endpoints.key + endpoints.updateStoryItemOrder, data);
}

export async function addStoryComment(storyId, comment) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      const userStory = backlogs.userStory.map((story) => {
        if (story.id === storyId) {
          return {
            ...story,
            commentIds: story.commentIds ? [...story.commentIds, comment.id] : [comment.id]
          };
        }
        return story;
      });

      const comments = [...backlogs.comments, comment];

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStory,
          comments
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { storyId, comment };
  //   await axios.post(endpoints.key + endpoints.addStoryComment, data);
}

export async function deleteStory(storyId) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentBacklog) => {
      const backlogs = currentBacklog.backlogs;

      const userStory = backlogs.userStory.filter((column) => column.id !== storyId);
      const userStoryOrder = backlogs.userStoryOrder.filter((id) => id !== storyId);

      return {
        ...currentBacklog,
        backlogs: {
          ...backlogs,
          userStory,
          userStoryOrder
        }
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { storyId };
  //   await axios.post(endpoints.key + endpoints.deleteStory, data);
}

export function useGetKanbanMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      kanbanMaster: data,
      kanbanMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerKanbanDialog(selectedItem) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentKanbanMaster) => {
      return { ...currentKanbanMaster, selectedItem };
    },
    false
  );
}
