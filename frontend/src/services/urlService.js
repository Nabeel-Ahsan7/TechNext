import apiClient from './api';

export const urlService = {
  /**
   * Shorten a URL
   */
  async shortenUrl(originalUrl, title) {
    return await apiClient.post('/urls/shorten', {
      originalUrl,
      title
    });
  },

  /**
   * Get user's URLs for dashboard
   */
  async getUserUrls(params = {}) {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 10,
      sort: params.sort || 'createdAt',
      order: params.order || 'DESC'
    });
    
    return await apiClient.get(`/urls/dashboard?${queryParams}`);
  },

  /**
   * Delete a URL
   */
  async deleteUrl(urlId) {
    return await apiClient.delete(`/urls/${urlId}`);
  }
};