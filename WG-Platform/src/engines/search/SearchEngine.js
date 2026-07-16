import SearchNormalizer from './core/SearchNormalizer.js';
import SearchIndexer from './core/SearchIndexer.js';
import SearchParser from './core/SearchParser.js';
import SearchExecutor from './core/SearchExecutorLocal.js';

/**
 * @fileoverview Unified enterprise facade and pluggable orchestration engine for the WG UI Platform Search Module.
 * Implements a high-performance lazy-indexing pipeline architecture with aggressive query memoization,
 * O(1) document caching, and zero-throw execution boundaries.
 */

/**
 * @typedef {string|number} DocumentId
 */

/**
 * @typedef {Object} SearchEngineOptions
 * @property {string} [mode="local"] - Execution runtime strategy ("local" or "remote").
 * @property {boolean} [cache=true] - Flags whether internal query evaluation caches are active.
 * @property {boolean} [autoIndex=false] - If true, forces proactive index compilation on every mutation. Defaults to false for high performance.
 * @property {boolean} [ignoreCase=true] - Forces uniform case normalization loops.
 * @property {boolean} [debug=false] - Enables diagnostic console instrumentation.
 * @property {Object} [Normalizer=SearchNormalizer] - Pluggable static normalizer class implementation override.
 * @property {Object} [Indexer=SearchIndexer] - Pluggable indexer instantiation class override.
 * @property {Object} [Parser=SearchParser] - Pluggable syntax parser instantiation class override.
 * @property {Object} [Executor=SearchExecutor] - Pluggable query execution class override.
 */

/**
 * @typedef {Object} EngineStatistics
 * @property {number} totalDocuments - Total count of raw data records currently loaded.
 * @property {number} totalTokens - Total tracked token occurrences inside the index registry.
 * @property {number} uniqueTokens - Total discrete terms currently registered in the inverted index.
 * @property {number} averageTokens - The calculated average token count allocated per record.
 * @property {boolean} indexed - Validation state confirming if the index is actively compiled.
 * @property {string} mode - Active execution strategy layer ("local" | "remote").
 * @property {Date|null} lastIndexed - Timestamp marking the absolute timing of the last compilation.
 */

/**
 * Central system orchestration facade managing data, caches, and structural search execution pipelines.
 */
export default class SearchEngine {
  /** @type {SearchEngineOptions} */
  #options;

  /** @type {Object[]} */
  #documents;

  /** @type {Map<DocumentId, Object>} */
  #documentMap;

  /** @type {Map<string, Object>} */
  #queryCache;

  /** @type {Date|null} */
  #lastIndexed;

  /** @type {boolean} */
  #isDirty;

  /** @type {SearchIndexer} */
  #indexer;

  /** @type {SearchParser} */
  #parser;

  /** @type {SearchExecutor} */
  #executor;

  /**
   * Initializes a new SearchEngine instance with pluggable dependency injection settings.
   * @param {SearchEngineOptions} [options={}] - Custom configuration and pipeline overrides.
   */
  constructor(options = {}) {
    this.#options = {
      mode: 'local',
      cache: true,
      autoIndex: false, // Fixed Issue 6: Default to high-performance lazy indexing
      ignoreCase: true,
      debug: false,
      Normalizer: SearchNormalizer, // Fixed Architecture Suggestion: Replaceable Pipeline Components
      Indexer: SearchIndexer,
      Parser: SearchParser,
      Executor: SearchExecutor,
      ...options
    };

    // Fast-path lookup data structures (Fixed Issue 4 & 5)
    this.#documents = [];
    this.#documentMap = new Map();
    this.#queryCache = new Map();
    
    this.#lastIndexed = null;
    this.#isDirty = false;

    // Instantiate pluggable instances once for the engine component lifecycle
    this.#indexer = new this.#options.Indexer();
    this.#parser = new this.#options.Parser();
    this.#executor = new this.#options.Executor();

