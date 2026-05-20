# Formik + Yup — Usage with WG-Platform Form Engine

This document shows how to use the new Formik + Yup configuration-driven form engine in WG-Platform. It explains the available config options, how to wire up validation, conditional field logic (`dependsOn`), and how to render using Material-UI (MUI) components.

**Files**
- Formik engine: [src/engines/form/FormikConfigEngine.jsx](src/engines/form/FormikConfigEngine.jsx)
- FormEngine integration: [src/engines/form/FormEngine.jsx](src/engines/form/FormEngine.jsx)
- Yup builder: [src/engines/validation/yupSchemaBuilder.js](src/engines/validation/yupSchemaBuilder.js)
- Sample config: [src/engines/form/sampleFormConfig.js](src/engines/form/sampleFormConfig.js)

This README was added as `docs/FORMIK_YUP.md` and does not modify existing runtime code files.

**Install**
Install the runtime dependencies if they are not already present in the host application (peer deps are listed in `package.json`):

```bash
cd "d:\\live work\\UIPlatform\\WG-Platform"
npm install formik@^2.4.3 yup @mui/material @emotion/react @emotion/styled
```

**Quick Start — render a config-driven form**

1) Use the standalone Formik-config engine (recommended for config-driven usage):

```jsx
import React from 'react';
import FormikConfigEngine from './src/engines/form/FormikConfigEngine.jsx';
import sampleFormConfig from './src/engines/form/sampleFormConfig.js';

export default function Page() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <FormikConfigEngine
        config={sampleFormConfig}
        onSubmit={(values) => console.log('submit', values)}
        showDebug={true}
      />
    </div>
  );
}
```

2) Or, use the project-wide `FormEngine` and set `adapter="formik"`:

```jsx
import React from 'react';
import { FormEngine } from './src/engines/form/FormEngine.jsx';
import sampleFormConfig from './src/engines/form/sampleFormConfig.js';

export default function Page() {
  return (
    <FormEngine
      schema={sampleFormConfig.fields}
      adapter="formik"
      defaultValue={sampleFormConfig.initialValues}
      onSubmit={(values) => console.log('submit', values)}
    />
  );
}
```

**Validation (Yup)**
- The engine automatically builds a Yup schema from the `fields` array using the builder at [src/engines/validation/yupSchemaBuilder.js](src/engines/validation/yupSchemaBuilder.js).
- Field-level validation supports: `required`, `textOnly`, `number` / `numberOnly`, `min` / `max` (numeric), `minLength` / `maxLength`, and `pattern` (custom regex).
- The config also supports a top-level `validationSchema` property. `validationSchema` can be any of:
  - a Yup schema instance (object with `validate` method),
  - a factory function that receives `fields` and returns a Yup schema, or
  - an object like `{ fields: [...] }` that will be passed to the builder.

Example: top-level Yup schema override

```js
import * as yup from 'yup';
import sampleFormConfig from './src/engines/form/sampleFormConfig.js';

const custom = yup.object().shape({
  secret: yup.string().matches(/^[A-Z]{3}\d{3}$/, 'Wrong format')
});

const config = { ...sampleFormConfig, validationSchema: custom };
```

Or using the builder-style override:

```js
const config = {
  ...sampleFormConfig,
  validationSchema: { fields: [{ name: 'firstName', validation: { required: true } }] }
};
```

**Conditional Logic (dependsOn)**
- Fields can react to other fields using `dependsOn`.
- Shape: `{ field: '<otherFieldName>', value: <matchValue>, operator: '<op>', action: '<show|hide|disable>' }`
- Supported operators: `equals` (default), `==`, `notEquals`, `!=`, `in`, `notIn`, `includes` / `contains`, `gt` / `>` , `gte` / `>=`, `lt` / `<`, `lte` / `<=`, `regex`.

Examples (see sample config):
- Show `state` only if `country === 'USA'`:
  - `dependsOn: { field: 'country', value: 'USA', action: 'show' }`
- Disable `promoCode` when `country === 'CAN'`:
  - `dependsOn: { field: 'country', value: 'CAN', action: 'disable' }`
- Disable `newsletter` when `age < 18`:
  - `dependsOn: { field: 'age', value: 18, operator: '<', action: 'disable' }`

**Field config highlights**
- `name` (required): unique field identifier
- `label`: UI label
- `type`: `text`, `number`, `select`, `checkbox`, `password`, `email`, `date`, `time`
- `options` (for `select`): array of values or objects `{ label, value, disabled }`
- `placeholder`: shown for selects
- `validation`: object passed to the Yup builder (see `yupSchemaBuilder.js`)
- `dependsOn`: conditional logic described above

**Extending components / adapter mapping**
- `FormikConfigEngine` renders MUI components by default.
- If you want to reuse adapters or custom input components from the project's `inputRegistry`, use the `FormEngine` API with `adapter: 'formik'` (then you may provide custom components via the `components` prop to `FormEngine`). See [src/registry/inputRegistry.js](src/registry/inputRegistry.js) if you need to register additional adapters.

**Run & test**
Start the dev server to visually test the form:

```bash
npm run dev
# or
npm run preview
```

**Notes & next steps**
- The builder supports `pattern` as a string or RegExp. Use `patternMessage` to customize the error message.
- If you want `yup` + `FormEngine` integration using `yup` schema generation from external sources, you can pass a function to `validationSchema` that returns a Yup schema.
- If you'd like, I can:
  - Run a quick dev smoke test and capture screenshots,
  - Add an example page to the repo and wire it into `WG-Platform` demo app,
  - Wire `FormikConfigEngine` to use `inputRegistry` to make adapters pluggable.

---

If you want me to add a demo page inside the repo and run the dev server to verify behavior, say "Run demo" and I'll start the dev server and verify the form UI.
