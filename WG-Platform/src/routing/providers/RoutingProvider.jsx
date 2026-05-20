import React, { createContext, useMemo } from 'react';
import * as featureRegistry from '../registry/featureRegistry.js';
import * as routeRegistry from '../registry/routeRegistry.js';

export const RoutingContext = createContext(null);

export function RoutingProvider({ children }) {
  const ctx = useMemo(() => ({
    registerFeature: featureRegistry.registerFeature,
    unregisterFeature: featureRegistry.unregisterFeature,
    getRegisteredFeatures: featureRegistry.getRegisteredFeatures,
    getFeature: featureRegistry.getFeature,
    clearFeatures: featureRegistry.clearFeatures,
    addRoute: routeRegistry.addRoute,
    getRoute: routeRegistry.getRoute,
    getAllRoutes: routeRegistry.getAllRoutes,
    removeRoute: routeRegistry.removeRoute,
    clearRoutes: routeRegistry.clearRoutes,
  }), []);

  return <RoutingContext.Provider value={ctx}>{children}</RoutingContext.Provider>;
}
