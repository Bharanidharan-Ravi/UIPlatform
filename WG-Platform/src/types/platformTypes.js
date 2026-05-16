/**
 * @typedef {Object} PlatformField
 * @property {string} name
 * @property {string} [label]
 * @property {string} [type]
 * @property {string} [adapter]
 * @property {Array} [options]
 * @property {*} [defaultValue]
 */

/**
 * @typedef {Object} PlatformListState
 * @property {number} page
 * @property {number} pageSize
 * @property {Array} sort
 * @property {Object} filters
 * @property {string} search
 */

export const platformTypeNames = Object.freeze({
  field: 'PlatformField',
  listState: 'PlatformListState'
});
