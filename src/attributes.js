/**
 * Graphology Attributes methods
 * ==============================
 *
 * Attributes-related methods being exactly the same for nodes & edges,
 * we abstract them here for factorization reasons.
 */
import {
  assign,
  isPlainObject,
  getMatchingEdge
} from './utils';

import {
  InvalidArgumentsGraphError,
  NotFoundGraphError,
  UsageGraphError
} from './errors';

/**
 * Attach an attribute getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeGetter(Class, method, checker, type) {

  /**
   * Get the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {mixed}          - The attribute's value.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, name) {
    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    const data = this._edges.get(element);

    return data.attributes[name];
  };
}

/**
 * Attach an attributes getter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesGetter(Class, method, checker, type) {

  /**
   * Retrieves all the target element's attributes.
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   *
   * @return {object}          - The element's attributes.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element) {
    if (arguments.length > 1) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + arguments[1];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    const data = this._edges.get(element);

    return data.attributes;
  };
}

/**
 * Attach an attribute checker method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeChecker(Class, method, checker, type) {

  /**
   * Checks whether the desired attribute is set for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {boolean}
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, name) {
    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    const data = this._edges.get(element);

    return data.attributes.hasOwnProperty(name);
  };
}

/**
 * Attach an attribute setter method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeSetter(Class, method, checker, type) {

  /**
   * Set the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   * @param  {mixed}  value   - New attribute value.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, name, value) {
    if (arguments.length > 3) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];
      value = arguments[3];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    const data = this._edges.get(element);

    data.attributes[name] = value;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'set',
      meta: {
        name,
        value
      }
    });

    return this;
  };
}

/**
 * Attach an attribute updater method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeUpdater(Class, method, checker, type) {

  /**
   * Update the desired attribute for the given element (node or edge) using
   * the provided function.
   *
   * Arity 2:
   * @param  {any}      element - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * Arity 3 (only for edges):
   * @param  {any}      source  - Source element.
   * @param  {any}      target  - Target element.
   * @param  {string}   name    - Attribute's name.
   * @param  {function} updater - Updater function.
   *
   * @return {Graph}            - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, name, updater) {
    if (arguments.length > 3) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];
      updater = arguments[3];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    if (typeof updater !== 'function')
      throw new InvalidArgumentsGraphError(`Graph.${method}: updater should be a function.`);

    const data = this._edges.get(element);

    data.attributes[name] = updater(data.attributes[name]);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'set',
      meta: {
        name,
        value: data.attributes[name]
      }
    });

    return this;
  };
}

/**
 * Attach an attribute remover method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributeRemover(Class, method, checker, type) {

  /**
   * Remove the desired attribute for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element - Target element.
   * @param  {string} name    - Attribute's name.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source - Source element.
   * @param  {any}     target - Target element.
   * @param  {string}  name   - Attribute's name.
   *
   * @return {Graph}          - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, name) {
    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + name;

      name = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    const data = this._edges.get(element);

    delete data.attributes[name];

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'remove',
      meta: {
        name
      }
    });

    return this;
  };
}

/**
 * Attach an attribute replacer method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesReplacer(Class, method, checker, type) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - New attributes.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - New attributes.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, attributes) {
    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + attributes;

      attributes = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    const data = this._edges.get(element);

    const oldAttributes = data.attributes;

    data.attributes = attributes;

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'replace',
      meta: {
        before: oldAttributes,
        after: attributes
      }
    });

    return this;
  };
}

/**
 * Attach an attribute merger method onto the provided class.
 *
 * @param {function} Class       - Target class.
 * @param {string}   method      - Method name.
 * @param {string}   checker     - Name of the checker method to use.
 * @param {string}   type        - Type of the edge to find.
 */
function attachAttributesMerger(Class, method, checker, type) {

  /**
   * Replace the attributes for the given element (node or edge).
   *
   * Arity 2:
   * @param  {any}    element    - Target element.
   * @param  {object} attributes - Attributes to merge.
   *
   * Arity 3 (only for edges):
   * @param  {any}     source     - Source element.
   * @param  {any}     target     - Target element.
   * @param  {object}  attributes - Attributes to merge.
   *
   * @return {Graph}              - Returns itself for chaining.
   *
   * @throws {Error} - Will throw if too many arguments are provided.
   * @throws {Error} - Will throw if any of the elements is not found.
   */
  Class.prototype[method] = function(element, attributes) {
    if (arguments.length > 2) {

      if (this.multi)
        throw new UsageGraphError(`Graph.${method}: cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about.`);

      const source = '' + element,
            target = '' + attributes;

      attributes = arguments[2];

      if (!this[checker](source, target))
        throw new NotFoundGraphError(`Graph.${method}: could not find an edge for the given path ("${source}" - "${target}").`);

      element = getMatchingEdge(this, source, target, type);
    }
    else {
      element = '' + element;
    }

    if (!this[checker](element))
      throw new NotFoundGraphError(`Graph.${method}: could not find the "${element}" edge in the graph.`);

    if (!isPlainObject(attributes))
      throw new InvalidArgumentsGraphError(`Graph.${method}: provided attributes are not a plain object.`);

    const data = this._edges.get(element);

    assign(data.attributes, attributes);

    // Emitting
    this.emit('edgeAttributesUpdated', {
      key: element,
      type: 'merge',
      meta: {
        data: attributes
      }
    });

    return this;
  };
}

/**
 * List of methods to attach.
 */
const ATTRIBUTES_METHODS = [
  {
    name: element => `get${element}Attribute`,
    attacher: attachAttributeGetter
  },
  {
    name: element => `get${element}Attributes`,
    attacher: attachAttributesGetter
  },
  {
    name: element => `has${element}Attribute`,
    attacher: attachAttributeChecker
  },
  {
    name: element => `set${element}Attribute`,
    attacher: attachAttributeSetter
  },
  {
    name: element => `update${element}Attribute`,
    attacher: attachAttributeUpdater
  },
  {
    name: element => `remove${element}Attribute`,
    attacher: attachAttributeRemover
  },
  {
    name: element => `replace${element}Attributes`,
    attacher: attachAttributesReplacer
  },
  {
    name: element => `merge${element}Attributes`,
    attacher: attachAttributesMerger
  }
];

/**
 * Attach every attributes-related methods to a Graph class.
 *
 * @param {function} Graph - Target class.
 */
export function attachAttributesMethods(Graph) {
  ATTRIBUTES_METHODS.forEach(function({name, attacher}) {

    // For edges
    attacher(
      Graph,
      name('Edge'),
      'hasEdge',
      'mixed'
    );

    // For directed edges
    attacher(
      Graph,
      name('DirectedEdge'),
      'hasDirectedEdge',
      'directed'
    );

    // For undirected edges
    attacher(
      Graph,
      name('UndirectedEdge'),
      'hasUndirectedEdge',
      'undirected'
    );
  });
}
