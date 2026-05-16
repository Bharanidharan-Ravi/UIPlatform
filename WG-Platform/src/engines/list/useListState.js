import { useEffect, useRef } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

export const defaultListState = Object.freeze({
  page: 0,
  pageSize: 25,
  sort: [],
  filters: {},
  search: ''
});

export function createListStore(initialState = {}) {
  const initial = {
    ...defaultListState,
    ...initialState,
    filters: {
      ...defaultListState.filters,
      ...(initialState.filters || {})
    }
  };

  return createStore((set, get) => ({
    state: initial,
    setState: (patch) => {
      set(({ state }) => ({
        state: {
          ...state,
          ...(typeof patch === 'function' ? patch(state) : patch)
        }
      }));
    },
    setPage: (page) => {
      get().setState({ page });
    },
    setPageSize: (pageSize) => {
      get().setState({ pageSize, page: 0 });
    },
    setSearch: (search) => {
      get().setState({ search, page: 0 });
    },
    setSort: (sort) => {
      get().setState({ sort: Array.isArray(sort) ? sort : [sort], page: 0 });
    },
    setFilter: (name, value) => {
      get().setState((state) => ({
        filters: {
          ...state.filters,
          [name]: value
        },
        page: 0
      }));
    },
    clearFilters: () => {
      get().setState({ filters: {}, page: 0 });
    },
    reset: (nextState = initial) => {
      set({ state: { ...defaultListState, ...nextState } });
    }
  }));
}

export function useListState({ initialState, onChange } = {}) {
  const storeRef = useRef(null);

  if (!storeRef.current) {
    storeRef.current = createListStore(initialState);
  }

  const listApi = useStore(storeRef.current, (store) => store);

  useEffect(() => {
    onChange?.(listApi.state);
  }, [listApi.state, onChange]);

  return {
    ...listApi,
    store: storeRef.current
  };
}
