// ==============================|| TBA AXIOS CLIENT - USE MAIN HTTP CLIENT ||============================== //

// Re-export the main httpClient for backward compatibility
// This ensures existing TBA pages continue to work while using the centralized client
import httpClient from 'api/httpClient';

export default httpClient;
