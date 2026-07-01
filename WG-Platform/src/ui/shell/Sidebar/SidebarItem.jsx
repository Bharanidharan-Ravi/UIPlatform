// src/ui/shell/Sidebar/SidebarItem.jsx

import React from "react";
import PropTypes from "prop-types";

import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";

import { NavLink } from "react-router-dom";
import { usePlatformConfig } from "../../../providers/PlatformConfigContext.jsx";

/**
 * SidebarItem
 *
 * Single navigation item renderer.
 *
 * Responsibilities:
 * - Render navigation item
 * - Handle active route styling
 * - Support collapsed mode
 * - Support optional icon rendering
 */
const SidebarItem = ({
  item,
  collapsed = false,
}) => {
  const {
    label,
    path,
    icon: IconComponent,
  } = item;

  const theme = useTheme();
  const { layoutOptions = {} } = usePlatformConfig();

  return (
    <Tooltip
      title={collapsed ? label : ""}
      placement="right"
    >
      <ListItemButton
        component={NavLink}
        to={path}
        sx={{
          mx: 1,
          borderRadius: 2,
          minHeight: 44,
          px: collapsed ? 1.5 : 2,
          justifyContent: collapsed
            ? "center"
            : "flex-start",
          color: "text.primary",

          "&.active": {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            fontWeight: 600,
            "& .MuiListItemIcon-root": {
              color: "primary.main",
            },
          },
          ...layoutOptions.sidebarItemSx,
        }}
      >
        {/* Navigation Icon */}
        {IconComponent && (
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 40,
              justifyContent: "center",
            }}
          >
            <IconComponent fontSize="small" />
          </ListItemIcon>
        )}

        {/* Navigation Label */}
        {!collapsed && (
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 500,
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
};

SidebarItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.elementType,
  }),

  collapsed: PropTypes.bool,
};

export default SidebarItem;