const routes = new Map();
const subscribers = new Set();
let routeSnapshot = [];

function rebuildRouteSnapshot() {
  routeSnapshot = Array.from(routes.values());
}

function notifyRouteSubscribers() {
  rebuildRouteSnapshot();
  subscribers.forEach((listener) => {
    listener();
  });
}

function findNestedRoute(key, routeList) {
  for (const route of routeList) {
    if (route?.key === key) {
      return route;
    }

    if (Array.isArray(route?.children)) {
      const childRoute = findNestedRoute(key, route.children);
      if (childRoute) {
        return childRoute;
      }
    }
  }

  return undefined;
}

export function addRoute(route) {
  if (!route || !route.key || !route.path) {
    throw new Error('Route must have a key and a path');
  }
  routes.set(route.key, route);
  notifyRouteSubscribers();
  return route;
}

export function getRoute(key) {
  return routes.get(key) || findNestedRoute(key, routeSnapshot);
}

export function getAllRoutes() {
  return Array.from(routes.values());
}

export function removeRoute(key) {
  const removed = routes.delete(key);
  if (removed) {
    notifyRouteSubscribers();
  }
  return removed;
}

export function clearRoutes() {
  const hadRoutes = routes.size > 0;
  routes.clear();
  if (hadRoutes) {
    notifyRouteSubscribers();
  }
}

export function getRouteSnapshot() {
  return routeSnapshot;
}

export function subscribeRoutes(listener) {
  if (typeof listener !== 'function') {
    return () => {};
  }

  subscribers.add(listener);
  return () => {
    subscribers.delete(listener);
  };
}
