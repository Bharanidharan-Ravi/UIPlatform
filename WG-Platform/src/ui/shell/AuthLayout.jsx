// src/ui/shell/AuthLayout.jsx

import React from "react";
import PropTypes from "prop-types";

import { Box } from "@mui/material";

/**
 * AuthLayout
 *
 * Minimal full-screen authentication layout.
 *
 * Responsibilities:
 * - Render auth pages only
 * - Avoid enterprise shell rendering
 * - Preserve full viewport layout
 */
const AuthLayout = ({
  children,
  backgroundColor = "#f4f6f8",
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor,
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node,
  backgroundColor: PropTypes.string,
};

export default AuthLayout;