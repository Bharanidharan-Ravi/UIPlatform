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
      label,
      order = 0,
      group,
    } = route.sidebar;

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push({
      label,
      path: route.path,
      order,
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