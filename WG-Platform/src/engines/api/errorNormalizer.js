export function normalizeApiError(error = {}, request = {}) {
  const status = error.status || error.response?.status;
  const data = error.data || error.response?.data;
  const message =
    data?.message ||
    data?.error ||
    error.message ||
    error.statusText ||
    'Request failed.';

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    message,
    status,
    data,
    method: request.method,
    url: request.url,
    mode: request.mode,
    timestamp: new Date().toISOString()
  };
}
