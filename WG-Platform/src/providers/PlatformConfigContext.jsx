import React, { createContext, useContext } from 'react';

export const PlatformConfigContext = createContext({
  layoutOptions: {}
});

export function usePlatformConfig() {
  return useContext(PlatformConfigContext);
}
