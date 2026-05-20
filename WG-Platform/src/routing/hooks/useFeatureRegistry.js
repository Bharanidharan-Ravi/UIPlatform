import { useContext } from 'react';
import { RoutingContext } from '../providers/RoutingProvider.jsx';

export function useFeatureRegistry() {
  const ctx = useContext(RoutingContext);
  if (!ctx) {
    throw new Error('useFeatureRegistry must be used within a RoutingProvider');
  }

  return {
    registerFeature: ctx.registerFeature,
    unregisterFeature: ctx.unregisterFeature,
    getRegisteredFeatures: ctx.getRegisteredFeatures,
    getFeature: ctx.getFeature,
    clearFeatures: ctx.clearFeatures,
  };
}
