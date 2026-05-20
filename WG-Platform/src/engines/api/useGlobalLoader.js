import { useApiState } from './useApiState.js';

export function useGlobalLoader() {
  const loading = useApiState((state) => state.globalLoading);
  const loadingCount = useApiState((state) => state.loadingCount);

  return {
    loading,
    loadingCount
  };
}
