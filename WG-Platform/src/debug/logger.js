import { isPlatformDebugEnabled } from './debugConfig.js';
import {
  API,
  CRUD,
  FORM,
  LIST,
  QUERY,
  REGISTRY,
  SYNC,
  VALIDATION
} from './debugScopes.js';

const PREFIXES = Object.freeze({
  [FORM]: 'WG-FORM',
  [CRUD]: 'WG-CRUD',
  [API]: 'WG-API',
  [LIST]: 'WG-LIST',
  [VALIDATION]: 'WG-VALIDATION',
  [REGISTRY]: 'WG-REGISTRY',
  [QUERY]: 'WG-QUERY',
  [SYNC]: 'WG-SYNC'
});

const COLORS = Object.freeze({
  [FORM]: '#2563eb',
  [CRUD]: '#0f766e',
  [API]: '#7c3aed',
  [LIST]: '#ca8a04',
  [VALIDATION]: '#dc2626',
  [REGISTRY]: '#475569',
  [QUERY]: '#0891b2',
  [SYNC]: '#16a34a'
});

const SENSITIVE_KEYS = ['password', 'token', 'authorization', 'secret', 'apikey'];

const isObjectPayload = (value) => value !== null && typeof value === 'object';

const isSensitiveKey = (key) => {
  const normalizedKey = String(key).toLowerCase();
  return SENSITIVE_KEYS.some((sensitiveKey) =>
    normalizedKey.includes(sensitiveKey)
  );
};

const redactValue = (value) => {
  if (!isObjectPayload(value)) {
    return value;
  }

  try {
    return JSON.parse(
      JSON.stringify(value, (key, nestedValue) =>
        key && isSensitiveKey(key) ? '[REDACTED]' : nestedValue
      )
    );
  } catch {
    return value;
  }
};

export function platformLog(scope, ...args) {
  if (!isPlatformDebugEnabled() || typeof console === 'undefined') {
    return;
  }

  const prefix = `[${PREFIXES[scope] || `WG-${String(scope || 'DEBUG')}`}]`;
  const style = `color: ${COLORS[scope] || '#334155'}; font-weight: 700;`;
  const payloadArgs = args.map(redactValue);
  const hasObjectPayload = payloadArgs.some(isObjectPayload);

  if (!hasObjectPayload || typeof console.groupCollapsed !== 'function') {
    console.log(`%c${prefix}`, style, ...payloadArgs);
    return;
  }

  const [firstArg, ...remainingArgs] = payloadArgs;
  const title = typeof firstArg === 'string' ? firstArg : 'Debug';

  console.groupCollapsed(`%c${prefix}%c ${title}`, style, 'font-weight: 400;');

  if (typeof firstArg !== 'string') {
    console.log(firstArg);
  }

  remainingArgs.forEach((arg) => console.log(arg));
  console.groupEnd();
}
