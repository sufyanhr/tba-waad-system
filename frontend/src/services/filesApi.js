import httpClient from 'api/httpClient';

// ==============================|| FILES API ||============================== //

const filesApi = {
  /**
   * Upload file
   * @param {File} file - File to upload
   * @param {object} options - Upload options (folder, type, etc.)
   * @returns {Promise<{url: string, filename: string, size: number}>}
   */
  upload: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Add optional metadata
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.type) {
        formData.append('type', options.type);
      }

      const response = await httpClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('File upload error:', error);
      throw error;
    }
  },

  /**
   * Upload multiple files
   * @param {FileList|Array} files - Files to upload
   * @param {object} options - Upload options
   * @returns {Promise<Array>}
   */
  uploadMultiple: async (files, options = {}) => {
    try {
      const formData = new FormData();
      
      // Append all files
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      // Add optional metadata
      if (options.folder) {
        formData.append('folder', options.folder);
      }

      const response = await httpClient.post('/files/upload/multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    } catch (error) {
      console.error('Multiple files upload error:', error);
      throw error;
    }
  },

  /**
   * Delete file
   * @param {string} filename - File name or ID
   * @returns {Promise<void>}
   */
  delete: async (filename) => {
    try {
      const response = await httpClient.delete(`/files/${filename}`);
      return response;
    } catch (error) {
      console.error('File delete error:', error);
      throw error;
    }
  },

  /**
   * Get file URL
   * @param {string} filename - File name or ID
   * @returns {string}
   */
  getFileUrl: (filename) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9092/api';
    return `${baseUrl}/files/${filename}`;
  },

  /**
   * Download file
   * @param {string} filename - File name or ID
   * @returns {Promise<Blob>}
   */
  download: async (filename) => {
    try {
      const response = await httpClient.get(`/files/${filename}/download`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error('File download error:', error);
      throw error;
    }
  }
};

export default filesApi;
