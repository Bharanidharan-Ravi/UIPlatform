import { useMemo } from 'react';
import { useApiClient } from '../../providers/ApiProvider.jsx';
import { createCrudService } from './crudService.js';
import { useCrud } from './useCrud.js';

export function useApiCrud({
  resource,
  endpoints,
  getId,
  service,
  queryKey,
  ...crudOptions
} = {}) {
  const client = useApiClient();

  const resolvedService = useMemo(
    () =>
      service ||
      createCrudService({
        client,
        resource,
        endpoints,
        getId
      }),
    [client, endpoints, getId, resource, service]
  );

  return useCrud({
    service: resolvedService,
    queryKey: queryKey || resource,
    ...crudOptions
  });
}
