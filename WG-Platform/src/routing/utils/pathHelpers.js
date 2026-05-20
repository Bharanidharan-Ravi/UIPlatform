import { getRoute } from '../registry/routeRegistry.js';

export function normalizePath(path) {
  if (!path) return '/';
  const s = String(path);
  return s.startsWith('/') ? s : `/${s}`;
}

export function buildPath(template, params = {}) {
  let path = String(template || '');

  Object.keys(params || {}).forEach((key) => {
    const value = params[key];
    path = path.replace(new RegExp(`:${key}\\??`, 'g'), encodeURIComponent(String(value)));
  });

  // remove any remaining optional params like :id?
  path = path.replace(/:([a-zA-Z0-9_]+)\?/g, '');
  return path;
}

export function matchRouteKey(key) {
  return !!getRoute(key);
}
