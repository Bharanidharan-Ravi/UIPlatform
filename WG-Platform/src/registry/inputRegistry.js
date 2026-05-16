import { REGISTRY, platformLog } from '../debug/index.js';
import {
  MuiCheckbox,
  MuiDateInput,
  MuiGroupInput,
  MuiSelectInput,
  MuiSwitch,
  MuiTextInput,
  MuiTimeInput
} from '../adapters/mui/index.js';
import {
  HtmlDateInput,
  HtmlSelectInput,
  HtmlTextInput,
  HtmlTimeInput
} from '../adapters/html/index.js';

const normalize = (value) => String(value || '').trim().toLowerCase();

export function createInputRegistry(initialAdapters = {}) {
  const adapters = new Map();

  const ensureAdapter = (adapter) => {
    const adapterKey = normalize(adapter);

    if (!adapters.has(adapterKey)) {
      adapters.set(adapterKey, new Map());
    }

    return adapters.get(adapterKey);
  };

  const registry = {
    register: (adapter, type, component) => {
      if (!adapter || !type || !component) {
        throw new Error('register requires adapter, type, and component.');
      }

      ensureAdapter(adapter).set(normalize(type), component);
      return registry;
    },
    registerMany: (adapter, inputs = {}) => {
      Object.entries(inputs).forEach(([type, component]) => {
        registry.register(adapter, type, component);
      });

      return registry;
    },
    get: (adapter, type = 'text') => {
      const bucket = adapters.get(normalize(adapter));

      if (!bucket) {
        return undefined;
      }

      return bucket.get(normalize(type)) || bucket.get('text');
    },
    has: (adapter, type) => {
      const bucket = adapters.get(normalize(adapter));
      return Boolean(bucket?.has(normalize(type)));
    },
    listAdapters: () => Array.from(adapters.keys()),
    listTypes: (adapter) =>
      Array.from(adapters.get(normalize(adapter))?.keys() || []),
    adapters
  };

  Object.entries(initialAdapters).forEach(([adapter, inputs]) => {
    registry.registerMany(adapter, inputs);
  });

  return registry;
}

export const inputRegistry = createInputRegistry({
  mui: {
    text: MuiTextInput,
    string: MuiTextInput,
    email: MuiTextInput,
    password: MuiTextInput,
    number: MuiTextInput,
    select: MuiSelectInput,
    date: MuiDateInput,
    time: MuiTimeInput,
    checkbox: MuiCheckbox,
    switch: MuiSwitch,
    boolean: MuiSwitch,
    group: MuiGroupInput,
    multiselect: MuiGroupInput
  },
  html: {
    text: HtmlTextInput,
    string: HtmlTextInput,
    email: HtmlTextInput,
    password: HtmlTextInput,
    number: HtmlTextInput,
    select: HtmlSelectInput,
    date: HtmlDateInput,
    time: HtmlTimeInput
  },
  editor: {},
  custom: {}
});

export function registerInput(adapter, type, component, registry = inputRegistry) {
  return registry.register(adapter, type, component);
}

export function registerInputs(adapter, inputs, registry = inputRegistry) {
  return registry.registerMany(adapter, inputs);
}

export function getInputComponent({
  adapter = 'mui',
  type = 'text',
  registry = inputRegistry
} = {}) {
  const Component = registry.get(adapter, type);

  platformLog(REGISTRY, 'Resolved component', {
    adapter,
    type,
    found: Boolean(Component),
    componentName: Component?.displayName || Component?.name
  });

  return Component;
}
