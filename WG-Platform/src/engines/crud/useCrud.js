import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CRUD, platformLog } from '../../debug/index.js';

export function useCrud({
  service,
  queryKey,
  listParams,
  enabled = true,
  listOptions = {},
  mutationOptions = {}
} = {}) {
  if (!service) {
    throw new Error('useCrud requires a service created by createCrudService.');
  }

  const client = useQueryClient();
  const baseKey = Array.isArray(queryKey) ? queryKey : [queryKey || 'crud'];
  const invalidate = () => client.invalidateQueries({ queryKey: baseKey });

  const listQuery = useQuery({
    queryKey: [...baseKey, 'list', listParams],
    queryFn: () => {
      platformLog(CRUD, 'List query', {
        queryKey: baseKey,
        listParams
      });

      return service.list(listParams);
    },
    enabled,
    ...listOptions
  });

  const createMutation = useMutation({
    mutationFn: service.create,
    onSuccess: (...args) => {
      platformLog(CRUD, 'Create mutation success', { queryKey: baseKey });
      invalidate();
      mutationOptions.onCreateSuccess?.(...args);
      mutationOptions.onSuccess?.(...args);
    }
  });

  const updateMutation = useMutation({
    mutationFn: service.update,
    onSuccess: (...args) => {
      platformLog(CRUD, 'Update mutation success', { queryKey: baseKey });
      invalidate();
      mutationOptions.onUpdateSuccess?.(...args);
      mutationOptions.onSuccess?.(...args);
    }
  });

  const removeMutation = useMutation({
    mutationFn: service.remove,
    onSuccess: (...args) => {
      platformLog(CRUD, 'Remove mutation success', { queryKey: baseKey });
      invalidate();
      mutationOptions.onRemoveSuccess?.(...args);
      mutationOptions.onSuccess?.(...args);
    }
  });

  return {
    listQuery,
    createMutation,
    updateMutation,
    removeMutation,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    remove: removeMutation.mutate
  };
}
