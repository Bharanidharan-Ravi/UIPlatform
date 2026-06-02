# WG Platform

> Configuration-driven Enterprise Application Development Platform for building scalable business applications using ReactJS, ASP.NET Core, and modern enterprise architecture patterns.

![React](https://img.shields.io/badge/React-Frontend-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![MUI](https://img.shields.io/badge/MUI-UI_Framework-blue)
![React_Query](https://img.shields.io/badge/React_Query-Data_Fetching-red)
![SignalR](https://img.shields.io/badge/SignalR-Real_Time-green)
![Platform](https://img.shields.io/badge/Enterprise-Platform-success)

---

## Overview

WG Platform is a reusable enterprise application platform designed to accelerate software delivery through a configuration-driven architecture. It provides a collection of reusable engines, routing runtime, workflow orchestration, API integration capabilities, and UI generation components that eliminate repetitive development across multiple business applications.

The platform serves as the foundation for enterprise-grade applications including Ticketing Systems, HRMS Platforms, CRM Solutions, Inventory Management Systems, Workflow Automation Platforms, and Internal Business Applications.

---

## Why WG Platform?

Traditional enterprise applications repeatedly implement the same core functionalities:

- Forms
- Tables
- Validation
- Routing
- Role Management
- API Integration
- Search
- Filtering
- Pagination
- Notifications

As applications grow, these repeated implementations increase development time, maintenance effort, and technical debt.

WG Platform solves this challenge by standardizing common application patterns into reusable platform capabilities, enabling teams to focus on business requirements instead of rebuilding infrastructure repeatedly.

---

## Key Benefits

### Faster Development

Build business modules using configuration instead of repeatedly implementing common UI and workflow logic.

### Reduced Duplicate Code

Centralized reusable engines eliminate repetitive development across projects.

### Consistent User Experience

Shared components, layouts, validation, and workflows ensure a standardized experience.

### Scalable Architecture

Supports enterprise applications with multiple modules, teams, roles, and business domains.

### Low-Code Approach

Many application pages can be created through configuration without writing extensive React code.

---

## Key Platform Capabilities

### Dynamic Routing Runtime

- Config-based route registration
- Parent-child routing
- Dynamic page navigation
- URL synchronization
- Route guards

### Feature Registry

- Centralized feature management
- Dynamic module loading
- Permission-aware features
- Extensible architecture

### Role & Permission Engine

- Role-based access control
- Feature-level authorization
- Dynamic permission handling
- Multi-role support

### Dynamic Form Engine

- JSON-driven forms
- Formik integration
- Validation rules
- Dynamic controls
- Reusable components

### Dynamic Table Engine

- Pagination
- Sorting
- Filtering
- Search
- Export support

### Filter Engine

- Multi-condition filtering
- URL synchronization
- Server-side filtering
- Client-side filtering

### Workflow Engine

- Step-based navigation
- Next / Previous flow management
- Multi-step processes
- Dynamic state transitions

### API Integration Layer

- Config-driven API execution
- Request transformation
- Response mapping
- Error handling

### Synchronization Framework

- Multi-endpoint orchestration
- Parallel API execution
- Aggregated responses
- External system integration

### Real-Time Communication

- SignalR integration
- Notifications
- Live updates
- Event-driven architecture

### State Management

- Redux support
- Zustand support
- React Query support
- Shared application state

---

# Architecture Overview

```text
┌──────────────────────────────┐
│        Applications          │
├──────────────────────────────┤
│ WGNest                       │
│ CRM Systems                  │
│ HRMS Platforms               │
│ Inventory Systems            │
│ Workflow Applications        │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         WG Platform          │
├──────────────────────────────┤
│ Routing Runtime              │
│ Feature Registry             │
│ Role Engine                  │
│ Form Engine                  │
│ Table Engine                 │
│ Filter Engine                │
│ Workflow Engine              │
│ Validation Engine            │
│ API Layer                    │
│ Synchronization Framework    │
│ SignalR Integration          │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Backend Services        │
├──────────────────────────────┤
│ ASP.NET Core APIs            │
│ SAP Integrations             │
│ External Services            │
│ SQL Server                   │
└──────────────────────────────┘
```

---

# Screenshots

## Dynamic Form Engine

![Dynamic Form Engine](./docs/screenshots/dynamic-form-engine.png)

Configuration-driven forms with validation, dynamic controls, Formik integration, and reusable field components.

---

## Dynamic Table Engine

![Dynamic Table Engine](./docs/screenshots/dynamic-table-engine.png)

Enterprise-grade table engine supporting sorting, filtering, pagination, search, and configurable actions.

---

## Routing Runtime

![Routing Runtime](./docs/screenshots/routing-runtime.png)

Centralized routing system supporting dynamic navigation, workflow transitions, and parent-child route structures.

---

## Filter Engine

![Filter Engine](./docs/screenshots/filter-engine.png)

Reusable filtering framework supporting URL synchronization, multi-condition filters, and server-side querying.

---

## Platform Debug Console

![Platform Debug Console](./docs/screenshots/platform-debugger.png)

Built-in debugging tools for routing, API execution, state tracking, and configuration troubleshooting.

---

# Technology Stack

## Frontend

- ReactJS
- JavaScript (ES6+)
- Material UI
- Formik
- Redux
- Zustand
- React Query

## Real-Time

- SignalR

## Backend Integration

- ASP.NET Core Web API
- REST APIs

## Database

- SQL Server

## Tooling

- Vite
- Git
- GitHub

---

# Applications Built Using WG Platform

### WGNest

Multi-company SaaS platform supporting:

- Ticketing
- Project Management
- Repository Management
- Timesheets
- Leave Management
- Meeting Scheduler

### CRM Applications

- Customer Management
- Lead Tracking
- Sales Operations

### HRMS Applications

- Employee Management
- Leave Tracking
- Workforce Operations

### Inventory & Warehouse Applications

- Inventory Operations
- Warehouse Management
- Manufacturing Workflows

### Workflow Automation Systems

- Approval Flows
- Task Automation
- Business Process Management

---

# Impact

- Standardized application development across multiple projects.
- Reduced repeated implementation of common enterprise application patterns.
- Accelerated delivery of new business modules through reusable platform capabilities.
- Enabled configuration-driven application development.
- Improved maintainability through centralized architecture and reusable engines.

---

# Quick Example

```javascript
{
  route: "/tickets",
  component: "TicketList",
  permissions: ["ViewTicket"],
  filters: true,
  pagination: true,
  api: "/api/tickets"
}
```

The platform automatically provides:

- Routing
- Permission validation
- API integration
- Filtering
- Pagination
- State management
- URL synchronization

without requiring repetitive implementation.

---

# Table of Contents
