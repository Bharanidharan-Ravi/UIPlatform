/**
 * @fileoverview High-performance enterprise search indexer V2 for the WG UI Platform.
 * Provides inverted mapping indexes for rapid full-text, field-level, prefix, and contains query matches.
 * Optimized for large datasets with minimal object allocation, token dictionary lookups, and specialized caching.
 */

/**
 * @typedef {string|number} DocumentId
 */

/**
 * @typedef {Object} NormalizedDocument
 * @property {DocumentId} id - Unique identifier for the document.
 * @property {Object<string, string|string[]>} fields - Map of field names to either a raw string or an array of tokenized strings.
 */

/**
 * @typedef {Object} IndexerStatistics
 * @property {number} totalDocuments - Total number of indexed documents.
 * @property {number} totalTokens - Total count of token positions tracked.
 * @property {number} uniqueTokens - Total number of unique tokens indexed.
 * @property {number} averageTokensPerDocument - The average number of tokens across all documents.
 */

/**
 * Enterprise-grade full-text search indexer.
 * Builds and stores inverted indexes from normalized document payloads.
 */
export default class SearchIndexer {
  /** @type {NormalizedDocument[]} */
  #documents;

  /** @type {Map<DocumentId, NormalizedDocument>} */
  #documentMap;

  /** @type {Map<string, Set<DocumentId>>} */
  #tokenIndex;

  /** @type {Map<string, Map<string, Set<DocumentId>>>} */
  #fieldIndex;

  /** @type {Map<string, Set<DocumentId>>} */
  #prefixCache;

  /** @type {Map<string, Set<DocumentId>>} */
  #containsCache;

  /** @type {number} */
  #totalTokens;

  /**
   * Initializes a new instance of the SearchIndexer with empty internal structures.
   */
  constructor() {
    this.#documents = [];
    this.#documentMap = new Map();
    this.#tokenIndex = new Map();
    this.#fieldIndex = new Map();
    this.#prefixCache = new Map();
    this.#containsCache = new Map();
    this.#totalTokens = 0;
  }

  /**
   * Total number of indexed documents.
   * @returns {number}
   */
  get totalDocuments() {
    return this.#documentMap.size;
  }

  /**
   * Total count of token positions/occurrences tracked across the collection.
   * @returns {number}
   */
  get totalTokens() {
    return this.#totalTokens;
  }

  /**
   * Total number of unique tokens indexed.
   * @returns {number}
   */
  get uniqueTokens() {
    return this.#tokenIndex.size;
  }

  /**
   * The calculated average number of tokens allocated per registered document.
   * @returns {number}
   */
  get averageTokensPerDocument() {
    if (this.totalDocuments === 0) {
      return 0;
    }
    return this.#totalTokens / this.totalDocuments;
  }

  /**
   * Builds the internal search structures using an array of normalized documents.
   * Resets any existing index data before execution.
   *
   * @param {NormalizedDocument[]} documents - Array of normalized documents derived from SearchNormalizer.
   * @throws {TypeError} If input is null, undefined, or incorrectly structured.
   * @returns {SearchIndexer} Current instance for method chaining.
   */
  build(documents) {
    if (!Array.isArray(documents)) {
      throw new TypeError('SearchIndexer.build: Input payload must be a valid Array.');
    }

    this.clear();
    this.#documents = documents;

    const totalDocs = this.#documents.length;

    // Optimized standard loop configuration to prevent iterator allocation overhead on large arrays
    for (let i = 0; i < totalDocs; i++) {
      const doc = this.#documents[i];

      // Strict Validation Constraints
      if (!doc || typeof doc !== 'object') {
        throw new TypeError(`SearchIndexer.build: Malformed document entry at index ${i}.`);
      }
      if (doc.id === undefined || doc.id === null || doc.id === '') {
        throw new TypeError(`SearchIndexer.build: Missing required unique 'id' at index ${i}.`);
      }
      if (!doc.fields || typeof doc.fields !== 'object') {
        throw new TypeError(`SearchIndexer.build: Missing or invalid 'fields' collection for document ID: ${doc.id}`);
      }

      const docId = doc.id;
      this.#documentMap.set(docId, doc);

      const fieldsKeys = Object.keys(doc.fields);
      const fieldsCount = fieldsKeys.length;

      for (let j = 0; j < fieldsCount; j++) {
        const rawFieldName = fieldsKeys[j];
        const fieldName = String(rawFieldName).trim();
        const fieldValue = doc.fields[rawFieldName];

        // Safely normalize mixed string or array payloads into token arrays
        const tokens = Array.isArray(fieldValue)
          ? fieldValue
          : String(fieldValue || '').split(/\s+/).filter(Boolean);

        const tokenCount = tokens.length;
        for (let k = 0; k < tokenCount; k++) {
          const token = String(tokens[k]).toLowerCase();

          // Ignore empty or whitespace-only tokens
          if (!token) {
            continue;
          }

          this.#totalTokens++;

          // 1. Process Global Inverted Index
          let globalSet = this.#tokenIndex.get(token);
          if (globalSet === undefined) {
            globalSet = new Set();
            this.#tokenIndex.set(token, globalSet);
          }
          globalSet.add(docId);

          // 2. Process Field-Specific Inverted Index
          let fieldMap = this.#fieldIndex.get(fieldName);
          if (fieldMap === undefined) {
            fieldMap = new Map();
            this.#fieldIndex.set(fieldName, fieldMap);
          }

          let fieldSet = fieldMap.get(token);
          if (fieldSet === undefined) {
            fieldSet = new Set();
            fieldMap.set(token, fieldSet);
          }
          fieldSet.add(docId);
        }
      }
    }

    return this;
  }

