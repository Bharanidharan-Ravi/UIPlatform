const features = new Map();

export function registerFeature(feature) {
  if (!feature || !feature.name) {
    throw new Error('Feature must have a name');
  }
  features.set(feature.name, feature);
  return feature;
}

export function unregisterFeature(name) {
  return features.delete(name);
}

export function getFeature(name) {
  return features.get(name);
}

export function getRegisteredFeatures() {
  return Array.from(features.values());
}

export function clearFeatures() {
  features.clear();
}
