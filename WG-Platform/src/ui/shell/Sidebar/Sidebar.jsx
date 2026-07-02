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
  layoutOptions = {},
  onToggleCollapse,
  showCollapseButton = true,
}) => {   
  const { title, footer, logo: LogoComponent, logoClassName } = branding;
  console.log("layoutOptions test :", layoutOptions);
  
  return (
    <Box
      className={layoutOptions.sidebar?.className}
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...(!layoutOptions.sidebar?.className && {
          backgroundColor: "background.paper",
          color: "text.primary",
        }),
        ...layoutOptions.sidebar?.sx,
        ...layoutOptions.sidebarSx
      }}
    >
      {/* Sidebar Header */}
      <Box
        sx={{
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 1.5 : 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          gap: 1,
        }}
      >
        {collapsed ? (
          LogoComponent && (
            <Box 
              className={logoClassName}
              onClick={onToggleCollapse}
              sx={{ cursor: "pointer" }}
            >
              {React.isValidElement(LogoComponent) ? (
                LogoComponent
              ) : (
                <LogoComponent size={24} />
              )}
            </Box>
          )
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, overflow: "hidden" }}>
            {LogoComponent && (
              <Box className={logoClassName} sx={{ flexShrink: 0 }}>
                {React.isValidElement(LogoComponent) ? (
                  LogoComponent
                ) : (
                  <LogoComponent size={24} />
                )}
              </Box>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {title || "Application"}
            </Typography>
          </Box>
        )}

        {showCollapseButton && (!collapsed || !LogoComponent) && (
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
          px: collapsed ? 1.5 : 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 1,
        }}
      >
        {collapsed ? (
          (branding.footerLogo || LogoComponent) && (
            <Box 
              className={branding.footerLogoClassName || logoClassName}
              onClick={onToggleCollapse}
              sx={{ cursor: "pointer" }}
            >
              {React.isValidElement(branding.footerLogo || LogoComponent) ? (
                branding.footerLogo || LogoComponent
              ) : (
                React.createElement(branding.footerLogo || LogoComponent, { size: 24 })
              )}
            </Box>
          )
        ) : (
          <>
            {(branding.footerLogo || LogoComponent) && (
              <Box className={branding.footerLogoClassName || logoClassName} sx={{ flexShrink: 0 }}>
                {React.isValidElement(branding.footerLogo || LogoComponent) ? (
                  branding.footerLogo || LogoComponent
                ) : (
                  React.createElement(branding.footerLogo || LogoComponent, { size: 20 })
                )}
              </Box>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", overflow: "hidden" }}>
              {footer || ""}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

Sidebar.propTypes = {
  navigation: PropTypes.array,

  collapsed: PropTypes.bool,

  branding: PropTypes.object,

  layoutOptions: PropTypes.object,

  onToggleCollapse: PropTypes.func,

  showCollapseButton: PropTypes.bool,
};

export default Sidebar;
