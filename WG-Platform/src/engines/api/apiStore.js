import { createStore } from 'zustand/vanilla';
import { GLOBAL } from './apiModes.js';

const initialState = {
  loadingCount: 0,
  globalLoading: false,
  globalErrors: [],
  globalSuccesses: [],
  activeRequests: [],
  lastError: null,
  lastSuccess: null
};

export const apiStore = createStore((set) => ({
  ...initialState,
  startRequest: (request) => {
    set((state) => {
      const isGlobal = request.mode === GLOBAL;
      const loadingCount = isGlobal
        ? state.loadingCount + 1
        : state.loadingCount;

      return {
        activeRequests: [
          ...state.activeRequests,
          {
            ...request,
            status: 'pending'
          }
        ],
        loadingCount,
        globalLoading: loadingCount > 0
      };
    });
  },
  markRequestSuccess: (requestId, patch = {}) => {
    set((state) => ({
      activeRequests: state.activeRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              ...patch,
              status: 'success'
            }
          : request
      )
    }));
  },
  markRequestError: (requestId, error) => {
    set((state) => ({
      activeRequests: state.activeRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              error,
              status: 'error'
            }
          : request
      ),
      lastError: error
    }));
  },
  finishRequest: (requestId) => {
    set((state) => {
      const request = state.activeRequests.find((item) => item.id === requestId);
      const loadingCount =
        request?.mode === GLOBAL
          ? Math.max(0, state.loadingCount - 1)
          : state.loadingCount;

      return {
        activeRequests: state.activeRequests.filter(
          (item) => item.id !== requestId
        ),
        loadingCount,
        globalLoading: loadingCount > 0
      };
    });
  },
  addGlobalError: (error) => {
    set((state) => ({
      globalErrors: [...state.globalErrors, error],
      lastError: error
    }));
  },
  addGlobalSuccess: (success) => {
    set((state) => ({
      globalSuccesses: [...state.globalSuccesses, success],
      lastSuccess: success
    }));
  },
  dismissError: (errorId) => {
    set((state) => ({
      globalErrors: state.globalErrors.filter((error) => error.id !== errorId)
    }));
  },
  dismissSuccess: (successId) => {
    set((state) => ({
      globalSuccesses: state.globalSuccesses.filter(
        (success) => success.id !== successId
      )
    }));
  },
  clearErrors: () => {
    set({ globalErrors: [], lastError: null });
  },
  clearSuccesses: () => {
    set({ globalSuccesses: [], lastSuccess: null });
  },
  reset: () => {
    set(initialState);
  }
}));
