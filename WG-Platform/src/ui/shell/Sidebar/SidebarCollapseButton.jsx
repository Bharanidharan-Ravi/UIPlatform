// src/ui/shell/Sidebar/SidebarCollapseButton.jsx

import React from "react";
import PropTypes from "prop-types";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

/**
 * SidebarCollapseButton
 *
 * Sidebar collapse toggle button.
 *
 * Responsibilities:
 * - Toggle sidebar collapse state
 * - Remain reusable and lightweight
 *
 * Important:
 * - Intentionally icon-agnostic
 * - Parent controls actual state
 */
const SidebarCollapseButton = ({
  collapsed = false,
  onToggle,
  children,
}) => {
  return (
    <Tooltip
      title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
    >
      <IconButton
        size="small"
        onClick={onToggle}
      >
        {children || "||"}
      </IconButton>
    </Tooltip>
  );
};

SidebarCollapseButton.propTypes = {
  collapsed: PropTypes.bool,

  onToggle: PropTypes.func,

  children: PropTypes.node,
};

export default SidebarCollapseButton;