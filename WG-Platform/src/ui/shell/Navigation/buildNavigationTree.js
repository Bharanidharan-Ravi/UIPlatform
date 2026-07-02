// src/ui/shell/Navigation/buildNavigationTree.js

/**
 * Builds sidebar navigation tree
 * from registered route metadata.
 */
export function buildNavigationTree(
  routes = []
) {
  const groups = {};

  routes.forEach((route) => {
    if (!route.sidebar) {
      return;
    }

    const {
      group = '',
    } = route.sidebar;

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push({
      ...route.sidebar,
      path: route.path,
    });
  });

  return Object.entries(groups).map(
    ([group, items]) => ({
      group,

      items: items.sort(
        (a, b) => a.order - b.order
      ),
    })
  );
}