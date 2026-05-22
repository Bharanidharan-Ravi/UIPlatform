// src/ui/shell/AppShell.jsx

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

import { Sidebar} from "./Sidebar/index";
import Topbar from "./Topbar/Topbar";
import { getAllRoutes } from "../../routing";
import { buildNavigationTree } from "./Navigation/buildNavigationTree";

/**
 * AppShell
 *
 * Primary enterprise shell orchestrator.
 * Dictates layout composition but knows nothing about business logic.
 */
const AppShell = ({
  children,
  
  // Feature Flags (Driven by Route Config/Metadata)
  showSidebar = true,
  showTopbar = true,
  showFooter = false,
  
  // Custom Overrides (Full Control)
  customHeader = null,
  customFooter = null,

  // Topbar Slots (Used if customHeader is not provided)
  topbarLeft = null,
  topbarCenter = null,
  topbarRight = null,

  // Dimensions
  sidebarWidth = 280,
  collapsedSidebarWidth = 88,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // BUG FIX: active width is now correctly calculated as a number
  const activeSidebarWidth = collapsed ? collapsedSidebarWidth : sidebarWidth;

  // PERFORMANCE FIX: Only build the tree once, or when route registry changes
  const navigationTree = useMemo(() => {
    return buildNavigationTree(getAllRoutes());
  }, []);

  const handleToggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* 1. SIDEBAR AREA */}
      {showSidebar && (
        <Box
          component="nav"
          sx={{
            width: activeSidebarWidth,
            flexShrink: 0,
            transition: "width 0.2s ease-in-out",
            borderRight: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
            zIndex: 1200,
          }}
        >
          <Sidebar 
            navigation={navigationTree} 
            collapsed={collapsed} 
            onToggleCollapse={handleToggleCollapse} 
          />
        </Box>
      )}

      {/* 2. MAIN CONTENT STACK */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        
        {/* TOPBAR AREA */}
        {showTopbar && (
          // If a custom header is provided, use it entirely. Otherwise, use our 3-part Topbar.
          customHeader ? customHeader : (
            <Topbar 
              leftContent={topbarLeft}
              centerContent={topbarCenter}
              rightContent={topbarRight}
            />
          )
        )}

        {/* PAGE RENDER AREA (Scrollable) */}
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "background.default", // Uses theme background instead of hex
            p: 3, // Global page padding
          }}
        >
          {children}
        </Box>

        {/* FOOTER AREA */}
        {showFooter && (
          <Box
            component="footer"
            sx={{
              minHeight: 48,
              borderTop: "1px solid",
              borderColor: "divider",
              backgroundColor: "background.paper",
              display: "flex",
              alignItems: "center",
              px: 3,
            }}
          >
            {customFooter || "Default WG-Platform Footer"}
          </Box>
        )}

      </Box>
    </Box>
  );
};

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  showSidebar: PropTypes.bool,
  showTopbar: PropTypes.bool,
  showFooter: PropTypes.bool,
  customHeader: PropTypes.node,
  customFooter: PropTypes.node,
  topbarLeft: PropTypes.node,
  topbarCenter: PropTypes.node,
  topbarRight: PropTypes.node,
  sidebarWidth: PropTypes.number,
  collapsedSidebarWidth: PropTypes.number,
};

export default AppShell;