import { useApiState } from './useApiState.js';

export function useGlobalError() {
  const errors = useApiState((state) => state.globalErrors);
  const lastError = useApiState((state) => state.lastError);
  const dismissError = useApiState((state) => state.dismissError);
  const clearErrors = useApiState((state) => state.clearErrors);

  return {
    errors,
    hasErrors: errors.length > 0,
    lastError,
    dismissError,
    clearErrors
  };
}
