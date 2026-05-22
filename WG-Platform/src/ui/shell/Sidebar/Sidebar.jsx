// src/ui/shell/Sidebar/Sidebar.jsx

import React from "react";
import PropTypes from "prop-types";

import { Box, Divider, List, Typography } from "@mui/material";

import SidebarSection from "./SidebarSection";
import SidebarCollapseButton from "./SidebarCollapseButton";
import { getAllRoutes } from "../../../routing";
/**
 * Sidebar
 *
 * Enterprise navigation sidebar.
 *
 * Responsibilities:
 * - Render grouped navigation sections
 * - Render navigation items
 * - Support collapsed mode
 * - Support role/permission filtered data
 * - Remain metadata-driven
 *
 * Important:
 * - No route hardcoding
 * - No permission logic inside rendering
 * - Consume already filtered navigation tree
 */
const Sidebar = ({
  navigation = [],
  collapsed = false,
  branding = {},
  onToggleCollapse,
  showCollapseButton = true,
}) => {   
  const { title, footer } = branding;
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 1 : 2,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {!collapsed && (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            {title || "Application"}
          </Typography>
        )}

        {showCollapseButton && (
          <SidebarCollapseButton
            collapsed={collapsed}
            onToggle={onToggleCollapse}
          />
        )}
      </Box>

      {/* Navigation Content */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1,
        }}
      >
        <List
          disablePadding
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {navigation.map((section) => (
            <SidebarSection
              key={section.group}
              section={section}
              collapsed={collapsed}
            />
          ))}
        </List>
      </Box>

      {/* Sidebar Footer */}
      <Divider />

      <Box
        sx={{
          px: 2,
          py: 1.5,
        }}
      >
        {!collapsed && (
          <Typography variant="caption" color="text.secondary">
           {footer || ""}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

Sidebar.propTypes = {
  navigation: PropTypes.array,

  collapsed: PropTypes.bool,

  title: PropTypes.string,

  onToggleCollapse: PropTypes.func,

  showCollapseButton: PropTypes.bool,
};

export default Sidebar;
