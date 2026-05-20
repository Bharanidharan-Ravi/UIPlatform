Implement ONLY Phase 1 and Phase 2 of the WG-Platform routing/navigation framework.

IMPORTANT:

* DO NOT implement advanced routing yet
* DO NOT implement full menus yet
* DO NOT implement workflow routing yet
* DO NOT implement feature flags yet
* DO NOT implement route prefetch yet
* DO NOT implement complex layouts yet
* Focus ONLY on foundation/stabilization

==================================================
GOAL
====

Prepare WG-Platform for future enterprise routing/navigation architecture.

This phase should ONLY establish:

* scalable folder structure
* routing domain
* feature registry
* route registry
* route constants
* registry contracts
* base utilities

NO heavy routing logic yet.

==================================================
PHASE 1 — DOMAIN RESTRUCTURE
============================

Refactor src into domain-based architecture.

Current structure:

src/
├── adapters
├── constants
├── debug
├── engines
├── hooks
├── providers
├── registry
├── styles
├── themes
├── types
├── ui
└── utils

Create this new structure:

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

==================================================
MOVE EXISTING CODE SAFELY
=========================

Move existing code into proper domains WITHOUT breaking exports.

Examples:

* FormEngine -> forms/
* validation -> validation/
* list logic -> list/
* graph logic -> graph/

Maintain backward compatibility.

==================================================
CREATE ROUTING DOMAIN
=====================

Create:

src/routing/
│
├── registry/
├── constants/
├── hooks/
├── utils/
├── providers/
└── index.js

DO NOT create advanced routing yet.

==================================================
PHASE 2 — FEATURE REGISTRY
==========================

Create centralized feature registration system.

Create:

registerFeature()
unregisterFeature()
getRegisteredFeatures()
clearFeatures()

==================================================
FEATURE CONTRACT
================

Features should support:

{
name,
routes,
permissions,
menu,
layouts,
metadata
}

Keep generic.

NO CRM logic.

==================================================
CREATE ROUTE REGISTRY
=====================

Create centralized route registry.

Support:

* route keys
* paths
* metadata
* permissions
* layout
* sidebar visibility

Store only.

NO rendering yet.

==================================================
CREATE ROUTE CONSTANTS
======================

Create:

* ROUTE_KEYS
* PATHS

Avoid hardcoded route strings.

==================================================
CREATE ROUTE HELPERS
====================

Create utility helpers:

buildPath()
normalizePath()
matchRouteKey()

Keep lightweight.

==================================================
CREATE ROUTING PROVIDER
=======================

Create minimal RoutingProvider.

Responsibilities:

* provide registry context
* expose registered features
* expose route metadata

NO navigation logic yet.

==================================================
CREATE BASIC HOOKS
==================

Create:

* useFeatureRegistry()
* useRouteRegistry()

==================================================
CREATE CLEAN EXPORTS
====================

Export all routing foundation APIs from:

* src/routing/index.js
* src/index.js

==================================================
BACKWARD COMPATIBILITY
======================

DO NOT break:

* existing imports
* existing exports
* current FormEngine usage
* current CRUD usage

==================================================
README
======

Append ONLY new sections.

Add:

* routing foundation overview
* feature registry overview
* route registry overview
* route constants overview
* examples

DO NOT rewrite existing README.

==================================================
IMPORTANT
=========

This phase is ONLY foundation architecture.

Do NOT over-engineer.

Avoid:

* complex abstractions
* premature optimization
* giant utilities
* advanced route rendering

Focus on:

* clean contracts
* scalable structure
* stable foundation
* enterprise-ready organization
* low coupling between domains
