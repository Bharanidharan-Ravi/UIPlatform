Implement ONLY Phase 3 of the WG-Platform enterprise routing system.

IMPORTANT:

* Continue from the existing routing foundation
* Do NOT rewrite previous architecture
* Extend the current system incrementally
* Maintain backward compatibility
* Keep the routing system generic and reusable

==================================================
GOAL
====

Build the first real routing runtime layer for WG-Platform.

This phase should implement:

* route rendering
* protected routes
* role validation
* smart navigation
* route layouts
* sidebar metadata support
* breadcrumb generation
* route policy contracts

BUT:

* keep implementation lightweight
* avoid over-engineering
* avoid workflow routing
* avoid feature flags
* avoid plugin systems
* avoid microfrontend logic

==================================================
CURRENT FOUNDATION ALREADY EXISTS
=================================

Already implemented:

* feature registry
* route registry
* routing provider
* route constants
* path helpers
* routing hooks
* compatibility shims

Build on top of these.

==================================================
CREATE ROUTING RUNTIME
======================

Create:

src/routing/runtime/

Structure:

runtime/
├── PlatformRouter.jsx
├── RouteRenderer.jsx
├── ProtectedRoute.jsx
├── SmartNavigate.jsx
├── RouteLayoutRenderer.jsx
├── BreadcrumbBuilder.js
├── policy/
├── hooks/
└── index.js

==================================================
PLATFORM ROUTER
===============

Create PlatformRouter.

Responsibilities:

* read registered routes
* render routes dynamically
* integrate with react-router-dom
* support nested routes
* support layouts
* support protected routes

Keep implementation generic.

==================================================
ROUTE CONFIG CONTRACT
=====================

Support route definitions like:

{
key,
path,
component,
layout,
protected,
roles,
permissions,
sidebar,
breadcrumb,
children,
metadata
}

==================================================
PROTECTED ROUTE
===============

Create ProtectedRoute component.

Responsibilities:

* check auth
* check roles
* check permissions
* redirect safely
* support fallback route

Keep generic.

NO CRM-specific auth logic.

==================================================
SMART NAVIGATION
================

Create SmartNavigate utilities.

Support:

* goToRouteKey()
* goBackSafe()
* buildNavigationPath()
* navigateWithParams()

Should use:

* ROUTE_KEYS
* PATHS
* route registry

==================================================
BREADCRUMB SYSTEM
=================

Create lightweight breadcrumb builder.

Support:

* automatic breadcrumb generation
* route metadata support
* nested route support
* custom breadcrumb labels

Avoid heavy abstractions.

==================================================
SIDEBAR METADATA SUPPORT
========================

Support sidebar metadata in routes.

Example:

sidebar: {
label,
icon,
order,
hidden
}

DO NOT build sidebar UI yet.

Only support metadata.

==================================================
LAYOUT SUPPORT
==============

Create RouteLayoutRenderer.

Support:

* default layout
* route-specific layouts
* nested layouts

Keep lightweight.

==================================================
ROUTE POLICY CONTRACT
=====================

Create policy contract system.

Support:

* canAccessRoute()
* validateRoutePolicy()

Policies should support:

* auth
* roles
* permissions

NO business logic.

==================================================
HOOKS
=====

Create:

* useSmartNavigation()
* useRouteAccess()
* useBreadcrumbs()

==================================================
ERROR HANDLING
==============

Support:

* route not found
* unauthorized route
* invalid route config

==================================================
EXPORTS
=======

Export all new routing runtime APIs from:

* src/routing/index.js
* src/index.js

==================================================
README
======

Append ONLY new sections.

Add:

* PlatformRouter usage
* route config examples
* ProtectedRoute examples
* smart navigation examples
* breadcrumb examples
* layout examples

DO NOT rewrite existing README.

==================================================
IMPORTANT ARCHITECTURE RULES
============================

Avoid:

* giant routing engines
* deeply nested abstractions
* framework magic
* excessive generics
* feature explosion
* business-specific assumptions

Prefer:

* explicit contracts
* readable code
* incremental scalability
* low coupling
* enterprise maintainability

==================================================
VERY IMPORTANT
==============

Do NOT implement:

* workflow routing
* plugin systems
* feature flags
* analytics tracking
* route prefetching
* dynamic imports optimization
* SSR logic
* microfrontend orchestration

This phase is ONLY:
enterprise routing runtime foundation.
