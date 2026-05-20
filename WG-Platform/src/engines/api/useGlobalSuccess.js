import { useApiState } from './useApiState.js';

export function useGlobalSuccess() {
  const successes = useApiState((state) => state.globalSuccesses);
  const lastSuccess = useApiState((state) => state.lastSuccess);
  const addGlobalSuccess = useApiState((state) => state.addGlobalSuccess);
  const dismissSuccess = useApiState((state) => state.dismissSuccess);
  const clearSuccesses = useApiState((state) => state.clearSuccesses);
  const showSuccess = (nextSuccess) => {
    const payload =
      typeof nextSuccess === 'string' ? { message: nextSuccess } : nextSuccess || {};

    addGlobalSuccess({
      id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: payload.timestamp || new Date().toISOString(),
      ...payload
    });
  };

  return {
    successes,
    hasSuccesses: successes.length > 0,
    lastSuccess,
    showSuccess,
    dismissSuccess,
    clearSuccesses
  };
}
