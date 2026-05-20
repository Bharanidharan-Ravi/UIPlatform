import { GLOBAL, SILENT, normalizeApiMode } from './apiModes.js';
import { apiStore } from './apiStore.js';
import { normalizeApiError } from './errorNormalizer.js';

let requestSequence = 0;

const createRequestId = () => {
  requestSequence += 1;
  return `wg-api-${Date.now()}-${requestSequence}`;
};

const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const resolveSuccessMessage = (successMessage, result, request) => {
  if (typeof successMessage === 'function') {
    try {
      return successMessage(result, request);
    } catch (_error) {
      return null;
    }
  }

  if (typeof successMessage === 'string') {
    return successMessage;
  }

  return null;
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
    successMessage: config.successMessage,
    startedAt: new Date().toISOString()
  };

  apiStore.getState().startRequest(request);
  return request;
}

export function trackRequestSuccess(request, result = {}) {
  if (!request) {
    return;
  }

  const store = apiStore.getState();
  store.markRequestSuccess(request.id, {
    statusCode: result.status,
    endedAt: new Date().toISOString()
  });

  if (request.mode !== GLOBAL) {
    return;
  }

  const message = resolveSuccessMessage(request.successMessage, result, request);

  if (!message) {
    return;
  }

  store.addGlobalSuccess({
    id: createMessageId(),
    message,
    status: result.status,
    data: result.data,
    method: request.method,
    url: request.url,
    mode: request.mode,
    timestamp: new Date().toISOString()
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
