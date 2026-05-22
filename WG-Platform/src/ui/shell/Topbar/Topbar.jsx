// src/ui/shell/Topbar/Topbar.jsx

import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

/**
 * Topbar
 *
 * Enterprise header component featuring a 3-slot architecture.
 *
 * Responsibilities:
 * - Render left (branding/sidebar toggle), center (search/context), right (profile/actions)
 * - Maintain responsive flex constraints
 */
const Topbar = ({
  leftContent,
  centerContent,
  rightContent,
  height = 64,
}) => {
  return (
    <Box
      component="header"
      sx={{
        height,
        minHeight: height,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        zIndex: 1100, // Stay above page content
      }}
    >
      {/* Left Area: Sidebar Toggles, Breadcrumbs, etc. */}
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        {leftContent}
      </Box>

      {/* Center Area: Global Search, App Switcher, Context Titles */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 2 }}>
        {centerContent}
      </Box>

      {/* Right Area: User Profile, Notifications, Settings */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", flex: 1, gap: 1 }}>
        {rightContent}
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  leftContent: PropTypes.node,
  centerContent: PropTypes.node,
  rightContent: PropTypes.node,
  height: PropTypes.number,
};

export default Topbar;