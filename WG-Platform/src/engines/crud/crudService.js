import { API, CRUD, platformLog } from '../../debug/index.js';

const trimSlashes = (value = '') => String(value).replace(/^\/+|\/+$/g, '');

const joinUrl = (...parts) => {
  const cleanParts = parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .map(String);
  const leadingSlash = cleanParts[0]?.startsWith('/') ? '/' : '';

  return (
    leadingSlash +
    cleanParts.map(trimSlashes).filter(Boolean).join('/')
  );
};

async function request(client, config) {
  platformLog(API, `${config.method || 'GET'} Request`, {
    url: config.url,
    params: config.params,
    data: config.data
  });

  if (typeof client === 'function') {
    return client(config);
  }

  if (client && typeof client.request === 'function') {
    return client.request(config);
  }

  throw new Error('A fetch function or HTTP client with request(config) is required.');
}

export function createCrudService({
  client,
  baseUrl = '',
  resource,
  endpoints = {},
  getId = (record) => record?.id
} = {}) {
  const resourcePath = endpoints.base || resource;

  if (!resourcePath) {
    throw new Error('createCrudService requires a resource or endpoints.base value.');
  }

  const urlFor = (suffix) => joinUrl(baseUrl, resourcePath, suffix);

  platformLog(CRUD, 'Service created', {
    resource: resourcePath,
    hasCustomEndpoints: Object.keys(endpoints).length > 0
  });

  return {
    list: (params) =>
      request(client, {
        method: 'GET',
        url: urlFor(endpoints.list),
        params
      }),
    get: (id, params) =>
      request(client, {
        method: 'GET',
        url: urlFor(endpoints.get ? endpoints.get(id) : id),
        params
      }),
    create: (data) =>
      request(client, {
        method: 'POST',
        url: urlFor(endpoints.create),
        data
      }),
    update: (data) => {
      const id = getId(data);

      return request(client, {
        method: 'PUT',
        url: urlFor(endpoints.update ? endpoints.update(id, data) : id),
        data
      });
    },
    remove: (recordOrId) => {
      const id =
        typeof recordOrId === 'object' ? getId(recordOrId) : recordOrId;

      return request(client, {
        method: 'DELETE',
        url: urlFor(endpoints.remove ? endpoints.remove(id, recordOrId) : id)
      });
    }
  };
}
