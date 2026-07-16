/**
 * @fileoverview High-performance enterprise search query parser for the WG UI Platform.
 * Converts unstructured user query syntax string structures into highly regularized 
 * flat collections alongside a formal nested Abstract Syntax Tree (AST).
 * Completely decoupled from indexing and execution concerns.
 */

/**
 * @typedef {Object} Token
 * @property {string} type - Lexical category ('LPAREN', 'RPAREN', 'OPERATOR', 'TERM', 'PHRASE', 'FIELD', 'COMPARISON')
 * @property {string} [value] - The extracted text or parameter value
 * @property {string} [field] - The target data property schema field matching context
 * @property {string} [operator] - The relational operator symbol extracted for comparisons
 * @property {boolean} excluded - Indicator flag establishing whether the term is negated/prefixed with a minus
 */

/**
 * @typedef {Object} FieldMatch
 * @property {string} field - The parsed key field identifier.
 * @property {string} value - The associated search query expression value.
 */

/**
 * @typedef {Object} ComparisonMatch
 * @property {string} field - The parsed targeting key field identifier.
 * @property {string} operator - Relational operator token string ('>', '>=', '<', '<=', '=').
 * @property {*} value - Target criteria query expression limit boundary value (coerced numerically if applicable).
 */

/**
 * @typedef {Object} GroupMarker
 * @property {string} raw - The raw sub-query text isolated inside the parentheses.
 * @property {number} startIndex - Absolute character offset marking start boundary.
 * @property {number} endIndex - Absolute character offset marking completion boundary.
 */

/**
 * @typedef {Object} ParserResult
 * @property {string} raw - The original unfiltered raw user input query expression.
 * @property {string[]} terms - Flat list of standard unassigned alphanumeric search tokens.
 * @property {string[]} phrases - Ordered items representing explicit multi-word double-quoted sequences.
 * @property {FieldMatch[]} fields - Collection targeting specialized data classification attributes.
 * @property {string[]} exclusions - Set of all items explicitly marked for removal/omission.
 * @property {ComparisonMatch[]} comparisons - Evaluative relative mathematical criteria definitions.
 * @property {string[]} operators - Array containing explicit Boolean directive words found in string context.
 * @property {GroupMarker[]} groups - Metadata tracking structural paren block bounds.
 * @property {Object} ast - Logical hierarchical representation generated via recursive syntax rules evaluation.
 */

/**
 * Enterprise-grade full-text structural search query parser.
 * Safely evaluates, cleans, and translates human queries into consistent abstract runtime execution trees.
 */
export default class SearchParser {
  /** @type {string} */
  #rawQuery;

  /** @type {Token[]} */
  #tokens;

  /** @type {number} */
  #tokenPointer;

  /**
   * Initializes a new instance of the SearchParser with fresh empty state components.
   */
  constructor() {
    this.#rawQuery = '';
    this.#tokens = [];
    this.#tokenPointer = 0;
  }

  /**
   * Transforms a raw string query into a structured, read-only analytical object pattern map.
   *
   * @param {string} query - Target user query text structure to parse.
   * @throws {TypeError} If the input parameter fails baseline string datatype confirmation.
   * @returns {ParserResult} Immutable collection containing extracted flat attributes alongside the operational query AST.
   */
  parse(query) {
    if (typeof query !== 'string') {
      throw new TypeError('SearchParser.parse: Input argument query must be a valid string.');
    }

    this.clear();
    this.#rawQuery = query;
    this.#tokens = this.tokenize(query);

    const result = {
      raw: this.#rawQuery,
      terms: this.parseTerms(),
      phrases: this.parsePhrases(),
      fields: this.parseFields(),
      exclusions: this.#parseExclusions(),
      comparisons: this.parseComparisons(),
      operators: this.parseOperators(),
      groups: this.parseGroups(),
      ast: this.#buildAST()
    };

    return this.#deepFreeze(result);
  }

