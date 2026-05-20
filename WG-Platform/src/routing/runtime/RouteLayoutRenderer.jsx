import React from 'react';

function resolveLayoutComponent(layout, layouts = {}) {
  if (!layout) return null;

  if (typeof layout === 'string') {
    return layouts[layout] || null;
  }

  if (React.isValidElement(layout) || typeof layout === 'function') {
    return layout;
  }

  if (layout && typeof layout.component === 'function') {
    return layout.component;
  }

  return null;
}

export function RouteLayoutRenderer({
  children,
  route,
  layouts,
  defaultLayout
}) {
  if (route?.layout === false) {
    return children;
  }

  const layoutDefinition =
    route?.layout !== undefined && route?.layout !== null
      ? route.layout
      : defaultLayout;
  const Layout = resolveLayoutComponent(layoutDefinition, layouts);

  if (!Layout) {
    return children;
  }

  if (React.isValidElement(Layout)) {
    return React.cloneElement(Layout, { route }, children);
  }

  return <Layout route={route}>{children}</Layout>;
}
