// ==============================|| INVOICE API - CLAIMS ADAPTER ||============================== //
// LEGACY COMPATIBILITY LAYER
// This file maintains backward compatibility with Mantis template "Invoice" UI
// while connecting to real TBA Claims backend
//
// DOMAIN MAPPING:
// - Template "Invoice" → TBA "Claims" (medical claim submissions)
// - This adapter allows existing UI components to work without modification
//
// NOTE: For new code, use `services/api/claimsService.js` directly

import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

// TBA Domain Services
import claimsService from 'services/api/claimsService';

// project imports
import { fetcher } from 'utils/axios';

const countries = [
  { code: 'LY', label: 'Libya Dinar', currency: 'Dinar', prefix: 'LYD' },
  { code: 'US', label: 'United States Dollar', currency: 'Dollar', prefix: '$' },
  { code: 'GB', label: 'United Kingdom Pound', currency: 'Pound', prefix: '£' },
  { code: 'IN', label: 'India Rupee', currency: 'Rupee', prefix: '₹' }
];

const initialState = {
  isOpen: false,
  isCustomerOpen: false,
  open: false,
  country: countries[0],
  countries: countries,
  alertPopup: false
};

const endpoints = {
  key: 'api/invoice',
  actions: 'actions',
  list: '/list', // server URL
  insert: '/insert', // server URL
  update: '/update', // server URL
  delete: '/delete' // server URL
};

// ==============================|| DATA TRANSFORMATION ||============================== //

/**
 * Transform claim to invoice format
 * @param {Object} claim - Claim from backend
 * @returns {Object} Template-compatible invoice object
 */
function transformClaimToInvoice(claim) {
  if (!claim) return null;

  // Calculate status for invoice
  let status = 'Unpaid';
  if (claim.status === 'APPROVED') status = 'Paid';
  else if (claim.status === 'REJECTED') status = 'Cancelled';
  else if (claim.status === 'PENDING') status = 'Unpaid';

  return {
    // Core identity
    id: claim.id,
    invoice_id: claim.claimNumber || `CLM-${claim.id}`,
    
    // Customer (member) information
    customer_name: claim.memberName || 'Unknown Member',
    email: claim.memberEmail || '',
    
    // Dates
    date: claim.visitDate || claim.createdAt || new Date().toISOString(),
    due_date: claim.visitDate || new Date().toISOString(),
    
    // Amounts
    quantity: 1,
    discount: 0,
    tax: 0,
    total: claim.claimedAmount || 0,
    
    // Status
    status: status,
    cashierInfo: {
      name: 'TBA System',
      address: 'Tripoli, Libya',
      phone: '+218-21-1234567',
      email: 'claims@tba.ly'
    },
    customerInfo: {
      name: claim.memberName || 'Unknown Member',
      address: claim.providerName || '',
      phone: '',
      email: claim.memberEmail || ''
    },
    
    // Invoice items (claim services)
    invoice_detail: [{
      id: 1,
      name: claim.serviceName || 'Medical Service',
      description: claim.diagnosis || '',
      qty: 1,
      price: claim.claimedAmount || 0
    }],
    
    // Notes
    notes: claim.notes || '',
    
    // Claim-specific fields
    claimNumber: claim.claimNumber,
    claimStatus: claim.status,
    visitId: claim.visitId,
    memberId: claim.memberId,
    providerId: claim.providerId,
    providerName: claim.providerName,
    serviceName: claim.serviceName,
    claimedAmount: claim.claimedAmount,
    approvedAmount: claim.approvedAmount,
    rejectionReason: claim.rejectionReason,
    
    // Preserve original data
    _original: claim
  };
}

/**
 * Transform array of claims to invoices
 */
function transformClaimsToInvoices(claims) {
  if (!Array.isArray(claims)) return [];
  return claims.map(transformClaimToInvoice).filter(Boolean);
}

/**
 * Fetch claims and transform to invoice structure
 */
async function fetchClaimsAsInvoices() {
  try {
    const claims = await claimsService.getAll();
    const invoices = transformClaimsToInvoices(claims);
    return { invoice: invoices };
  } catch (error) {
    console.error('[Invoice API] Failed to fetch claims:', error);
    return { invoice: [] };
  }
}

