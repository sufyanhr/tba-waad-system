import axiosServices from 'utils/axios';

/**
 * Invoices Service
 * Handles all invoice-related API operations
 */

const BASE_URL = '/invoices';

class InvoicesService {
  /**
   * List all invoices with pagination
   * @param {Object} params - { page, size, search, sortBy, sortDir }
   * @returns {Promise}
   */
  async list(params = {}) {
    try {
      const response = await axiosServices.get(BASE_URL, { params });
      return {
        success: true,
        data: response.data?.data || {},
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch invoices',
        data: null
      };
    }
  }

  /**
   * Get invoice by ID
   * @param {number} id - Invoice ID
   * @returns {Promise}
   */
  async get(id) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch invoice',
        data: null
      };
    }
  }

  /**
   * Create new invoice
   * @param {Object} data - Invoice data
   * @returns {Promise}
   */
  async create(data) {
    try {
      const response = await axiosServices.post(BASE_URL, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Invoice created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to create invoice',
        data: null
      };
    }
  }

  /**
   * Update invoice
   * @param {number} id - Invoice ID
   * @param {Object} data - Updated invoice data
   * @returns {Promise}
   */
  async update(id, data) {
    try {
      const response = await axiosServices.put(`${BASE_URL}/${id}`, data);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Invoice updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update invoice',
        data: null
      };
    }
  }

  /**
   * Delete invoice
   * @param {number} id - Invoice ID
   * @returns {Promise}
   */
  async delete(id) {
    try {
      const response = await axiosServices.delete(`${BASE_URL}/${id}`);
      return {
        success: true,
        data: null,
        message: response.data?.message || 'Invoice deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to delete invoice',
        data: null
      };
    }
  }

  /**
   * Get invoices by status
   * @param {string} status - Invoice status (DRAFT, PENDING, PAID, OVERDUE, CANCELLED)
   * @returns {Promise}
   */
  async getByStatus(status) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/status/${status}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch invoices',
        data: []
      };
    }
  }

  /**
   * Get invoices by provider
   * @param {number} providerId - Provider ID
   * @returns {Promise}
   */
  async getByProvider(providerId) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/provider/${providerId}`);
      return {
        success: true,
        data: response.data?.data || [],
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch invoices',
        data: []
      };
    }
  }

  /**
   * Get invoice by number
   * @param {string} invoiceNumber - Invoice number
   * @returns {Promise}
   */
  async getByNumber(invoiceNumber) {
    try {
      const response = await axiosServices.get(`${BASE_URL}/number/${invoiceNumber}`);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch invoice',
        data: null
      };
    }
  }

  /**
   * Update invoice status
   * @param {number} id - Invoice ID
   * @param {string} status - New status
   * @returns {Promise}
   */
  async updateStatus(id, status) {
    try {
      const response = await axiosServices.patch(`${BASE_URL}/${id}/status`, { status });
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Invoice status updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to update invoice status',
        data: null
      };
    }
  }

  /**
   * Mark invoice as paid
   * @param {number} id - Invoice ID
   * @param {Object} paymentData - { paymentDate, paymentMethod, transactionRef }
   * @returns {Promise}
   */
  async markAsPaid(id, paymentData) {
    try {
      const response = await axiosServices.post(`${BASE_URL}/${id}/pay`, paymentData);
      return {
        success: true,
        data: response.data?.data || null,
        message: response.data?.message || 'Invoice marked as paid'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to mark invoice as paid',
        data: null
      };
    }
  }

  /**
   * Get total count of invoices
   * @returns {Promise}
   */
  async count() {
    try {
      const response = await axiosServices.get(`${BASE_URL}/count`);
      return {
        success: true,
        data: response.data?.data || 0,
        message: response.data?.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Failed to fetch count',
        data: 0
      };
    }
  }
}

export default new InvoicesService();
