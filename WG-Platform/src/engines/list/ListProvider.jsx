import { createContext, useContext } from 'react';
import { useListState } from './useListState.js';

const ListContext = createContext(null);

export function ListProvider({ children, initialState, onChange, value }) {
  const listState = useListState({ initialState, onChange });

  return (
    <ListContext.Provider value={value || listState}>
      {children}
    </ListContext.Provider>
  );
}

export function useListContext() {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useListContext must be used within a ListProvider.');
  }

  return context;
}
