/**
 * Graphology Iteration Specs
 * ===========================
 *
 * Testing the iteration-related methods of the graph.
 */
import nodes from './nodes';
import edges from './edges';
import neighbors from './neighbors';

export default function iteration(Graph, checkers) {
  return {
    Nodes: nodes(Graph, checkers),
    Edges: edges(Graph, checkers),
    Neighbors: neighbors(Graph, checkers)
  };
}
