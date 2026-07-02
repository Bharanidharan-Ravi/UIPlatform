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
          
          ...(!layoutOptions.sidebar?.itemClassName && {
            color: "text.primary",
          }),

          "&.active": {
            ...(!layoutOptions.sidebar?.activeItemClassName && {
              backgroundColor: alpha(theme.palette.primary.main, 0.12),
              color: "primary.main",
              "& .MuiListItemIcon-root": {
                color: "primary.main",
              },
            })
          },
          ...layoutOptions.sidebar?.itemSx,
          ...layoutOptions.sidebarItemSx,
        }}
        className={({ isActive }) => {
          let classes = layoutOptions.sidebar?.itemClassName || "";
          if (isActive) {
            classes += ` active ${layoutOptions.sidebar?.activeItemClassName || ""}`;
          }
          return classes.trim();
        }}
      >
        {/* Navigation Icon */}
        {IconComponent && (
          <ListItemIcon
            sx={{
              minWidth: collapsed ? 0 : 40,
              justifyContent: "center",
              color: "inherit",
            }}
          >
            {React.isValidElement(IconComponent) ? (
              IconComponent
            ) : typeof IconComponent === "function" || (typeof IconComponent === "object" && IconComponent.$$typeof) ? (
              <IconComponent size={20} fontSize="small" />
            ) : null}
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