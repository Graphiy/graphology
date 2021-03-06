/**
 * Graphology Properties Specs
 * ============================
 *
 * Testing the properties of the graph.
 */
import assert from 'assert';

const PROPERTIES = [
  'order',
  'size',
  'type',
  'multi',
  'allowSelfLoops'
];

export default function properties(Graph) {

  return {

    /**
     * Regarding all properties.
     */
    'misc': {

      'all expected properties should be set.': function() {
        const graph = new Graph();

        PROPERTIES.forEach(property => {
          assert(property in graph, property);
        });
      },

      'properties should be read-only.': function() {
        const graph = new Graph();

        // Attempting to mutate the properties
        PROPERTIES.forEach(property => {
          assert.throws(function() {
            graph[property] = 'test';
          }, TypeError);
        });
      }
    },

    /**
     * Order.
     */
    '#.order': {

      'it should be 0 if the graph is empty.': function() {
        const graph = new Graph();
        assert.strictEqual(graph.order, 0);
      },

      'adding nodes should increase order.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');
        assert.strictEqual(graph.order, 2);
      }
    },

    /**
     * Size.
     */
    '#.size': {

      'it should be 0 if the graph is empty.': function() {
        const graph = new Graph();
        assert.strictEqual(graph.size, 0);
      },

      'adding edges should increase size.': function() {
        const graph = new Graph();
        graph.addNode('John');
        graph.addNode('Jack');
        graph.addDirectedEdge('John', 'Jack');
        assert.strictEqual(graph.size, 1);
      }
    },

    /**
     * Multi.
     */
    '#.multi': {

      'it should be false by default.': function() {
        const graph = new Graph();
        assert.strictEqual(graph.multi, false);
      }
    },

    /**
     * Type.
     */
    '#.type': {

      'it should be "mixed" by default.': function() {
        const graph = new Graph();
        assert.strictEqual(graph.type, 'mixed');
      }
    },

    /**
     * Self loops.
     */
    '#.allowSelfLoops': {

      'it should be true by default.': function() {
        const graph = new Graph();
        assert.strictEqual(graph.allowSelfLoops, true);
      }
    }
  };
}