  /**
   * Performs lexical analysis on a string expression to generate an ordered sequence of semantic token definitions.
   *
   * @param {string} query - Target string context source.
   * @returns {Token[]} An ordered collection of parsed tokens.
   */
  tokenize(query) {
    if (!query || typeof query !== 'string') {
      return [];
    }

    const tokens = [];
    let i = 0;
    const len = query.length;

    while (i < len) {
      let char = query[i];

      // Bypass blank spacing configurations
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      let isExcluded = false;
      if (char === '-') {
        // Enforce boundary validation to differentiate query exclusions from inner word hyphens
        if (i + 1 < len && !/\s/.test(query[i + 1]) && query[i + 1] !== ')') {
          isExcluded = true;
          i++;
          char = query[i];
        }
      }

      // Identify boundary grouping controls
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(', excluded: isExcluded });
        i++;
        continue;
      }
      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')' });
        i++;
        continue;
      }

      // Capture explicit string sequence literals wrapped in double-quotes
      if (char === '"') {
        i++; // Step past beginning quote boundary marker
        let phraseVal = '';
        while (i < len && query[i] !== '"') {
          if (query[i] === '\\' && i + 1 < len) {
            i++; // Handle escape paths
          }
          phraseVal += query[i];
          i++;
        }
        i++; // Step past closing quote boundary marker
        tokens.push({
          type: 'PHRASE',
          value: phraseVal,
          excluded: isExcluded
        });
        continue;
      }

      // Extract continuous contiguous alphanumeric characters block bounds
      const start = i;
      while (i < len && !/\s|\(|\)/.test(query[i])) {
        i++;
      }
      const rawToken = query.slice(start, i);
      if (!rawToken) {
        continue;
      }

      // Check logical condition operators if not directly mutated via exclusion token flags
      if (!isExcluded) {
        const upperToken = rawToken.toUpperCase();
        if (upperToken === 'AND' || upperToken === 'OR' || upperToken === 'NOT') {
          tokens.push({ type: 'OPERATOR', value: upperToken, excluded: false });
          continue;
        }
      }

      // Evaluate advanced conditional criteria ranges (e.g., price>=5000)
      const compMatch = rawToken.match(/^([\w\-.]+)(>=|<=|>|<|=)(.+)$/);
      if (compMatch) {
        tokens.push({
          type: 'COMPARISON',
          field: compMatch[1],
          operator: compMatch[2],
          value: compMatch[3],
          excluded: isExcluded
        });
        continue;
      }

      // Evaluate attribute specific contextual definitions (e.g., brand:apple)
      const fieldMatch = rawToken.match(/^([\w\-.]+):(.+)$/);
      if (fieldMatch) {
        tokens.push({
          type: 'FIELD',
          field: fieldMatch[1],
          value: fieldMatch[2],
          excluded: isExcluded
        });
        continue;
      }

      // Default contextual assignment: Standard alphanumeric search term expression
      tokens.push({
        type: 'TERM',
        value: rawToken,
        excluded: isExcluded
      });
    }

    return tokens;
  }

  /**
   * Filters out standard non-excluded individual term literals.
   *
   * @returns {string[]} An array of normalized terms.
   */
  parseTerms() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.type === 'TERM' && !token.excluded) {
        results.push(this.normalizeToken(token.value));
      }
    }
    return results;
  }

  /**
   * Extracts non-excluded literal text segments declared within standard quote marks parameters.
   *
   * @returns {string[]} An array of isolated phrase strings.
   */
  parsePhrases() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.type === 'PHRASE' && !token.excluded) {
        results.push(token.value.trim());
      }
    }
    return results;
  }

  /**
   * Isolates structural criteria definitions associated explicitly with schemas metadata properties.
   *
   * @returns {FieldMatch[]} Collection of matching structural metadata parameter pairs.
   */
  parseFields() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.type === 'FIELD' && !token.excluded) {
        results.push({
          field: this.normalizeToken(token.field),
          value: token.value
        });
      }
    }
    return results;
  }

  /**
   * Collects numerical and string comparison evaluation requirements mapped against unique schema properties.
   *
   * @returns {ComparisonMatch[]} Set of identified property range match specifications.
   */
  parseComparisons() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.type === 'COMPARISON' && !token.excluded) {
        const rawVal = token.value;
        const parsedNum = Number(rawVal);
        const processedVal = !isNaN(parsedNum) && rawVal.trim() !== '' ? parsedNum : rawVal;

        results.push({
          field: this.normalizeToken(token.field),
          operator: token.operator,
          value: processedVal
        });
      }
    }
    return results;
  }

  /**
   * Compiles sequential list tracking all explicitly declared Boolean query instruction tokens found in source context.
   *
   * @returns {string[]} Formatted operators string listing array.
   */
  parseOperators() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.type === 'OPERATOR') {
        results.push(token.value);
      }
    }
    return results;
  }

  /**
   * Maps positional text markers tracing structural parenthesis block segments identified throughout the raw query context.
   *
   * @returns {GroupMarker[]} Isolated layout tracking definitions configuration bounds.
   */
  parseGroups() {
    const groups = [];
    const stack = [];
    const queryStr = this.#rawQuery;
    const len = queryStr.length;

    for (let i = 0; i < len; i++) {
      if (queryStr[i] === '(') {
        stack.push(i);
      } else if (queryStr[i] === ')') {
        if (stack.length > 0) {
          const start = stack.pop();
          groups.push({
            raw: queryStr.slice(start, i + 1),
            startIndex: start,
            endIndex: i
          });
        }
      }
    }
    return groups;
  }

  /**
   * Performs standard uniform cleaning and normal casing adjustments across token identifiers.
   *
   * @param {string} token - Raw value parameter.
   * @returns {string} Fully cleaned, lowercased, and trimmed output.
   */
  normalizeToken(token) {
    if (typeof token !== 'string') {
      return '';
    }
    return token.trim().toLowerCase();
  }

  /**
   * Clears internal trackers to re-initialize an pristine instance context.
   *
   * @returns {SearchParser} Current instance for method chaining convenience routines.
   */
  clear() {
    this.#rawQuery = '';
    this.#tokens = [];
    this.#tokenPointer = 0;
    return this;
  }

  /**
   * Internal routine collecting all token expressions explicitly prefixed with exclusion indicators.
   *
   * @returns {string[]} Array of identified negated strings or conditional raw parameters.
   */
  #parseExclusions() {
    const results = [];
    const count = this.#tokens.length;
    for (let i = 0; i < count; i++) {
      const token = this.#tokens[i];
      if (token.excluded) {
        if (token.type === 'TERM' || token.type === 'PHRASE') {
          results.push(token.value);
        } else if (token.type === 'FIELD') {
          results.push(`${token.field}:${token.value}`);
        } else if (token.type === 'COMPARISON') {
          results.push(`${token.field}${token.operator}${token.value}`);
        }
      }
    }
    return results;
  }

  /**
   * Initiates Recursive Descent parsing over standard token sequences to construct the formal nested logical AST.
   *
   * @returns {Object} Tree mapping operator configurations or leaf entity structural statements.
   */
  #buildAST() {
    if (this.#tokens.length === 0) {
      return {};
    }
    this.#tokenPointer = 0;
    const rootNode = this.#parseExpression();
    return rootNode || {};
  }

  /**
   * Evaluates expressions governed under the lowest precedence constraints (Logical 'OR' blocks).
   *
   * @returns {Object|null} Node definition mapping branch states.
   */
  #parseExpression() {
    let node = this.#parseAndExpression();

    while (this.#match('OPERATOR', 'OR')) {
      this.#consume();
      const rightNode = this.#parseAndExpression();
      node = {
        type: 'LOGICAL',
        operator: 'OR',
        left: node,
        right: rightNode
      };
    }
    return node;
  }

  /**
   * Evaluates expressions governed under medium precedence rules (Explicit or Implicit 'AND' combinations).
   *
   * @returns {Object|null} Node structure layout.
   */
  #parseAndExpression() {
    let node = this.#parseNotExpression();

    // Accounts for both explicit Boolean operator parameters and implicit spatial conjunction scenarios
    while (this.#check('OPERATOR', 'AND') || this.#isPrimaryStart()) {
      if (this.#check('OPERATOR', 'AND')) {
        this.#consume();
      }
      const rightNode = this.#parseNotExpression();
      node = {
        type: 'LOGICAL',
        operator: 'AND',
        left: node,
        right: rightNode
      };
    }
    return node;
  }

  /**
   * Evaluates explicit unitary operational negative modifiers (Logical Boolean 'NOT' prefixes).
   *
   * @returns {Object|null} Shifted branch state or primary structural expression fallback layer.
   */
  #parseNotExpression() {
    if (this.#match('OPERATOR', 'NOT')) {
      this.#consume();
      const operandNode = this.#parseNotExpression();
      return {
        type: 'NOT',
        operand: operandNode
      };
    }
    return this.#parsePrimary();
  }

  /**
   * Resolves execution leaf definitions or structural inner scoped parenthetical sub-expressions.
   *
   * @returns {Object|null} Structural terminal AST block or inner nested query sub-tree context details.
   */
  #parsePrimary() {
    const token = this.#peek();
    if (!token) {
      return null;
    }

    if (token.type === 'LPAREN') {
      const isGroupExcluded = token.excluded;
      this.#consume(); // Safely skip starting left parenthesis marker

      const innerSubExpressionNode = this.#parseExpression();

      // Gracefully step past termination markers protecting parsing pipeline stability
      this.#consume('RPAREN');

      let node = innerSubExpressionNode;
      if (isGroupExcluded && node) {
        node = {
          type: 'NOT',
          operand: node
        };
      }
      return node;
    }

    const activeToken = this.#consume();
    let node = null;

    switch (activeToken.type) {
      case 'TERM': {
        node = {
          type: 'TERM',
          value: this.normalizeToken(activeToken.value)
        };
        break;
      }
      case 'PHRASE': {
        node = {
          type: 'PHRASE',
          value: activeToken.value.trim()
        };
        break;
      }
      case 'FIELD': {
        node = {
          type: 'FIELD',
          field: this.normalizeToken(activeToken.field),
          value: activeToken.value
        };
        break;
      }
      case 'COMPARISON': {
        const rawVal = activeToken.value;
        const parsedNum = Number(rawVal);
        const processedVal = !isNaN(parsedNum) && rawVal.trim() !== '' ? parsedNum : rawVal;

        node = {
          type: 'COMPARISON',
          field: this.normalizeToken(activeToken.field),
          operator: activeToken.operator,
          value: processedVal
        };
        break;
      }
      default: {
        node = {
          type: 'TERM',
          value: this.normalizeToken(activeToken.value || '')
        };
      }
    }

    // Wrap in standard 'NOT' node if the terminal node was marked with exclusion prefix
    if (activeToken.excluded && node) {
      node = {
        type: 'NOT',
        operand: node
      };
    }

    return node;
  }

  /**
   * Helper confirming if the tracking cursor currently points to a valid sequence start definition block.
   *
   * @returns {boolean} True if token fits category conditions.
   */
  #isPrimaryStart() {
    const token = this.#peek();
    if (!token) {
      return false;
    }
    return token.type === 'TERM' ||
           token.type === 'PHRASE' ||
           token.type === 'FIELD' ||
           token.type === 'COMPARISON' ||
           token.type === 'LPAREN';
  }

  /**
   * Retrieves reference for the item positioned directly beneath the scanning index pointer.
   *
   * @returns {Token|null} Target metadata object context definition.
   */
  #peek() {
    if (this.#tokenPointer >= this.#tokens.length) {
      return null;
    }
    return this.#tokens[this.#tokenPointer];
  }

  /**
   * Validates if structural category tracking states match explicit type constraints.
   *
   * @param {string} type - Lexical token type to verify.
   * @param {string} [value] - Optional explicit identity value constraints.
   * @returns {boolean}
   */
  #check(type, value) {
    const token = this.#peek();
    if (!token) {
      return false;
    }
    if (token.type !== type) {
      return false;
    }
    if (value !== undefined && token.value !== value) {
      return false;
    }
    return true;
  }

  /**
   * Functional mirror mapping for lookahead validation logic configurations.
   *
   * @param {string} type - Target validation classification.
   * @param {string} [value] - Target value attribute match rule.
   * @returns {boolean}
   */
  #match(type, value) {
    return this.#check(type, value);
  }

  /**
   * advances the sequence selection reading cursor forward while providing defensive validation routines.
   *
   * @param {string} [expectedType] - Optional type matching assertion value check.
   * @returns {Token} The consumed token descriptor context object.
   */
  #consume(expectedType) {
    const currentToken = this.#peek();
    if (!currentToken) {
      return { type: 'EOF', value: '', excluded: false };
    }
    if (expectedType && currentToken.type !== expectedType) {
      // Graceful structural recovery execution: skip updating pointer but pass token along safely
      return currentToken;
    }
    this.#tokenPointer++;
    return currentToken;
  }

  /**
   * Deeply freezes an object tree structure recursively to enforce absolute payload immutability.
   *
   * @param {Object} obj - Target entity framework object structure.
   * @returns {Object} Immutably sealed payload result block.
   */
  #deepFreeze(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const propNames = Object.getOwnPropertyNames(obj);
    const count = propNames.length;
    for (let i = 0; i < count; i++) {
      const name = propNames[i];
      const value = obj[name];
      if (value !== null && typeof value === 'object') {
        this.#deepFreeze(value);
      }
    }
    return Object.freeze(obj);
  }
}