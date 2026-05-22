// src/ui/shell/Sidebar/SidebarSection.jsx

import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Divider,
} from "@mui/material";

import SidebarGroup from "./SidebarGroup";

/**
 * SidebarSection
 *
 * High-level sidebar section container.
 *
 * Responsibilities:
 * - Provide spacing separation
 * - Render grouped navigation
 * - Keep sidebar rendering modular
 */
const SidebarSection = ({
  section,
  collapsed = false,
}) => {
  return (
    <Box>
      <SidebarGroup
        group={section}
        collapsed={collapsed}
      />

      <Divider
        sx={{
          mt: 1.5,
        }}
      />
    </Box>
  );
};

SidebarSection.propTypes = {
  section: PropTypes.object,

  collapsed: PropTypes.bool,
};

export default SidebarSection;