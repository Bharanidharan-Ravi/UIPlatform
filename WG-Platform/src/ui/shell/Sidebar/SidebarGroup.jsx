// src/ui/shell/Sidebar/SidebarGroup.jsx

import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Typography,
} from "@mui/material";

import SidebarItem from "./SidebarItem";

/**
 * SidebarGroup
 *
 * Navigation group renderer.
 *
 * Responsibilities:
 * - Render grouped navigation items
 * - Render group label
 * - Support collapsed mode
 */
const SidebarGroup = ({
  group,
  collapsed = false,
}) => {
  return (
    <Box>
      {/* Group Title */}
      {!collapsed && group.group && (
        <Typography
          variant="caption"
          sx={{
            px: 3,
            py: 1,
            display: "block",
            fontWeight: 700,
            textTransform: "uppercase",
            color: "text.secondary",
          }}
        >
          {group.group}
        </Typography>
      )}

      {/* Group Items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        {group.items?.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </Box>
    </Box>
  );
};

SidebarGroup.propTypes = {
  group: PropTypes.shape({
    group: PropTypes.string,
    items: PropTypes.array,
  }),

  collapsed: PropTypes.bool,
};

export default SidebarGroup;