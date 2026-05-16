import { GLOBAL, SILENT, normalizeApiMode } from './apiModes.js';
import { apiStore } from './apiStore.js';
import { normalizeApiError } from './errorNormalizer.js';

let requestSequence = 0;

const createRequestId = () => {
  requestSequence += 1;
  return `wg-api-${Date.now()}-${requestSequence}`;
};

export function trackRequestStart(config = {}) {
  const mode = normalizeApiMode(config.mode);

  if (mode === SILENT) {
    return null;
  }

  const request = {
    id: createRequestId(),
    mode,
    method: String(config.method || 'GET').toUpperCase(),
    url: config.url || config.path,
    params: config.params,
    startedAt: new Date().toISOString()
  };

  apiStore.getState().startRequest(request);
  return request;
}

export function trackRequestSuccess(request, result = {}) {
  if (!request) {
    return;
  }

  apiStore.getState().markRequestSuccess(request.id, {
    statusCode: result.status,
    endedAt: new Date().toISOString()
  });
}

export function trackRequestError(request, error) {
  if (!request) {
    return normalizeApiError(error);
  }

  const normalizedError = normalizeApiError(error, request);
  const store = apiStore.getState();

  store.markRequestError(request.id, normalizedError);

  if (request.mode === GLOBAL) {
    store.addGlobalError(normalizedError);
  }

  return normalizedError;
}

export function trackRequestEnd(request) {
  if (!request) {
    return;
  }

  apiStore.getState().finishRequest(request.id);
}
