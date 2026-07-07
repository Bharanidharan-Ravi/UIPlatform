// src/ui/shell/Header/Header.jsx

import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useAccess } from "../../../routing/runtime/AccessContext.jsx";
import { PlatformConfigContext } from "../../../providers/PlatformConfigContext.jsx";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const access = useAccess();
  const { layoutOptions = {} } = useContext(PlatformConfigContext) || {};

  const headerConfig = layoutOptions.header || {};
  const branding = layoutOptions.branding || {};

  // Global styles with fallbacks
  const globalSize = headerConfig.size || "medium";
  const globalColor = headerConfig.color || "#1e293b";
  const globalActiveColor = headerConfig.activeColor || "#1d2274";
  const globalActiveBg = headerConfig.activeBg || "#eef2ff";
  const globalFontSize = headerConfig.fontSize || "14px";
  const globalHover = headerConfig.hover || { backgroundColor: "#f1f5f9" };
  const globalHeight = headerConfig.height || 70;

  // State for Admin / Navigation Dropdowns
  const [dropdownAnchor, setDropdownAnchor] = useState(null);
  const [activeDropdownKey, setActiveDropdownKey] = useState(null);

  // State for User Profile Dropdown
  const [profileAnchor, setProfileAnchor] = useState(null);

  // 1. Process and filter menu items based on role
  const rawItems = headerConfig.items || {};
  const menuItems = Object.entries(rawItems)
    .map(([key, item]) => ({ key, ...item }))
    .filter((item) => {
      if (!item.roles) return true;
      if (!access || !access.roles) return false;
      return item.roles.some((role) => access.roles.includes(role));
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // 2. Process right-side actions filtered by role
  const rawActions = headerConfig.actions || [];
  const actionButtons = rawActions.filter((action) => {
    if (!action.roles) return true;
    if (!access || !access.roles) return false;
    return action.roles.some((role) => access.roles.includes(role));
  });

  const handleDropdownOpen = (event, key) => {
    setDropdownAnchor(event.currentTarget);
    setActiveDropdownKey(key);
  };

  const handleDropdownClose = () => {
    setDropdownAnchor(null);
    setActiveDropdownKey(null);
  };

  const handleProfileOpen = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    if (typeof layoutOptions.onLogout === "function") {
      layoutOptions.onLogout();
    } else if (typeof access.onLogout === "function") {
      access.onLogout();
    } else {
      // Default fallback
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("session");
      navigate("/login");
    }
  };

  // Helper to render icons dynamically
  const renderIcon = (IconComponent, props = {}) => {
    if (!IconComponent) return null;
    if (React.isValidElement(IconComponent)) {
      return IconComponent;
    }
    if (typeof IconComponent === "function" || typeof IconComponent === "object") {
      return <IconComponent {...props} />;
    }
    return null;
  };

  // Check active state
  const isItemActive = (item) => {
    if (item.routingPath && location.pathname === item.routingPath) {
      return true;
    }
    if (item.dropdown === "yes" && Array.isArray(item.dropdownValues)) {
      return item.dropdownValues.some((val) => location.pathname === val.routingPath);
    }
    return false;
  };

  const activeDropdownItem = menuItems.find((item) => item.key === activeDropdownKey);

  // Logo rendering
  const Logo = branding.logo;
  const logoClassName = branding.logoClassName || "";

  return (
    <Box
      component="header"
      sx={{
        height: globalHeight,
        minHeight: globalHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2, // Reduced from 3 to gain horizontal space
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.05)",
        zIndex: 1300,
        position: "relative",
      }}
    >
      {/* LEFT: Branding/Logo */}
      <Box
        onClick={() => navigate(headerConfig.logoRoutingPath || "/dashboard")}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        {Logo && (
          <Box className={logoClassName} sx={{ display: "flex", alignItems: "center" }}>
            {renderIcon(Logo, { size: 28 })}
          </Box>
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "text.primary",
            display: "flex",
            alignItems: "center",
            fontFamily: "'Outfit', 'Inter', sans-serif",
          }}
        >
          {branding.title || "PLATFORM"}
        </Typography>
      </Box>

      {/* CENTER/LEFT: Dynamic Navigation Links */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5, // Reduced gap between items to fit better
          flex: 1,
          justifyContent: headerConfig.alignment === "center" ? "center" : "flex-start",
          ml: 2, // Reduced margin from logo
        }}
      >
        {menuItems.map((item) => {
          const isActive = isItemActive(item);
          const hasDropdown = item.dropdown === "yes";

          // Compute styling hierarchy (Local overrides Global)
          const fontSize = item.fontSize || globalFontSize;
          const textColor = isActive
            ? globalActiveColor
            : item.color || globalColor;
          const bgStyle = isActive ? globalActiveBg : "transparent";

          const buttonStyles = {
            fontSize,
            color: textColor,
            backgroundColor: bgStyle,
            borderRadius: "100px",
            px: 1.25, // Reduced padding
            py: 0.4,
            textTransform: "none",
            fontWeight: isActive ? 600 : 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            transition: "all 0.2s ease-in-out",
            "&:hover": item.hover || globalHover,
            minHeight: "28px",
            whiteSpace: "nowrap", // Prevent internal wrapping
          };

          if (hasDropdown) {
            const isAdmin = item.key === "admin";
            const dropdownButtonStyles = isAdmin ? {
              fontSize: "12px",
              color: "#111827",
              backgroundColor: "transparent",
              border: "1.5px solid #111827",
              borderRadius: "100px",
              px: 1.25,
              py: 0.3,
              textTransform: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
              minHeight: "28px",
              whiteSpace: "nowrap",
            } : buttonStyles;

            return (
              <Button
                key={item.key}
                onClick={(e) => handleDropdownOpen(e, item.key)}
                sx={dropdownButtonStyles}
              >
                {renderIcon(item.icon, { size: 14 })}
                <span style={{ marginLeft: "4px", marginRight: "4px" }}>{item.label}</span>
                <ChevronDown size={14} />
              </Button>
            );
          }

          return (
            <Button
              key={item.key}
              component={Link}
              to={item.routingPath || "#"}
              sx={buttonStyles}
            >
              {renderIcon(item.icon, { size: 16 })}
              {item.label}
              {item.badge !== undefined && item.badge !== null && (
                <Box
                  sx={{
                    ml: 0.5,
                    px: 0.75,
                    py: 0.1,
                    backgroundColor: "error.main",
                    color: "error.contrastText",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </Button>
          );
        })}

        {/* Dropdown Menu for Admin or nested navigation */}
        {activeDropdownItem && (
          <Menu
            anchorEl={dropdownAnchor}
            open={Boolean(dropdownAnchor)}
            onClose={handleDropdownClose}
            sx={{
              mt: 1.5,
              "& .MuiPaper-root": {
                borderRadius: "12px",
                minWidth: 180,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                border: "1px solid",
                borderColor: "divider",
              },
            }}
          >
            {activeDropdownItem.dropdownValues
              ?.filter((opt) => {
                if (!opt.roles) return true;
                if (!access || !access.roles) return false;
                return opt.roles.some((role) => access.roles.includes(role));
              })
              .map((option) => (
                <MenuItem
                  key={option.label}
                  onClick={() => {
                    handleDropdownClose();
                    navigate(option.routingPath);
                  }}
                  sx={{
                    fontSize: "13px",
                    fontWeight: 500,
                    py: 1,
                    px: 2,
                    color: "text.primary",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  {option.icon && (
                    <Box sx={{ display: "flex", color: "text.secondary" }}>
                      {renderIcon(option.icon, { size: 15 })}
                    </Box>
                  )}
                  {option.label}
                </MenuItem>
              ))}
          </Menu>
        )}
      </Box>

      {/* RIGHT: Actions & User Profile */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
        {/* Dynamic Action Buttons (e.g. + New Project) */}
        {actionButtons.map((action, idx) => (
          <Button
            key={idx}
            variant={action.variant || "contained"}
            color={action.color || "primary"}
            onClick={() => navigate(action.routingPath)}
            sx={{
              borderRadius: "100px",
              px: 1.75, // Reduced padding
              py: 0.4,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "12px", // Compact font size
              boxShadow: "none",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              whiteSpace: "nowrap",
              minHeight: "28px",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {renderIcon(action.icon, { size: 15 })}
            {action.label}
          </Button>
        ))}

        {/* User Profile Capsule */}
        {access.isAuthenticated && (
          <>
            <Box
              onClick={handleProfileOpen}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                backgroundColor: "#f3f4f6",
                borderRadius: "100px",
                p: "4px 8px 4px 12px",
                cursor: "pointer",
                userSelect: "none",
                transition: "background-color 0.2s ease-in-out",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
              }}
            >
              {/* Profile Avatar Emojis */}
              <Box sx={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
                {access.roles?.includes("leadership") ? "👑" : "👨‍💻"}
              </Box>

              {/* User details stacked vertically for tight horizontal space */}
              <Box sx={{ display: "flex", flexDirection: "column", pr: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: "11px",
                    fontWeight: 700,
                    lineHeight: 1.1,
                    color: "text.primary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {access.user?.name || "Username"}
                </Typography>
                {access.user?.subtitle && (
                  <Typography
                    sx={{
                      fontSize: "9px",
                      fontWeight: 500,
                      lineHeight: 1,
                      color: "text.secondary",
                      mt: 0.2,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {access.user.subtitle}
                  </Typography>
                )}
              </Box>

              {/* Separator line */}
              <Box sx={{ height: 16, width: "1px", backgroundColor: "#d1d5db" }} />

              {/* Initials badge on far right */}
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  backgroundColor: "#1d2274",
                  color: "#ffffff",
                  fontSize: "10px",
                  fontWeight: 700,
                }}
              >
                {access.user?.avatar ||
                  access.user?.name?.substring(0, 2).toUpperCase() ||
                  "US"}
              </Avatar>
            </Box>

            {/* Profile Dropdown Menu */}
            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={handleProfileClose}
              sx={{
                mt: 1.5,
                "& .MuiPaper-root": {
                  borderRadius: "20px",
                  width: 320,
                  boxShadow: "0px 10px 30px rgba(15, 23, 42, 0.1)",
                  border: "1px solid",
                  borderColor: "#e2e8f0",
                  p: 0,
                  overflow: "hidden",
                },
              }}
            >
              {/* Profile Card Header Info */}
              <Box sx={{ p: 3, display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 54,
                    height: 54,
                    backgroundColor: "#1d2274",
                    color: "#ffffff",
                    fontSize: "20px",
                    fontWeight: 700,
                  }}
                >
                  {access.user?.avatar || "US"}
                </Avatar>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography sx={{ fontSize: "16px", fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>
                    {access.user?.name || "Username"}
                  </Typography>
                  <Typography sx={{ fontSize: "13px", fontWeight: 500, color: "#64748b", mt: 0.25 }}>
                    {access.user?.subtitle || "User Profile"}
                  </Typography>
                  {access.user?.department && (
                    <Typography sx={{ fontSize: "12px", fontWeight: 500, color: "#94a3b8", mt: 0.5 }}>
                      {access.user.department}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#f1f5f9" }} />

              {/* Mobile Info */}
              <Box sx={{ p: "16px 24px" }}>
                <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", mb: 0.5 }}>
                  MOBILE
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>
                    {access.user?.mobile || "+91 0000000000"}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981" }} />
                    <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#64748b" }}>
                      Active
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ borderColor: "#f1f5f9" }} />

              {/* Sign Out Button */}
              <Box
                onClick={handleLogout}
                sx={{
                  p: "14px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#fef2f2",
                  },
                }}
              >
                <Box sx={{ display: "flex", color: "#ef4444" }}>
                  <LogOut size={16} />
                </Box>
                <Typography sx={{ fontSize: "14px", fontWeight: 700, color: "#ef4444" }}>
                  Sign Out
                </Typography>
              </Box>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