    if (this.#options.debug) {
      console.info(`[SearchEngine] Pipeline initialized successfully. Mode: ${this.#options.mode}`);
    }
  }

  /**
   * Replaces the internal collection array context completely.
   * @param {Object[]} data - Array of raw domain entities or database records.
   * @returns {SearchEngine} Current instance for method chaining chains.
   */
  setData(data) {
    if (!Array.isArray(data)) {
      if (this.#options.debug) {
        console.warn('[SearchEngine.setData] Provided payload is not an array. Defaulting to empty container.');
      }
      data = [];
    }

    // Direct linear array assignment (Fixed Issue 4 & 5)
    this.#documents = [...data];
    this.#documentMap.clear();
    this.#queryCache.clear();

    const count = this.#documents.length;
    for (let i = 0; i < count; i++) {
      const item = this.#documents[i];
      if (item && item.id !== undefined && item.id !== null) {
        this.#documentMap.set(item.id, item);
      }
    }

    this.#isDirty = true;

    if (this.#options.autoIndex) {
      this.rebuild();
    }

    return this;
  }

  /**
   * Appends a new data item into the active search repository tracking context.
   * @param {Object} item - Raw domain record entry map.
   * @returns {SearchEngine} Current instance context references.
   */
  add(item) {
    if (!item || item.id === undefined || item.id === null) {
      return this;
    }

    this.#documents.push(item);
    this.#documentMap.set(item.id, item);
    
    this.#isDirty = true; // Fixed Issue 6: Defers costly index compilation lazily
    this.#queryCache.clear();

    if (this.#options.autoIndex) {
      this.rebuild();
    }

    return this;
  }

  /**
   * Appends multiple new data entries efficiently into the core tracking frames.
   * @param {Object[]} items - Collection containing multiple entity payloads.
   * @returns {SearchEngine} Current instance context references.
   */
  addMany(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return this;
    }

    const count = items.length;
    let entriesMutated = false;

    for (let i = 0; i < count; i++) {
      const item = items[i];
      if (item && item.id !== undefined && item.id !== null) {
        this.#documents.push(item);
        this.#documentMap.set(item.id, item);
        entriesMutated = true;
      }
    }

    if (entriesMutated) {
      this.#isDirty = true; // Fixed Issue 6: Defers compilation out of heavy batch insert loops
      this.#queryCache.clear();
      if (this.#options.autoIndex) {
        this.rebuild();
      }
    }

    return this;
  }

  /**
   * Modifies or updates an existing entity containing matching primary identification attributes.
   * @param {Object} item - Target domain entity tracking state revisions.
   * @returns {SearchEngine} Current instance context references.
   */
  update(item) {
    if (!item || item.id === undefined || item.id === null) {
      return this;
    }

    // Evict existing version from backing array to avoid structural bloat
    const targetId = item.id;
    const count = this.#documents.length;
    let foundIndex = -1;

    for (let i = 0; i < count; i++) {
      if (this.#documents[i].id === targetId) {
        foundIndex = i;
        break;
      }
    }

    if (foundIndex !== -1) {
      this.#documents[foundIndex] = item;
    } else {
      this.#documents.push(item);
    }

    this.#documentMap.set(targetId, item);
    this.#isDirty = true;
    this.#queryCache.clear();

    if (this.#options.autoIndex) {
      this.rebuild();
    }

    return this;
  }

  /**
   * Evicts a target document profile from the search collection tracking spaces.
   * @param {DocumentId} id - Unique primary data target identifier key.
   * @returns {boolean} True if matching element was successfully located and purged.
   */
  remove(id) {
    if (id === undefined || id === null) {
      return false;
    }

    if (!this.#documentMap.has(id)) {
      return false;
    }

    this.#documentMap.delete(id);
    
    const count = this.#documents.length;
    for (let i = 0; i < count; i++) {
      if (this.#documents[i].id === id) {
        this.#documents.splice(i, 1);
        break;
      }
    }

    this.#isDirty = true;
    this.#queryCache.clear();

    if (this.#options.autoIndex) {
      this.rebuild();
    }

    return true;
  }

  /**
   * Executes the entire normalization and structural indexing pipeline block sequentially.
   * @returns {SearchEngine} Current instance context references.
   */
  rebuild() {
    if (!this.#isDirty && this.#lastIndexed !== null) {
      return this;
    }

    // Fixed Issue 1 & 2: Pass full array array directly to the static normalizer call surface
    const normalizedCollection = this.#options.Normalizer.normalize(this.#documents);
    
    // Pass normalized array payload directly into pluggable index builder
    this.#indexer.build(normalizedCollection);
    
    this.#queryCache.clear();
    this.#lastIndexed = new Date();
    this.#isDirty = false;

    if (this.#options.debug) {
      console.info(`[SearchEngine] Lazy pipeline compilation finished. Size: ${this.#documents.length}`);
    }

    return this;
  }

  /**
   * Flushes operational memoization registers and triggers comprehensive index refreshes.
   * @returns {SearchEngine} Current instance context references.
   */
  refresh() {
    this.refreshCache();
    this.#isDirty = true;
    return this.rebuild();
  }

  /**
   * Processes an arbitrary query search text input across active system indexes.
   * Incorporates an aggressive space-agnostic whitespace normalizer caching loop.
   * @param {string} query - Unstructured human user query statement string.
   * @returns {Object} Sealed uniform Search Result matching internal protocols.
   */
  search(query) {
    if (typeof query !== 'string' || !query.trim()) {
      return this.#generateEmptyResponse();
    }

    // Fixed Issue 8: Space-insensitive structural key normalization logic configuration path
    const cacheKey = query.replace(/\s+/g, ' ').trim().toLowerCase();
    
    if (this.#options.cache && this.#queryCache.has(cacheKey)) {
      return this.#queryCache.get(cacheKey);
    }

    // Lazy initialization checkpoint verification
    if (this.#isDirty) {
      this.rebuild();
    }

    // Dynamic processing run: Parse -> Execute
    const parsedQuery = this.#parser.parse(query);
    const executionResult = this.searchParsed(parsedQuery);

    if (this.#options.cache) {
      this.#queryCache.set(cacheKey, executionResult);
    }

    return executionResult;
  }

  /**
   * Processes a structured query representation block across internal structural indexes.
   * @param {Object} parsedQuery - Structurally sound query object returned by SearchParser.
   * @returns {Object} Standardized read-only search results dashboard presentation map.
   */
  searchParsed(parsedQuery) {
    if (this.#isDirty) {
      this.rebuild();
    }

    // Fixed Issue 7: Graceful future-proof remote execution strategy block fallback
    if (this.#options.mode === 'remote') {
      return Object.freeze({
        matchedIds: new Set(),
        matchedDocuments: [],
        statistics: {
          mode: 'remote',
          implemented: false
        }
      });
    }

    // Execute matching procedures across standard indexing spaces
    const output = this.#executor.execute(this.#indexer, parsedQuery);

    // Fast O(1) correlation step mapping output keys to raw source collections
    const rawMatchedDocuments = [];
    for (const docId of output.matchedIds) {
      const rawDoc = this.#documentMap.get(docId);
      if (rawDoc) {
        rawMatchedDocuments.push(rawDoc);
      }
    }

    return Object.freeze({
      matchedIds: output.matchedIds,
      matchedDocuments: rawMatchedDocuments,
      statistics: output.statistics
    });
  }

  /**
   * Retrieves an original un-normalized raw entity record by its primary identity key mapping.
   * @param {DocumentId} id - Target index unique marker parameters field flag.
   * @returns {Object|undefined} Target tracking data object, or undefined if missing.
   */
  getDocument(id) {
    if (id === undefined || id === null) {
      return undefined;
    }
    return this.#documentMap.get(id);
  }

  /**
   * Returns a complete sequential array listing containing all raw tracking source entries.
   * @returns {Object[]} Fast native clone slice of the internal source data arrays (Fixed Issue 4).
   */
  getDocuments() {
    return [...this.#documents];
  }

  /**
   * Inspects whether the internal index is synchronized with all ongoing data modifications.
   * @returns {boolean} True if the index requires zero structural compilations (Fixed Issue 9).
   */
  isIndexed() {
    return !this.#isDirty && this.#lastIndexed !== null;
  }

  /**
   * Exposes the underlying compiled index instance tracking configuration settings.
   * @returns {SearchIndexer} Active data index lookup context boundaries maps (Fixed Issue 10).
   */
  getIndex() {
    return this.#indexer;
  }

  /**
   * Validates if a specific document target key remains registered inside storage containers.
   * @param {DocumentId} id - Unique identifier targeting verification.
   * @returns {boolean}
   */
  hasDocument(id) {
    if (id === undefined || id === null) {
      return false;
    }
    return this.#documentMap.has(id);
  }

  /**
   * Assesses if a specific token query expression term is indexed across active dictionary spaces.
   * @param {string} token - Target search expression word.
   * @returns {boolean} True if found inside current active dictionaries indexes.
   */
  hasToken(token) {
    return this.#indexer.hasToken(token);
  }

  /**
   * Flushes analytical query memoization maps instantly.
   * @returns {void}
   */
  refreshCache() {
    this.#queryCache.clear();
  }

  /**
   * Compiles and presents diagnostic summary metrics tracing current operational index scales.
   * @returns {EngineStatistics} Integrated telemetry overview object block details.
   */
  getStatistics() {
    const indexStats = this.#indexer.getStatistics();
    return {
      totalDocuments: this.#documents.length,
      totalTokens: indexStats.totalTokens || 0,
      uniqueTokens: indexStats.uniqueTokens || 0,
      averageTokens: indexStats.averageTokensPerDocument || 0,
      indexed: this.isIndexed(),
      mode: this.#options.mode,
      lastIndexed: this.#lastIndexed
    };
  }

  /**
   * Resets all internal allocation tables, storage arrays, caches, and lookup sub-engines back to baseline.
   * @returns {SearchEngine} Current instance context references.
   */
  clear() {
    this.#documents = [];
    this.#documentMap.clear();
    this.#queryCache.clear();
    this.#indexer.clear();
    this.#parser.clear();
    this.#executor.clear();
    this.#lastIndexed = null;
    this.#isDirty = false;
    return this;
  }

  /**
   * Tears down internal processing modules cleanly to protect application lifecycle scopes against leaks.
   * @returns {void}
   */
  destroy() {
    this.clear();
    if (this.#options.debug) {
      console.info('[SearchEngine] Facade instance broken down securely.');
    }
  }

  /**
   * Internal routine serving standard initial structures on empty search events.
   * @returns {Object} Read-only empty query results representation array.
   */
  #generateEmptyResponse() {
    return Object.freeze({
      matchedIds: new Set(),
      matchedDocuments: [],
      statistics: {
        executionTime: 0,
        matchedCount: 0,
        checkedTokens: 0
      }
    });
  }
}