/**
 * =============================================================================
 * SearchNormalizer
 * =============================================================================
 *
 * Converts any object into a normalized searchable document.
 *
 * Responsibilities
 * ----------------
 * ✔ Flatten nested objects
 * ✔ Convert arrays
 * ✔ Normalize strings
 * ✔ Remove null values
 * ✔ Lowercase
 * ✔ Trim
 * ✔ Remove duplicate spaces
 * ✔ Keep original object
 *
 * Used by:
 * SearchIndexer
 *
 * =============================================================================
 */

export default class SearchNormalizer {
  static DEFAULT_OPTIONS = {
    includeFields: null,

    excludeFields: [],

    ignoreNull: true,

    removeDuplicateTokens: true,

    lowercase: true,
  };
  /**
   * Normalize complete dataset
   *
   * @param {Array} data
   * @param {Object} options
   * @returns {Array}
   */
  static normalize(data = [], options = {}) {
    options = {
      ...this.DEFAULT_OPTIONS,
      ...options,
    };

    if (!Array.isArray(data)) return [];

    return data.map((item) => this.normalizeItem(item, options));
  }

  /**
   * Normalize one object
   *
   * @param {Object} item
   * @param {Object} options
   * @returns {Object}
   */
  static extractId(item) {
    return (
      item.id ??
      item.Id ??
      item.ID ??
      item.uuid ??
      item.UUID ??
      item.guid ??
      item.Guid ??
      item.key ??
      null
    );
  }
  static normalizeItem(item = {}, options = {}) {
    const fields = {};

    this.flatten(item, "", fields, options);

    const tokens = [
      ...new Set(Object.values(fields).join(" ").split(/\s+/).filter(Boolean)),
    ];

    const searchText = tokens.join(" ");
    const id = this.extractId(item);
    return {
      id,

      original: item,

      fields,

      tokens,

      searchText,

      metadata: {
        fieldCount: Object.keys(fields).length,

        tokenCount: tokens.length,
      },
    };
  }

  /**
   * Flatten object recursively
   */
  static flatten(value, path, result, options) {
    if (value === undefined || value === null) return;

    //--------------------------------------
    // Primitive
    //--------------------------------------

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      if (path) result[path] = this.clean(value);

      return;
    }

    //--------------------------------------
    // Date
    //--------------------------------------

    if (value instanceof Date) {
      result[path] = value.toISOString();

      return;
    }

    //--------------------------------------
    // Array
    //--------------------------------------

    if (Array.isArray(value)) {
      const values = [];

      value.forEach((item, index) => {
        if (item == null) return;

        if (typeof item === "object") {
          this.flatten(item, `${path}_${index}`, result, options);

          return;
        }

        values.push(this.clean(item));
      });

      if (values.length) result[path] = values.join(" ");

      return;
    }
    //--------------------------------------
    // Object
    //--------------------------------------

    Object.keys(value).forEach((key) => {
      if (options.excludeFields.includes(key)) return;
      const newPath = path ? `${path}_${key}` : key;

      this.flatten(value[key], newPath, result, options);
    });
  }

  /**
   * Normalize string
   */
  static clean(value) {
    if (value === undefined || value === null) return "";

    return String(value)
      .normalize("NFKD")

      .replace(/[\u0300-\u036f]/g, "")

      .replace(/[^\w\s.-]/g, " ")

      .replace(/\s+/g, " ")

      .trim()

      .toLowerCase();
  }

  /**
   * Extract searchable text
   */
  static extractText(item) {
    const normalized = this.normalizeItem(item);

    return normalized.searchText;
  }
}
