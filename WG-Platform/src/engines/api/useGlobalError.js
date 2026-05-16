import { useApiState } from './useApiState.js';

export function useGlobalError() {
  return useApiState((state) => ({
    errors: state.globalErrors,
    hasErrors: state.globalErrors.length > 0,
    lastError: state.lastError,
    dismissError: state.dismissError,
    clearErrors: state.clearErrors
  }));
}
