# WG-Platform

WG-Platform is a reusable frontend platform package for internal enterprise React applications.

It is designed to be installed into multiple apps such as:

- CRM
- HRMS
- Inventory
- Workflow
- ERP

This package is not a business module.
It does not contain CRM logic, SAP logic, ERP rules, or domain-specific screens.

It gives you the reusable building blocks that apps can share:

- form engine
- list engine
- CRUD helpers
- centralized API layer
- validation helpers
- input registry
- reusable MUI and HTML adapters
- UI primitives
- theme and provider setup

## Table of Contents

- [1. Why WG-Platform exists](#1-why-wg-platform-exists)
- [2. Quick mental model](#2-quick-mental-model)
- [3. Installation](#3-installation)
- [4. First app setup](#4-first-app-setup)
- [5. Your first working login form](#5-your-first-working-login-form)
- [6. Folder architecture](#6-folder-architecture)
- [7. Core usage guide](#7-core-usage-guide)
- [8. Full root export reference](#8-full-root-export-reference)
- [9. Common mistakes and troubleshooting](#9-common-mistakes-and-troubleshooting)
- [10. Build and package notes](#10-build-and-package-notes)

## 1. Why WG-Platform exists

When multiple internal apps are built separately, the same frontend problems appear again and again:

- every app creates its own form handling
- every app creates its own API wrapper
- every app manages list filters differently
- every app builds validation differently
- every app repeats UI wrappers and provider setup

WG-Platform solves that by giving all apps one shared frontend foundation.

Use WG-Platform when you want:

- one standard way to build forms
- one standard API layer
- one reusable CRUD pattern
- one consistent registry for field components
- one reusable theme/provider shell

## 2. Quick mental model

If you are new, remember this:

1. `PlatformProvider` goes at the app root.
2. `FormEngine` renders schema-driven forms.
3. `usePlatformApi` and `useApiCrud` talk to the backend.
4. `ListProvider` and list hooks manage table/list state.
5. `inputRegistry` connects field types like `text`, `select`, `date` to actual UI components.

If you understand those five points, you can already build most app screens.

## 3. Installation

### Install from npm registry

```bash
npm install wg-platform
```

### Install from local folder during development

Build the package first:

```bash
cd WG-Platform
npm install
npm run build
```

Then install it into your app:

```bash
cd ../your-app
npm install ../WG-Platform
```

### Install directly from git

```bash
npm install git+ssh://git@github.com:your-org/WG-Platform.git
```

### Import rule

Always import from the package root:

```js
import { FormEngine, PlatformProvider, usePlatformApi } from 'wg-platform';
```

Do not use deep imports like:

```js
import { FormEngine } from 'wg-platform/src/engines/form/FormEngine.jsx';
```

Root imports keep your apps stable even if the internal folder structure changes later.

## 4. First app setup

This is the recommended app root setup.

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PlatformProvider } from 'wg-platform';
import 'wg-platform/styles.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <PlatformProvider
    apiBaseUrl="https://nestapi.workglow.in/api"
    apiHeaders={{
      'x-app-name': 'crm-ui'
    }}
  >
    <App />
  </PlatformProvider>
);
```

What this gives you:

- TanStack Query provider
- API provider
- MUI theme provider
- CSS baseline
- WG-Platform root styles

### When to use custom API headers

Use `apiHeaders` when every request should include the same headers:

```jsx
<PlatformProvider
  apiBaseUrl="https://nestapi.workglow.in/api"
  apiHeaders={{
    Authorization: `Bearer ${token}`
  }}
>
  <App />
</PlatformProvider>
```

Use `getApiHeaders` when headers must be computed dynamically:

```jsx
<PlatformProvider
  apiBaseUrl="https://nestapi.workglow.in/api"
  getApiHeaders={() => ({
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
  })}
>
  <App />
</PlatformProvider>
```

## 5. Your first working login form

This example shows how a fresher can use the package in a real app screen.

```jsx
import { useState } from 'react';
import {
  FormEngine,
  PlatformButton,
  PlatformCard,
  usePlatformApi
} from 'wg-platform';

const loginFields = [
  {
    name: 'UserName',
    label: 'User Name',
    type: 'text',
    required: true
  },
  {
    name: 'Password',
    label: 'Password',
    type: 'password',
    required: true
  }
];

export default function TestPlatformLogin() {
  const api = usePlatformApi();

  const [values, setValues] = useState({
    UserName: '',
    Password: '',
    DeviceInfo: 'WEB'
  });

  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formValues) {
    try {
      setLoading(true);
      const data = await api.post('/Login', formValues);
      setResponse(data);
    } catch (error) {
      console.error(error);
      alert('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PlatformCard title="Login">
      <FormEngine
        adapter="mui"
        schema={loginFields}
        value={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        actions={
          <PlatformButton type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </PlatformButton>
        }
      />

      {response ? (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      ) : null}
    </PlatformCard>
  );
}
```

Important thing to remember:

`FormEngine` does not send a normal DOM event in `onChange`.
It sends the full next values object.

Correct:

```js
onChange={setValues}
```

Also correct:

```js
onChange={(nextValues) => setValues(nextValues)}
```

Wrong:

```js
onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
```

## 6. Folder architecture

```text
WG-Platform/
├── src/
│   ├── engines/
│   ├── adapters/
│   ├── registry/
│   ├── ui/
│   ├── hooks/
│   ├── providers/
│   ├── utils/
│   ├── constants/
│   ├── themes/
│   ├── styles/
│   ├── types/
│   └── index.js
├── dist/
├── package.json
├── vite.config.js
└── README.md
```

### What each folder means

| Folder | Purpose |
| --- | --- |
| `engines` | Reusable business-neutral logic such as forms, lists, CRUD, validation, graph, mapper, and workflow helpers |
| `adapters` | Concrete UI implementations for field rendering like MUI inputs and HTML inputs |
| `registry` | Maps field types such as `text`, `select`, `date` to components |
| `ui` | Shared UI components like button, card, modal, loader, shell, and feedback message |
| `providers` | Root wrappers for API, React Query, and theme setup |
| `hooks` | Small reusable React hooks |
| `themes` | MUI theme creation |
| `styles` | Shared CSS entry and class name constants |
| `constants` | Shared package constants |
| `utils` | Small helpers like `pick`, `omitEmptyValues`, `invariant` |
| `types` | JSDoc-based type name references for documentation and consistency |

## 7. Core usage guide

### 7.1 Form engine

The form engine is used when you want to render forms from schema instead of manually coding each field.

Main exports:

- `FormEngine`
- `useFormEngine`
- `getValueByPath`
- `setValueByPath`
- `mapInitialValues`
- `mapFormValues`
- `normalizeInputValue`

#### Basic schema example

```jsx
const employeeFields = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    required: true
  },
  {
    name: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { label: 'HR', value: 'HR' },
      { label: 'Finance', value: 'Finance' }
    ]
  },
  {
    name: 'joiningDate',
    label: 'Joining Date',
    type: 'date'
  }
];
```

#### `FormEngine` example

```jsx
import { FormEngine, PlatformButton } from 'wg-platform';
import { useState } from 'react';

function EmployeeForm() {
  const [values, setValues] = useState({
    firstName: '',
    department: '',
    joiningDate: ''
  });

  function handleSubmit(formValues) {
    console.log('submit values', formValues);
  }

  return (
    <FormEngine
      adapter="mui"
      schema={employeeFields}
      value={values}
      onChange={setValues}
      onSubmit={handleSubmit}
      actions={<PlatformButton type="submit">Save</PlatformButton>}
    />
  );
}
```

#### `FormEngine` important props

| Prop | Type | What it does |
| --- | --- | --- |
| `schema` | `Array` | Field definition array |
| `adapter` | `string` | Which adapter group to use, usually `mui` or `html` |
| `registry` | object | Custom input registry if you want full control |
| `components` | object | Override component by field name |
| `value` | object | Controlled form state |
| `defaultValue` | object | Uncontrolled starting value |
| `onChange` | function | Receives the full next values object |
| `onSubmit` | function | Called after validation passes |
| `validation` | array or object | Validation rules |
| `resolver` | function | Custom validation resolver |
| `valueMapper` | function | Transform values before submit |
| `renderField` | function | Custom field rendering hook |
| `actions` | React node | Usually submit/cancel buttons |
| `disabled` | boolean | Disables all fields |
| `readOnly` | boolean | Makes fields read-only |
| `className` | string | Adds class name to form |
| `formProps` | object | Extra native form props |

#### `useFormEngine` example

Use this when you want full control over rendering but still want the platform form logic.

```jsx
import { useFormEngine } from 'wg-platform';

function CustomForm() {
  const form = useFormEngine({
    schema: employeeFields,
    defaultValue: {
      firstName: ''
    },
    onSubmit: (values) => console.log(values)
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input {...form.getFieldProps({ name: 'firstName' })} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### Useful form helper examples

```js
import {
  getValueByPath,
  setValueByPath,
  mapInitialValues,
  mapFormValues
} from 'wg-platform';

const source = {
  employee: {
    profile: {
      firstName: 'Asha'
    }
  }
};

getValueByPath(source, 'employee.profile.firstName');
// 'Asha'

setValueByPath(source, 'employee.profile.lastName', 'Rao');

mapInitialValues(
  [{ name: 'status', defaultValue: 'active' }],
  {}
);

mapFormValues(
  { code: 'ab12' },
  [
    {
      name: 'code',
      mapValue: (value) => value.toUpperCase()
    }
  ]
);
```

### 7.2 Centralized API layer

The API layer lets the app define the base URL once and reuse it everywhere.

Main exports:

- `ApiProvider`
- `PlatformProvider`
- `useApiClient`
- `usePlatformApi`
- `createApiClient`

#### Easiest setup

```jsx
<PlatformProvider apiBaseUrl="https://nestapi.workglow.in/api">
  <App />
</PlatformProvider>
```

Then inside any component:

```jsx
import { usePlatformApi } from 'wg-platform';

function LoginButton() {
  const api = usePlatformApi();

  async function login() {
    const data = await api.post('/Login', {
      UserName: 'admin',
      Password: '123',
      DeviceInfo: 'WEB'
    });

    console.log(data);
  }

  return <button onClick={login}>Login</button>;
}
```

#### API client methods

The client created by the provider gives you:

- `request(config)`
- `get(url, config)`
- `post(url, data, config)`
- `put(url, data, config)`
- `patch(url, data, config)`
- `delete(url, config)`

#### `createApiClient` example

Use this if you want a standalone custom client instance.

```js
import { createApiClient } from 'wg-platform';

const api = createApiClient({
  baseUrl: 'https://nestapi.workglow.in/api',
  headers: {
    'x-module': 'inventory'
  }
});

const users = await api.get('/Users');
const created = await api.post('/Users', {
  name: 'Ravi'
});
```

#### When to use `ApiProvider` directly

Use `ApiProvider` directly only if you do not want the full `PlatformProvider`.
Most apps should use `PlatformProvider`.

```jsx
import { ApiProvider } from 'wg-platform';

<ApiProvider baseUrl="https://nestapi.workglow.in/api">
  <App />
</ApiProvider>
```

### 7.3 CRUD engine

The CRUD engine is for standard create-read-update-delete screens.

Main exports:

- `createCrudService`
- `useCrud`
- `useApiCrud`

#### Best option for most screens: `useApiCrud`

```jsx
import { useApiCrud } from 'wg-platform';

function UsersPage() {
  const users = useApiCrud({
    resource: '/Users',
    queryKey: ['users']
  });

  async function addUser() {
    users.create({
      name: 'Kumar'
    });
  }

  return (
    <div>
      <button onClick={addUser}>Add user</button>
      <pre>{JSON.stringify(users.listQuery.data, null, 2)}</pre>
    </div>
  );
}
```

`useApiCrud` automatically uses the API client from `PlatformProvider`.

#### `useCrud` with custom service

```jsx
import { createCrudService, useCrud, usePlatformApi } from 'wg-platform';

function EmployeesPage() {
  const api = usePlatformApi();

  const service = createCrudService({
    client: api,
    resource: '/Employees'
  });

  const crud = useCrud({
    service,
    queryKey: ['employees']
  });

  return <pre>{JSON.stringify(crud.listQuery.data, null, 2)}</pre>;
}
```

#### `createCrudService` options

| Option | Purpose |
| --- | --- |
| `client` | API client or compatible request client |
| `baseUrl` | Optional base URL when not using provider client |
| `resource` | Base resource path such as `/Users` |
| `endpoints` | Override endpoint paths |
| `getId` | Custom function to read record id |

#### Custom endpoints example

```js
const service = createCrudService({
  client: api,
  resource: '/Employee',
  endpoints: {
    list: 'GetAll',
    get: (id) => `Get/${id}`,
    create: 'Create',
    update: (id) => `Update/${id}`,
    remove: (id) => `Delete/${id}`
  }
});
```

### 7.4 List engine

The list engine helps manage:

- page
- page size
- search
- filters
- sorting
- URL sync

Main exports:

- `ListProvider`
- `ListLayout`
- `useListContext`
- `useListState`
- `createListStore`
- `defaultListState`
- `useUrlSync`
- `useQueryParser`
- `useQueryTranslator`
- `parseListQuery`
- `translateListStateToQuery`

#### `useListState` example

```jsx
import { useListState } from 'wg-platform';

function EmployeeListToolbar() {
  const list = useListState({
    initialState: {
      pageSize: 10
    }
  });

  return (
    <div>
      <input
        value={list.state.search}
        onChange={(e) => list.setSearch(e.target.value)}
      />
      <button onClick={() => list.setPage(1)}>Go to page 2</button>
    </div>
  );
}
```

#### `ListProvider` and `useListContext` example

```jsx
import { ListProvider, useListContext } from 'wg-platform';

function EmployeeListContent() {
  const list = useListContext();
  return <div>Current page: {list.state.page + 1}</div>;
}

function EmployeeListPage() {
  return (
    <ListProvider initialState={{ pageSize: 20 }}>
      <EmployeeListContent />
    </ListProvider>
  );
}
```

#### `ListLayout` example

```jsx
import { ListLayout } from 'wg-platform';

function EmployeeCards({ items, loading, error }) {
  return (
    <ListLayout
      items={items}
      loading={loading}
      error={error}
      emptyState={<div>No employees found</div>}
      renderItem={(item) => <div key={item.id}>{item.name}</div>}
    />
  );
}
```

#### URL sync example

```jsx
import { useListState, useUrlSync } from 'wg-platform';

function UsersPage() {
  const list = useListState();

  useUrlSync({
    state: list.state,
    setState: list.setState
  });

  return null;
}
```

#### Query parser and translator example

```js
import {
  parseListQuery,
  translateListStateToQuery
} from 'wg-platform';

parseListQuery('?page=2&pageSize=10&search=admin&filter.status=active');

translateListStateToQuery({
  page: 0,
  pageSize: 25,
  search: 'john',
  sort: [{ field: 'name', direction: 'asc' }],
  filters: { status: 'active' }
});
```

### 7.5 Query helpers

The query engine is for converting objects to query strings and query strings back to objects.

Main exports:

- `parseQuery`
- `buildQuery`
- `buildQueryString`

```js
import { parseQuery, buildQuery, buildQueryString } from 'wg-platform';

parseQuery('?page=1&status=active');

buildQuery({
  page: 1,
  status: 'active'
});

buildQueryString({
  page: 1,
  status: 'active'
});
```

### 7.6 Validation helpers

The validation helpers are lightweight and schema friendly.

Main exports:

- `buildValidationSchema`
- `createValidationResolver`
- `resolveValidation`

#### `buildValidationSchema` example

```js
import { buildValidationSchema } from 'wg-platform';

const rules = buildValidationSchema([
  {
    name: 'email',
    required: true,
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
  }
]);
```

#### `createValidationResolver` example

```js
import { createValidationResolver } from 'wg-platform';

const resolver = createValidationResolver([
  {
    name: 'password',
    required: true,
    minLength: 8
  }
]);

const errors = resolver({
  password: '123'
});
```

#### `resolveValidation` example

```js
import { resolveValidation } from 'wg-platform';

const errors = resolveValidation(
  { age: 15 },
  {
    age: {
      min: 18,
      minMessage: 'Age must be 18 or above'
    }
  }
);
```

### 7.7 Registry and adapters

The registry decides which input component should be used for each field type.

Main exports:

- `inputRegistry`
- `createInputRegistry`
- `registerInput`
- `registerInputs`
- `getInputComponent`
- MUI adapter components
- HTML adapter components
- `createEditorAdapter`
- `createCustomAdapter`

#### Default adapters available

`mui`:

- `text`
- `string`
- `email`
- `password`
- `number`
- `select`
- `date`
- `time`
- `checkbox`
- `switch`
- `boolean`
- `group`
- `multiselect`

`html`:

- `text`
- `string`
- `email`
- `password`
- `number`
- `select`
- `date`
- `time`

#### Register your own custom input

```jsx
import {
  inputRegistry,
  registerInput,
  FormEngine
} from 'wg-platform';

function MyPhoneInput(props) {
  return <input {...props} placeholder="Phone number" />;
}

registerInput('custom', 'phone', MyPhoneInput, inputRegistry);

const fields = [
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    adapter: 'custom',
    type: 'phone'
  }
];

function PhoneForm() {
  return <FormEngine schema={fields} />;
}
```

#### Build your own registry instance

```js
import { createInputRegistry } from 'wg-platform';

const registry = createInputRegistry({
  custom: {
    phone: MyPhoneInput
  }
});
```

#### Adapter components you can use directly

You usually do not render these directly, but you can if needed:

- `MuiTextInput`
- `MuiSelectInput`
- `MuiDateInput`
- `MuiTimeInput`
- `MuiCheckbox`
- `MuiSwitch`
- `MuiGroupInput`
- `HtmlTextInput`
- `HtmlSelectInput`
- `HtmlDateInput`
- `HtmlTimeInput`

### 7.8 UI components

These are small reusable platform UI building blocks.

Main exports:

- `PlatformButton`
- `PlatformCard`
- `PlatformModal`
- `PlatformLoader`
- `PlatformShell`
- `FeedbackMessage`

#### Example

```jsx
import {
  PlatformButton,
  PlatformCard,
  PlatformLoader,
  PlatformModal,
  PlatformShell,
  FeedbackMessage
} from 'wg-platform';

function DemoPage() {
  return (
    <PlatformShell
      header={<div>Header</div>}
      footer={<div>Footer</div>}
    >
      <PlatformCard title="Welcome">
        <FeedbackMessage severity="success">
          Data loaded successfully
        </FeedbackMessage>

        <PlatformLoader label="Please wait" />

        <PlatformButton>Save</PlatformButton>
      </PlatformCard>

      <PlatformModal open={false} title="Example">
        Modal content
      </PlatformModal>
    </PlatformShell>
  );
}
```

### 7.9 Theme, style, constants, hooks, and utility helpers

These helpers support the main engines.

#### Theme

```js
import { createPlatformTheme } from 'wg-platform';

const theme = createPlatformTheme({
  palette: {
    primary: {
      main: '#005f73'
    }
  }
});
```

#### Styles

```js
import { platformClassNames } from 'wg-platform';

console.log(platformClassNames.root);
```

#### Constants

```js
import { PLATFORM_NAME, PLATFORM_ADAPTERS } from 'wg-platform';

console.log(PLATFORM_NAME);
console.log(PLATFORM_ADAPTERS.MUI);
```

#### Hooks

```js
import { usePlatformId, useStableCallback } from 'wg-platform';

function Example() {
  const fieldId = usePlatformId('employee');
  const handleSave = useStableCallback(() => {
    console.log('saved');
  });

  return <button id={fieldId} onClick={handleSave}>Save</button>;
}
```

#### Utilities

```js
import { invariant, omitEmptyValues, pick } from 'wg-platform';

const payload = omitEmptyValues({
  code: 'EMP-1',
  description: '',
  active: true
});

const summary = pick(payload, ['code', 'active']);

invariant(summary.code, 'Code is required');
```

### 7.10 Mapper, workflow, sync, and graph helpers

These are more advanced helpers. You can skip them at the beginning and come back later.

#### Mapper

```js
import { createMapper, mapRecord } from 'wg-platform';

const employeeMapper = createMapper({
  fullName: (source) => `${source.firstName} ${source.lastName}`,
  departmentName: 'department.name'
});

const mapped = employeeMapper({
  firstName: 'Asha',
  lastName: 'Rao',
  department: { name: 'HR' }
});

mapRecord(
  { profile: { email: 'a@example.com' } },
  { emailAddress: 'profile.email' }
);
```

#### Workflow

```js
import {
  createWorkflowDefinition,
  getInitialWorkflowStep
} from 'wg-platform';

const workflow = createWorkflowDefinition({
  steps: [
    { id: 'draft', initial: true },
    { id: 'review' },
    { id: 'approved' }
  ],
  transitions: [
    { from: 'draft', to: 'review' },
    { from: 'review', to: 'approved' }
  ]
});

const firstStep = getInitialWorkflowStep(workflow);
```

#### Sync

```js
import { createSyncQueue, createSyncController } from 'wg-platform';

const queue = createSyncQueue();
queue.enqueue({ id: 1, type: 'CREATE' });
queue.dequeue();

const controller = createSyncController({
  push: async (payload) => console.log('push', payload),
  pull: async () => console.log('pull')
});
```

#### Graph

```js
import { createGraph, topologicalSort } from 'wg-platform';

const graph = createGraph({
  nodes: [
    { id: 'start' },
    { id: 'review' },
    { id: 'end' }
  ],
  edges: [
    { from: 'start', to: 'review' },
    { from: 'review', to: 'end' }
  ]
});

const order = topologicalSort(graph);
```

## 8. Full root export reference

Everything below is available from:

```js
import { ... } from 'wg-platform';
```

### A-Z export list

| Export | Type | What it does |
| --- | --- | --- |
| `ApiProvider` | provider | Standalone API context provider |
| `FeedbackMessage` | component | MUI `Alert` wrapper for feedback messages |
| `FormEngine` | component | Schema-driven form renderer |
| `HtmlDateInput` | component | Native HTML date input adapter |
| `HtmlSelectInput` | component | Native HTML select input adapter |
| `HtmlTextInput` | component | Native HTML text input adapter |
| `HtmlTimeInput` | component | Native HTML time input adapter |
| `ListLayout` | component | Lightweight renderer for list loading, empty, and item states |
| `ListProvider` | provider | Context wrapper for list state |
| `MuiCheckbox` | component | MUI checkbox adapter |
| `MuiDateInput` | component | MUI date input adapter |
| `MuiGroupInput` | component | MUI grouped checkbox input adapter |
| `MuiSelectInput` | component | MUI select adapter |
| `MuiSwitch` | component | MUI switch adapter |
| `MuiTextInput` | component | MUI text adapter |
| `MuiTimeInput` | component | MUI time adapter |
| `PLATFORM_ADAPTERS` | constant | Adapter name constants such as `mui`, `html`, `editor`, `custom` |
| `PLATFORM_NAME` | constant | Package name constant |
| `PlatformButton` | component | Reusable MUI button wrapper |
| `PlatformCard` | component | Reusable MUI card wrapper |
| `PlatformLoader` | component | Reusable loading indicator |
| `PlatformModal` | component | Reusable modal/dialog wrapper |
| `PlatformProvider` | provider | Main root provider for API, query, and theme |
| `PlatformShell` | component | Page shell layout wrapper |
| `QueryProvider` | provider | Standalone TanStack Query provider |
| `buildQuery` | function | Converts object to query string without `?` |
| `buildQueryString` | function | Converts object to query string with `?` |
| `buildValidationSchema` | function | Converts field schema into validation rules |
| `createApiClient` | function | Creates reusable HTTP client |
| `createCrudService` | function | Creates CRUD service with list/get/create/update/remove methods |
| `createCustomAdapter` | function | Creates a custom adapter definition object |
| `createEditorAdapter` | function | Creates an editor adapter definition object |
| `createGraph` | function | Creates graph helper with adjacency and neighbors |
| `createInputRegistry` | function | Creates a new input registry instance |
| `createListStore` | function | Creates a standalone Zustand list store |
| `createMapper` | function | Creates mapper function from mapping config |
| `createPlatformTheme` | function | Creates default MUI theme with overrides |
| `createSyncController` | function | Creates push/pull sync controller |
| `createSyncQueue` | function | Creates in-memory sync queue |
| `createValidationResolver` | function | Creates validation resolver function |
| `createWorkflowDefinition` | function | Creates workflow definition with steps and transitions |
| `defaultListState` | constant | Default list state object |
| `getInitialWorkflowStep` | function | Returns initial workflow step |
| `getInputComponent` | function | Returns registered component for adapter and field type |
| `getValueByPath` | function | Reads nested object value using dot path |
| `inputRegistry` | object | Default global input registry |
| `invariant` | function | Throws error when condition is false |
| `mapFormValues` | function | Maps/normalizes form values before submit |
| `mapInitialValues` | function | Applies schema default values to initial object |
| `mapRecord` | function | Maps one object shape into another |
| `normalizeInputValue` | function | Normalizes DOM event or direct value |
| `omitEmptyValues` | function | Removes empty values from object |
| `parseListQuery` | function | Parses list-style query values into list state |
| `parseQuery` | function | Parses query string into object |
| `pick` | function | Returns object with selected keys only |
| `platformClassNames` | constant | Shared CSS class name map |
| `platformTypeNames` | constant | JSDoc type name reference object |
| `registerInput` | function | Registers single input in registry |
| `registerInputs` | function | Registers multiple inputs in registry |
| `resolveValidation` | function | Runs validation rules against values |
| `setValueByPath` | function | Writes nested object value using dot path |
| `topologicalSort` | function | Returns topological ordering from graph |
| `translateListStateToQuery` | function | Converts list state to query object |
| `useApiClient` | hook | Reads API client from context |
| `useApiCrud` | hook | CRUD hook powered by the provider API client |
| `useCrud` | hook | Generic CRUD hook using TanStack Query |
| `useFormEngine` | hook | Manual access to form engine logic |
| `useListContext` | hook | Reads list context from `ListProvider` |
| `useListState` | hook | Creates and manages list state |
| `usePlatformApi` | hook | Alias of `useApiClient` |
| `usePlatformId` | hook | Creates stable id string from React `useId` |
| `useQueryParser` | hook/function | Parses list query input |
| `useQueryTranslator` | hook/function | Converts list state into query object |
| `useStableCallback` | hook | Stable callback wrapper |
| `useUrlSync` | hook | Syncs list state with URL search params |

### Most-used exports for beginners

If you are just starting, focus on these first:

- `PlatformProvider`
- `FormEngine`
- `usePlatformApi`
- `useApiCrud`
- `PlatformButton`
- `PlatformCard`
- `createInputRegistry`
- `registerInput`

You do not need to learn every export on day one.

## 9. Common mistakes and troubleshooting

### `onChange` issue in `FormEngine`

Problem:

You expect a normal event object like `e.target.value`.

Reality:

`FormEngine` sends the full next form values object.

Fix:

```jsx
onChange={setValues}
```

### Duplicate React or MUI error

Typical error:

- `Invalid hook call`
- `Cannot read properties of null (reading 'useContext')`

This usually happens when your app and local package resolve different React copies.

Best practice:

- import from `wg-platform` only
- install with `npm install ../WG-Platform`
- make sure the consuming Vite app dedupes React and MUI if needed

### Field component not rendering

Check these points:

- field must have `name`
- field must not have `hidden: true`
- adapter must exist
- field `type` must be registered in the selected adapter

### Submit handler not called

Possible reasons:

- validation failed
- submit button is not `type="submit"`
- custom `onSubmit` handler is throwing

### API request uses wrong URL

Check these points:

- `apiBaseUrl` is set in `PlatformProvider`
- component passes path like `/Login` or `/Users`
- you are not mixing full URLs and relative URLs incorrectly

## 10. Build and package notes

### Build the library

```bash
npm run build
```

### What the build generates

- `dist/wg-platform.es.js`
- `dist/wg-platform.cjs`
- `dist/wg-platform.css`

### Local package refresh flow

If you change WG-Platform and want to test it in another app:

```bash
cd WG-Platform
npm run build

cd ../your-app
npm install ../WG-Platform
```

### Peer dependency idea

WG-Platform expects the consuming app to own these libraries:

- `react`
- `react-dom`
- `@mui/material`
- `@tanstack/react-query`
- `react-router-dom`
- `zustand`

That keeps the package reusable and prevents bundling app-level dependencies inside the library.

## Final note

If you are new to this package, do not try to learn everything at once.

Start in this order:

1. `PlatformProvider`
2. `FormEngine`
3. `usePlatformApi`
4. `useApiCrud`
5. registry and custom fields
6. list engine
7. advanced helpers like graph, sync, workflow, and mapper

That order is the fastest way to become productive in a real app.

## Debug Mode

WG-Platform includes a lightweight debug logger for development troubleshooting.
Logs are disabled by default and only run when you explicitly enable debug mode in the browser.

Enable debug mode from the browser console:

```js
window.WG_DEBUG = true;
```

Disable debug mode:

```js
window.WG_DEBUG = false;
```

Debug logs are scoped, so messages are easier to scan:

- `[WG-FORM]` form rendering, field changes, and submit attempts
- `[WG-CRUD]` list queries and mutation success events
- `[WG-API]` API requests from CRUD services
- `[WG-LIST]` reserved for list engine debugging
- `[WG-VALIDATION]` validation results
- `[WG-REGISTRY]` input component resolution

Example output:

```text
[WG-FORM] Field changed
[WG-API] POST Request
[WG-CRUD] Create mutation success
[WG-REGISTRY] Resolved component
```

Example debugging flow:

```js
window.WG_DEBUG = true;
```

Then use the app normally. When a form field changes, an API request runs, or an input component is resolved, WG-Platform will print grouped debug logs in the browser console.

The logger also redacts common sensitive fields such as password, token, authorization, secret, and api key values before printing object payloads.

You can use the logger in future platform engines like this:

```js
import { FORM, platformLog } from 'wg-platform';

platformLog(FORM, 'Field changed', {
  name: 'UserName',
  value: 'admin'
});
```

Use debug logs for reusable platform internals only. Business apps should avoid adding random `console.log` calls inside shared platform code.

## Global API State System

WG-Platform includes a centralized API state engine for managing API UX across an app.
It tracks global loading, global errors, active requests, and the last normalized API error.

The system is connected to the existing platform API client, so the normal API methods still work:

```js
api.get('/Users');
api.post('/Login', values);
api.put('/Users/1', payload);
api.delete('/Users/1');
```

By default, requests use `global` mode.

### Enable global API UI

Add these props to `PlatformProvider`:

```jsx
<PlatformProvider
  apiBaseUrl="https://nestapi.workglow.in/api"
  enableGlobalLoader
  enableGlobalErrors
>
  <App />
</PlatformProvider>
```

`enableGlobalLoader` renders `GlobalApiLoader` when global requests are running.
`enableGlobalErrors` renders `GlobalApiError` when global requests fail.

These UI components are optional, so existing apps do not suddenly change their UX unless they opt in.

### Request modes

WG-Platform supports three request modes:

| Mode | Use when | Loader | Error UI | Tracking |
| --- | --- | --- | --- | --- |
| `global` | Normal page actions like save, login, delete, submit | Yes | Yes | Yes |
| `local` | Component controls its own loading and error state | No | No | Yes |
| `silent` | Background calls like token refresh, polling, telemetry | No | No | No UI tracking |

### Global mode

Use global mode for normal user-facing actions.
This is the default mode, so you usually do not need to pass anything.

```js
const data = await api.post('/Login', values);
```

This is the same as:

```js
const data = await api.post('/Login', values, {
  mode: 'global'
});
```

Global mode:

- increases global loading count
- shows global loader if enabled
- normalizes errors
- shows global error UI if enabled
- tracks active request state

### Local mode

Use local mode when a component wants to handle its own loader and error message.

```jsx
function UploadButton() {
  const api = usePlatformApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function upload(payload) {
    try {
      setLoading(true);
      setError(null);

      await api.post('/Upload', payload, {
        mode: 'local'
      });
    } catch (uploadError) {
      setError(uploadError);
    } finally {
      setLoading(false);
    }
  }

  return <button disabled={loading}>Upload</button>;
}
```

Local mode:

- does not show global loader
- does not show global error UI
- still tracks the active request
- still updates normalized `lastError`

### Silent mode

Use silent mode for background requests that should not affect the user interface.

```js
await api.get('/RefreshToken', {
  mode: 'silent'
});
```

Silent mode is useful for:

- refresh token calls
- background sync
- polling
- health checks
- non-blocking telemetry

Silent mode:

- does not show global loader
- does not show global error UI
- does not add UI request tracking

### API state hooks

Use these hooks when building app-level UX or custom shells:

```js
import {
  useApiState,
  useGlobalLoader,
  useGlobalError
} from 'wg-platform';
```

Read global loader state:

```jsx
function HeaderLoader() {
  const { loading, loadingCount } = useGlobalLoader();

  return loading ? <span>{loadingCount} request(s) running</span> : null;
}
```

Read and dismiss global errors:

```jsx
function ErrorPanel() {
  const { errors, dismissError, clearErrors } = useGlobalError();

  return (
    <div>
      {errors.map((error) => (
        <button key={error.id} onClick={() => dismissError(error.id)}>
          {error.message}
        </button>
      ))}

      <button onClick={clearErrors}>Clear all</button>
    </div>
  );
}
```

Read the full API state:

```js
const apiState = useApiState();

console.log(apiState.loadingCount);
console.log(apiState.globalLoading);
console.log(apiState.globalErrors);
console.log(apiState.activeRequests);
console.log(apiState.lastError);
```

### Reusable global UI components

You can use the built-in components directly if you want to place them yourself:

```jsx
import { GlobalApiLoader, GlobalApiError } from 'wg-platform';

function AppShell() {
  return (
    <>
      <GlobalApiLoader label="Working..." />
      <GlobalApiError />
      <App />
    </>
  );
}
```

### Normalized API state shape

The API store tracks:

- `loadingCount`
- `globalLoading`
- `globalErrors`
- `activeRequests`
- `lastError`

Errors are normalized into a consistent shape:

```js
{
  id: 'error-id',
  message: 'Request failed.',
  status: 500,
  data: {},
  method: 'POST',
  url: '/Login',
  mode: 'global',
  timestamp: '2026-05-16T00:00:00.000Z'
}
```

### Exported API state utilities

The following exports are available from `wg-platform`:

- `GLOBAL`
- `LOCAL`
- `SILENT`
- `API_MODES`
- `normalizeApiMode`
- `apiStore`
- `useApiState`
- `useGlobalLoader`
- `useGlobalError`
- `GlobalApiLoader`
- `GlobalApiError`
- `normalizeApiError`
- `trackRequestStart`
- `trackRequestSuccess`
- `trackRequestError`
- `trackRequestEnd`
