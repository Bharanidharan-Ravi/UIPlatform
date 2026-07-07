import React, { createContext, useContext } from 'react';

export const AccessContext = createContext(null);

export function useAccess() {
  const context = useContext(AccessContext);
  return context || { isAuthenticated: false, roles: [], permissions: [], user: null };
}