  /**
   * Retrieves a document from the system by its primary unique identifier.
   *
   * @param {DocumentId} id - The unique key identifier of the document.
   * @returns {NormalizedDocument|undefined} The associated normalized object context, or undefined if missing.
   */
  getDocument(id) {
    if (id === undefined || id === null) {
      return undefined;
    }
    return this.#documentMap.get(id);
  }

  /**
   * Returns a complete defensive clone array representation of all registered index documents.
   *
   * @returns {NormalizedDocument[]}
   */
  getDocuments() {
    return [...this.#documents];
  }

  /**
   * Evaluates whether a given document ID exists within the primary lookup registry.
   *
   * @param {DocumentId} id - The unique key identifier of the document.
   * @returns {boolean} True if the document map contains the ID, otherwise false.
   */
  hasDocument(id) {
    if (id === undefined || id === null) {
      return false;
    }
    return this.#documentMap.has(id);
  }

  /**
   * Fetches all unique document identifiers that match a global search token expression.
   * Internal lookup is performed using the lowercase representation of the query token.
   * Returns a copy clone of the underlying set data context to protect index state integrity.
   *
   * @param {string} token - Target search word token.
   * @returns {Set<DocumentId>} A Set containing match IDs.
   */
  getTokenMatches(token) {
    if (typeof token !== 'string' || !token) {
      return new Set();
    }
    const matches = this.#tokenIndex.get(token.toLowerCase());
    return matches ? new Set(matches) : new Set();
  }

  /**
   * Fetches all unique document identifiers matching a target search token isolated to a specified schema key field.
   * Internal lookup is performed using the lowercase representation of the query token.
   * Returns a copy clone of the underlying set data context to protect index state integrity.
   *
   * @param {string} field - Target property field category configuration context.
   * @param {string} token - Target search word token.
   * @returns {Set<DocumentId>} A Set containing match IDs within the given field category context.
   */
  getFieldMatches(field, token) {
    if (typeof field !== 'string' || typeof token !== 'string' || !field || !token) {
      return new Set();
    }

    const fieldMap = this.#fieldIndex.get(field.trim());
    if (fieldMap === undefined) {
      return new Set();
    }

    const matches = fieldMap.get(token.toLowerCase());
    return matches ? new Set(matches) : new Set();
  }

  /**
   * Searches the unique token dictionary keys for all terms starting with the search expression.
   * Aggregates and merges all matching document references via an internal optimization cache.
   *
   * @param {string} token - The prefix expression string to match against.
   * @returns {Set<DocumentId>} A defensive clone copy of the aggregated document ID matches.
   */

  #mergeSets(target, source) {

    if (!source) return;

    for (const id of source) {

      target.add(id);

    }

  }
  getPrefixMatches(token) {
    if (typeof token !== 'string' || !token) {
      return new Set();
    }

    const targetPrefix = token.trim().toLowerCase();

    // Check optimization cache layer
    if (this.#prefixCache.has(targetPrefix)) {
      return new Set(this.#prefixCache.get(targetPrefix));
    }

    const aggregatedSet = new Set();
    const tokenIterator = this.#tokenIndex.keys();

    // Fast-path iteration over token dictionary keys to avoid looping documents
    for (const indexedToken of tokenIterator) {
      if (indexedToken.startsWith(targetPrefix)) {
        const matchingIds = this.#tokenIndex.get(indexedToken);
        if (matchingIds !== undefined) {
          this.#mergeSets(
            aggregatedSet,
            matchingIds
          );
        }
      }
    }

    // Persist to cache and return a secure copy
    this.#prefixCache.set(targetPrefix, aggregatedSet);
    return new Set(aggregatedSet);
  }

