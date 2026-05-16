import {
  trackRequestEnd,
  trackRequestError,
  trackRequestStart,
  trackRequestSuccess
} from '../api/requestTracker.js';
import { buildQuery } from '../query/buildQuery.js';

const jsonContentTypes = ['application/json', 'application/problem+json'];

const trimSlashes = (value = '') => String(value).replace(/^\/+|\/+$/g, '');

const isAbsoluteUrl = (value = '') => /^https?:\/\//i.test(value);

const hasHeader = (headers = {}, name) =>
  Object.keys(headers).some((key) => key.toLowerCase() === name.toLowerCase());

const isBodySupported = (method) => !['GET', 'HEAD'].includes(method);

const isFormData = (value) =>
  typeof FormData !== 'undefined' && value instanceof FormData;

const isBlob = (value) => typeof Blob !== 'undefined' && value instanceof Blob;

function joinUrl(baseUrl = '', path = '') {
  if (!baseUrl || isAbsoluteUrl(path)) {
    return path;
  }

  return [baseUrl, path].map(trimSlashes).filter(Boolean).join('/');
}

function appendQuery(url, params) {
  const query = buildQuery(params);

  if (!query) {
    return url;
  }

  return `${url}${url.includes('?') ? '&' : '?'}${query}`;
}

async function parseResponse(response, responseType = 'json') {
  if (response.status === 204) {
    return null;
  }

  if (responseType === 'raw') {
    return response;
  }

  if (responseType === 'text') {
    return response.text();
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  const contentType = response.headers.get('content-type') || '';
  const shouldParseJson =
    responseType === 'json' ||
    jsonContentTypes.some((type) => contentType.includes(type));

  if (!shouldParseJson) {
    return response.text();
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function createApiClient({
  baseUrl = '',
  headers = {},
  getHeaders,
  fetcher = globalThis.fetch?.bind(globalThis),
  credentials,
  responseType = 'json',
  returnResponse = false,
  throwOnHttpError = true,
  onRequest,
  onResponse,
  onError
} = {}) {
  if (typeof fetcher !== 'function') {
    throw new Error('createApiClient requires a fetch-compatible function.');
  }

  async function request(config = {}) {
    const method = String(config.method || 'GET').toUpperCase();
    const url = appendQuery(joinUrl(baseUrl, config.url || config.path), config.params);
    const dynamicHeaders =
      typeof getHeaders === 'function' ? await getHeaders(config) : {};
    const requestHeaders = {
      Accept: 'application/json',
      ...headers,
      ...dynamicHeaders,
      ...(config.headers || {})
    };

    const requestOptions = {
      ...config.fetchOptions,
      method,
      headers: requestHeaders,
      signal: config.signal,
      credentials: config.credentials || credentials
    };

    if (config.data !== undefined && isBodySupported(method)) {
      if (!isFormData(config.data) && !isBlob(config.data)) {
        if (!hasHeader(requestHeaders, 'content-type')) {
          requestHeaders['Content-Type'] = 'application/json';
        }

        requestOptions.body = JSON.stringify(config.data);
      } else {
        requestOptions.body = config.data;
      }
    }

    const nextRequest =
      (await onRequest?.({ url, options: requestOptions, config })) || {
        url,
        options: requestOptions
      };

    let trackedRequest;

    try {
      trackedRequest = trackRequestStart({
        ...config,
        method,
        url: nextRequest.url
      });

      const response = await fetcher(nextRequest.url, nextRequest.options);
      const data = await parseResponse(response, config.responseType || responseType);
      const result = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        response,
        config
      };

      await onResponse?.(result);

      if (!response.ok && throwOnHttpError) {
        const error = new Error(response.statusText || 'Request failed.');
        error.status = response.status;
        error.data = data;
        error.response = response;
        error.config = config;
        throw error;
      }

      trackRequestSuccess(trackedRequest, result);

      return returnResponse ? result : data;
    } catch (error) {
      trackRequestError(trackedRequest, error);
      await onError?.(error, config);
      throw error;
    } finally {
      trackRequestEnd(trackedRequest);
    }
  }

  return {
    baseUrl,
    request,
    get: (url, config = {}) => request({ ...config, method: 'GET', url }),
    post: (url, data, config = {}) =>
      request({ ...config, method: 'POST', url, data }),
    put: (url, data, config = {}) =>
      request({ ...config, method: 'PUT', url, data }),
    patch: (url, data, config = {}) =>
      request({ ...config, method: 'PATCH', url, data }),
    delete: (url, config = {}) => request({ ...config, method: 'DELETE', url })
  };
}