export function useGetInvoice() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.key + endpoints.list,
    fetchClaimsAsInvoices,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  const memoizedValue = useMemo(
    () => ({
      invoice: data?.invoice,
      invoiceLoading: isLoading,
      invoiceError: error,
      invoiceValidating: isValidating,
      invoiceEmpty: !isLoading && !data?.invoice?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertInvoice(newInvoice) {
  try {
    // Map invoice to claim data
    const claimData = {
      memberName: newInvoice.customer_name || newInvoice.customerInfo?.name,
      memberEmail: newInvoice.email || newInvoice.customerInfo?.email,
      visitDate: newInvoice.date || new Date().toISOString(),
      serviceName: newInvoice.invoice_detail?.[0]?.name || 'Medical Service',
      diagnosis: newInvoice.invoice_detail?.[0]?.description || '',
      claimedAmount: newInvoice.total || 0,
      status: 'PENDING',
      notes: newInvoice.notes || ''
    };

    // Create claim in backend
    const createdClaim = await claimsService.create(claimData);
    const transformedInvoice = transformClaimToInvoice(createdClaim);

    // Update local state
    mutate(
      endpoints.key + endpoints.list,
      (currentInvoice) => {
        const addedInvoice = [...(currentInvoice.invoice || []), transformedInvoice];
        return {
          ...currentInvoice,
          invoice: addedInvoice
        };
      },
      false
    );

    return transformedInvoice;
  } catch (error) {
    console.error('[Invoice API] Failed to create claim:', error);
    throw error;
  }
}

export async function updateInvoice(invoiceId, updatedInvoice) {
  try {
    // Map invoice updates to claim data
    const claimData = {
      notes: updatedInvoice.notes,
      claimedAmount: updatedInvoice.total
    };

    // Handle status changes (approve/reject)
    if (updatedInvoice.status === 'Paid' && updatedInvoice._original?.status !== 'APPROVED') {
      await claimsService.approve(invoiceId, {
        approvedAmount: updatedInvoice.total,
        notes: updatedInvoice.notes || 'Approved via invoice'
      });
    } else if (updatedInvoice.status === 'Cancelled' && updatedInvoice._original?.status !== 'REJECTED') {
      await claimsService.reject(invoiceId, {
        rejectionReason: updatedInvoice.notes || 'Rejected via invoice'
      });
    } else {
      // Regular update
      await claimsService.update(invoiceId, claimData);
    }

    // Fetch updated claim and transform
    const updatedClaim = await claimsService.getById(invoiceId);
    const transformedInvoice = transformClaimToInvoice(updatedClaim);

    // Update local state
    mutate(
      endpoints.key + endpoints.list,
      (currentInvoice) => {
        const newInvoice = currentInvoice.invoice.map((invoice) =>
          invoice.id === invoiceId ? transformedInvoice : invoice
        );
        return {
          ...currentInvoice,
          invoice: newInvoice
        };
      },
      false
    );

    return transformedInvoice;
  } catch (error) {
    console.error('[Invoice API] Failed to update claim:', error);
    throw error;
  }
}

export async function deleteInvoice(invoiceId) {
  try {
    // Delete claim from backend
    await claimsService.remove(invoiceId);

    // Update local state
    mutate(
      endpoints.key + endpoints.list,
      (currentInvoice) => {
        const newInvoice = currentInvoice.invoice.filter((invoice) => invoice.id !== invoiceId);
        return {
          ...currentInvoice,
          invoice: newInvoice
        };
      },
      false
    );
  } catch (error) {
    console.error('[Invoice API] Failed to delete claim:', error);
    throw error;
  }
}
      const nonDeletedInvoice = currentInvoice.invoice.filter((invoice) => invoice.id !== invoiceId);

      return {
        ...currentInvoice,
        invoice: nonDeletedInvoice
      };
    },
    false
  );

  // to hit server
  // you may need to refetch latest data after server hit and based on your logic
  //   const data = { invoiceId };
  //   await axios.post(endpoints.key + endpoints.delete, data);
}

export function useGetInvoiceMaster() {
  const { data, isLoading } = useSWR(endpoints.key + endpoints.actions, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      invoiceMaster: data,
      invoiceMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerCustomerTo(isCustomerOpen) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.actions,
    (currentInvoicemaster) => {
      return { ...currentInvoicemaster, isCustomerOpen };
    },
    false
  );
}

export function handlerCustomerFrom(open) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.actions,
    (currentInvoicemaster) => {
      return { ...currentInvoicemaster, open };
    },
    false
  );
}

export function selectCountry(country) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.actions,
    (currentInvoicemaster) => {
      return { ...currentInvoicemaster, country };
    },
    false
  );
}

export function handlerPreview(isOpen) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.actions,
    (currentInvoicemaster) => {
      return { ...currentInvoicemaster, isOpen };
    },
    false
  );
}

export function handlerDelete(alertPopup) {
  // to update local state based on key
  mutate(
    endpoints.key + endpoints.actions,
    (currentInvoicemaster) => {
      return { ...currentInvoicemaster, alertPopup };
    },
    false
  );
}
