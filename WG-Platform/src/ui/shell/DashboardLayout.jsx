// src/ui/shell/DashboardLayout.jsx

import React from "react";
import PropTypes from "prop-types";

import { Box } from "@mui/material";

import AppShell from "./AppShell";

/**
 * DashboardLayout
 *
 * Specialized layout wrapper for:
 * - dashboards
 * - analytics pages
 * - reporting pages
 * - overview screens
 *
 * This layout internally reuses AppShell
 * while providing dashboard-oriented spacing
 * and content structure.
 */
const DashboardLayout = ({
  children,
  maxWidth = "1600px",
}) => {
  return (
    <AppShell>
      <Box
        sx={{
          width: "100%",
          maxWidth,
          mx: "auto",
        }}
      >
        {children}
      </Box>
    </AppShell>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
  maxWidth: PropTypes.string,
};

export default DashboardLayout;