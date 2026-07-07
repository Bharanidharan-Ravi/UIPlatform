// src/ui/shell/AppShellLayout.jsx

import React from "react";
import PropTypes from "prop-types";

import AppShell from "./AppShell";

/**
 * AppShellLayout
 *
 * Enterprise runtime layout wrapper.
 */

// const AppShellLayout = ({
//   children,
// }) => {
//   return (
//     <AppShell>
//       {children}
//     </AppShell>
//   );
// };

// AppShellLayout.propTypes = {
//   children: PropTypes.node,
// };

// export default AppShellLayout;

// ... existing code ...
const AppShellLayout = ({
  children,
  route,
}) => {
  return (
    <AppShell route={route}>
      {children}
    </AppShell>
  );
};

AppShellLayout.propTypes = {
  children: PropTypes.node,
  route: PropTypes.object,
};

export default AppShellLayout;