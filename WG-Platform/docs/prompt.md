Add a complete enterprise routing and navigation framework to WG-Platform.

IMPORTANT:

* Do NOT rewrite existing platform systems
* Keep architecture modular and scalable
* Use JavaScript only
* Use React Router v6+
* Keep routing generic and reusable
* Do NOT add CRM business logic
* Do NOT break existing exports
* ONLY append new README sections
* Preserve existing architecture

==================================================
GOAL
====

Create a centralized enterprise routing/navigation framework for WG-Platform.

Apps should NOT manually manage:

* routing
* navigation
* breadcrumbs
* route guards
* sidebars
* permissions
* protected routes

Apps should ONLY:

* register features
* define routes
* define permissions
* define layouts

WG-Platform should handle everything else.

==================================================
FIRST REFACTOR STRUCTURE
========================

Refactor src structure into domain-based architecture.

Create:

src/
│
├── api/
├── auth/
├── crud/
├── debug/
├── feedback/
├── forms/
├── graph/
├── layout/
├── list/
├── providers/
├── registry/
├── routing/
├── sync/
├── theme/
├── ui/
├── utils/
├── validation/
├── workflow/
├── hooks/
├── constants/
└── index.js

Move existing engines into proper domains where appropriate.

==================================================
CREATE ROUTING DOMAIN
=====================

Create:

src/routing/
│
├── registry/
├── renderer/
├── guards/
├── navigation/
├── breadcrumbs/
├── menus/
├── policies/
├── prefetch/
├── layouts/
├── hooks/
├── providers/
├── constants/
├── utils/
└── index.js

==================================================
CREATE FEATURE REGISTRY
=======================

Create:

registerFeature()
unregisterFeature()
getRegisteredFeatures()

Apps should register features dynamically.

Example:

registerFeature({
name: "customer",
routes: [],
permissions: [],
menu: {}
})

==================================================
CREATE ROUTE REGISTRY
=====================

Create centralized route registry.

Support:

* route keys
* metadata
* lazy routes
* layouts
* permissions
* breadcrumbs
* sidebar visibility
* parent/child routes
* feature flags

==================================================
CREATE ROUTE POLICIES
=====================

Create:

* auth policy
* role policy
* permission policy
* feature policy

Support:

* public routes
* protected routes
* role-based routes
* permission-based routes

==================================================
CREATE PROTECTED ROUTES
=======================

Create:

* ProtectedRoute
* PublicRoute
* RoutePolicyGuard

Support:

* auth redirects
* unauthorized redirects
* role validation
* permission validation

==================================================
CREATE SMART NAVIGATION ENGINE
==============================

Create:

* useSmartNavigation()
* buildPath()
* goTo()
* replaceTo()
* back()
* openInNewTab()

Apps should NOT manually call:
navigate('/customer/1')

Instead:

goTo(ROUTE_KEYS.CUSTOMER_DETAIL, {
customerId: 1
})

==================================================
CREATE ROUTE CONSTANTS
======================

Create:

* ROUTE_KEYS
* PATHS

Avoid hardcoded paths.

==================================================
CREATE BREADCRUMB ENGINE
========================

Create:

* BreadcrumbProvider
* useBreadcrumbs()

Support:

* dynamic titles
* route hierarchy
* entity title resolvers

==================================================
CREATE SIDEBAR/MENU ENGINE
==========================

Create:

* getSidebarRoutes()
* buildSidebarMenu()
* useMenuTree()

Support:

* permissions
* role filtering
* nested menus
* icons
* groups
* hidden routes

==================================================
CREATE ROUTE PREFETCH ENGINE
============================

Create:

* preloadRoute()
* prefetchFeature()
* useRoutePrefetch()

Support:

* lazy loading
* module prefetching
* route preload

==================================================
CREATE PLATFORM ROUTER
======================

Create:

<PlatformRouter />

This should:

* render all registered routes
* apply policies
* apply layouts
* render breadcrumbs
* render protected routes

Apps should NOT manually create routing trees.

==================================================
CREATE LAYOUT ENGINE
====================

Support:

* dashboard layout
* auth layout
* blank layout
* modal layout

Per-route layout configuration.

==================================================
CREATE PERMISSION ENGINE
========================

Support:

* roles
* permissions
* feature access
* route access

==================================================
CREATE NAVIGATION HELPERS
=========================

Create:

* NavigationButtons
* RouteLink
* SmartLink

==================================================
CREATE ROUTING PROVIDER
=======================

Create:

* RoutingProvider

Should manage:

* route registry
* route metadata
* active routes
* permissions

==================================================
README UPDATE
=============

Append ONLY new sections.

Add:

* routing overview
* feature registration
* protected routes
* smart navigation
* breadcrumbs
* route policies
* sidebar generation
* permissions
* layouts
* examples

==================================================
EXPORTS
=======

Export all routing APIs cleanly from:
src/index.js

==================================================
IMPORTANT
=========

* Keep architecture enterprise-ready
* Keep routing framework generic
* Avoid business-specific logic
* Use scalable folder structure
* Keep domains loosely coupled
* Avoid tight dependencies between routing/forms/crud
* Use best React architecture practices
* Make this reusable across CRM, ERP, Workflow, HRMS apps