  /**
   * Searches the unique token dictionary keys for all terms containing the search expression substring.
   * Aggregates and merges all matching document references via an internal optimization cache.
   *
   * @param {string} token - The substring expression to scan for.
   * @returns {Set<DocumentId>} A defensive clone copy of the aggregated document ID matches.
   */
  getContainsMatches(token) {
    if (typeof token !== 'string' || !token) {
      return new Set();
    }

    const targetSubstring = token.toLowerCase();

    // Check optimization cache layer
    if (this.#containsCache.has(targetSubstring)) {
      return new Set(this.#containsCache.get(targetSubstring));
    }

    const aggregatedSet = new Set();
    const tokenIterator = this.#tokenIndex.keys();

    // Fast-path iteration over token dictionary keys to avoid looping documents
    for (const indexedToken of tokenIterator) {
      if (indexedToken.includes(targetSubstring)) {
        const matchingIds = this.#tokenIndex.get(indexedToken);
        if (matchingIds !== undefined) {
          for (const docId of matchingIds) {
            aggregatedSet.add(docId);
          }
        }
      }
    }

    // Persist to cache and return a secure copy
    this.#containsCache.set(targetSubstring, aggregatedSet);
    return new Set(aggregatedSet);
  }
  getMatches(token, matchMode = "exact") {

    switch (matchMode) {

      case "prefix":
        return this.getPrefixMatches(token);

      case "contains":
        return this.getContainsMatches(token);

      case "exact":
      default:
        return this.getTokenMatches(token);

    }

  }
  /**
   * Inspects if a target token exists globally within the active inverted space registry.
   *
   * @param {string} token - Target checking expression token.
   * @returns {boolean}
   */
  hasToken(token) {
    if (typeof token !== 'string' || !token) {
      return false;
    }
    return this.#tokenIndex.has(token.toLowerCase());
  }

  /**
   * Compiles and exports an aggregated statistics overview of the current index state.
   *
   * @returns {IndexerStatistics} Consolidated indexer statistics payload object.
   */
  getStatistics() {
    return {
      totalDocuments: this.totalDocuments,
      totalTokens: this.totalTokens,
      uniqueTokens: this.uniqueTokens,
      averageTokensPerDocument: this.averageTokensPerDocument
    };
  }

  /**
   * Extracts an array containing all unique indexed tokens. 
   * Useful for autocompletion systems, diagnostic operations, or debugging procedures.
   *
   * @returns {string[]} An array containing all unique dictionary tokens.
   */
  getAllTokens() {
    return [...this.#tokenIndex.keys()];
  }

  /**
   * Resets all internal lookup registers, structures, and counters back to their original state.
   * Releases structural allocations for efficient garbage collection cleanup routines.
   *
   * @returns {SearchIndexer} Current instance context structure for method chaining routines.
   */
  clear() {
    this.#documents = [];
    this.#documentMap.clear();
    this.#tokenIndex.clear();
    this.#fieldIndex.clear();
    this.#prefixCache.clear();
    this.#containsCache.clear();
    this.#totalTokens = 0;
    return this;
  }


  /**
   * Destroys the indexer instance safely by cleaning up allocated internal data structures.
   * Ideal for framework component lifecycle dismount states (e.g., React Provider unmounts).
   *
   * @returns {void}
   */
  destroy() {
    this.clear();
  }
}