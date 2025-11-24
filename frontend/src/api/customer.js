// ==============================|| CUSTOMER API - MEMBERS ADAPTER ||============================== //
// LEGACY COMPATIBILITY LAYER
// This file maintains backward compatibility with Mantis template "Customer" UI
// while connecting to real TBA Members backend
//
// DOMAIN MAPPING:
// - Template "Customer" → TBA "Members" (insured employees + dependents)
// - This adapter allows existing UI components to work without modification
//
// NOTE: For new code, use `services/api/membersService.js` directly

import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import membersService from 'services/api/membersService';

const endpoints = {
  key: 'api/customer',
  list: '/list'
};

// ==============================|| DATA TRANSFORMATION ||============================== //

/**
 * Transform backend member to template customer format
 * @param {Object} member - Member from backend
 * @returns {Object} Template-compatible customer object
 */
function transformMemberToCustomer(member) {
  if (!member) return null;
  
  // Calculate age from dateOfBirth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 30; // Default age
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age || 30;
  };

  return {
    // Core identity fields
    id: member.id,
    name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown Member',
    fatherName: member.firstName || '',
    email: member.email || `member${member.id}@tba.ly`,
    
    // Contact information
    contact: member.phone || member.phoneNumber || '',
    phone: member.phone || member.phoneNumber || '',
    
    // Demographics
    age: calculateAge(member.dateOfBirth),
    dateOfBirth: member.dateOfBirth,
    gender: member.gender || 'Male',
    
    // Location
    address: member.address || '',
    location: member.address || 'Libya',
    country: 'Libya',
    
    // Member-specific data
    memberNumber: member.memberNumber,
    nationalId: member.nationalId,
    
    // Insurance/employment
    employerId: member.employerId,
    employerName: member.employerName,
    insuranceCompanyId: member.insuranceCompanyId,
    insuranceCompanyName: member.insuranceCompanyName,
    
    // Status
    status: member.status || 'ACTIVE',
    orders: 0,
    progress: member.status === 'ACTIVE' ? 100 : 0,
    
    // Avatar (use id for deterministic avatar selection)
    avatar: (member.id % 10) + 1,
    
    // Role for template compatibility
    role: member.employerName || 'Member',
    
    // Preserve original data
    _original: member
  };
}

/**
 * Transform array of members to customers
 */
function transformMembersToCustomers(members) {
  if (!Array.isArray(members)) return [];
  return members.map(transformMemberToCustomer).filter(Boolean);
}

// ==============================|| SWR HOOKS ||============================== //

/**
 * @deprecated Use membersService directly with your own state management
 * Legacy SWR hook for template compatibility
 */
export function useGetCustomer() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.list,
    async () => {
      try {
        const members = await membersService.getAll();
        const customers = transformMembersToCustomers(members);
        return { customers };
      } catch (err) {
        console.error('[Customer API] Failed to fetch members:', err);
        return { customers: [] };
      }
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      customers: data?.customers || [],
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && !data?.customers?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ==============================|| CRUD OPERATIONS ||============================== //

/**
 * @deprecated Use membersService.create() instead
 * Legacy insert function for template compatibility
 */
export async function insertCustomer(newCustomer) {
  try {
    // Map customer fields to member fields
    const memberData = {
      firstName: newCustomer.fatherName || newCustomer.name?.split(' ')[0] || '',
      lastName: newCustomer.name?.split(' ').slice(1).join(' ') || '',
      nationalId: newCustomer.nationalId || newCustomer.id || '',
      phone: newCustomer.contact || newCustomer.phone || '',
      email: newCustomer.email || '',
      address: newCustomer.address || newCustomer.location || '',
      dateOfBirth: newCustomer.dateOfBirth || new Date().toISOString().split('T')[0],
      gender: newCustomer.gender || 'Male',
      employerId: newCustomer.employerId || 1,
      insuranceCompanyId: newCustomer.insuranceCompanyId || 1,
      status: newCustomer.status || 'ACTIVE'
    };

    const created = await membersService.create(memberData);
    const transformedCustomer = transformMemberToCustomer(created);

    // Update SWR cache
    mutate(
      endpoints.key + endpoints.list,
      (current) => {
        const customers = current?.customers || [];
        return {
          customers: [...customers, transformedCustomer]
        };
      },
      false
    );

    return transformedCustomer;
  } catch (error) {
    console.error('[Customer API] Failed to insert member:', error);
    throw error;
  }
}

/**
 * @deprecated Use membersService.update() instead
 * Legacy update function for template compatibility
 */
export async function updateCustomer(customerId, updatedCustomer) {
  try {
    // Map customer fields to member fields
    const memberData = {
      firstName: updatedCustomer.fatherName || updatedCustomer.name?.split(' ')[0] || '',
      lastName: updatedCustomer.name?.split(' ').slice(1).join(' ') || '',
      nationalId: updatedCustomer.nationalId || updatedCustomer.id || '',
      phone: updatedCustomer.contact || updatedCustomer.phone || '',
      email: updatedCustomer.email || '',
      address: updatedCustomer.address || updatedCustomer.location || '',
      dateOfBirth: updatedCustomer.dateOfBirth,
      gender: updatedCustomer.gender,
      status: updatedCustomer.status
    };

    const updated = await membersService.update(customerId, memberData);
    const transformedCustomer = transformMemberToCustomer(updated);

    // Update SWR cache
    mutate(
      endpoints.key + endpoints.list,
      (current) => {
        const customers = current?.customers || [];
        return {
          customers: customers.map((customer) =>
            customer.id === customerId ? transformedCustomer : customer
          )
        };
      },
      false
    );

    return transformedCustomer;
  } catch (error) {
    console.error('[Customer API] Failed to update member:', error);
    throw error;
  }
}

/**
 * @deprecated Use membersService.remove() instead
 * Legacy delete function for template compatibility
 */
export async function deleteCustomer(customerId) {
  try {
    await membersService.remove(customerId);

    // Update SWR cache
    mutate(
      endpoints.key + endpoints.list,
      (current) => {
        const customers = current?.customers || [];
        return {
          customers: customers.filter((customer) => customer.id !== customerId)
        };
      },
      false
    );
  } catch (error) {
    console.error('[Customer API] Failed to delete member:', error);
    throw error;
  }
}

export function useGetCustomerMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.modal, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      customerMaster: data,
      customerMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerCustomerDialog(modal) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.modal,
    (currentCustomermaster) => {
      return { ...currentCustomermaster, modal };
    },
    false
  );
}
