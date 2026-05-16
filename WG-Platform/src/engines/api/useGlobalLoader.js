import { useApiState } from './useApiState.js';

export function useGlobalLoader() {
  return useApiState((state) => ({
    loading: state.globalLoading,
    loadingCount: state.loadingCount
  }));
}
