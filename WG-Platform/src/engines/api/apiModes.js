export const GLOBAL = 'global';
export const LOCAL = 'local';
export const SILENT = 'silent';

export const API_MODES = Object.freeze({
  GLOBAL,
  LOCAL,
  SILENT
});

export function normalizeApiMode(mode = GLOBAL) {
  const normalizedMode = String(mode || GLOBAL).toLowerCase();
  return Object.values(API_MODES).includes(normalizedMode)
    ? normalizedMode
    : GLOBAL;
}
