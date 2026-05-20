export function createGraph({ nodes = [], edges = [] } = {}) {
  const adjacency = new Map(nodes.map((node) => [node.id, []]));

  edges.forEach((edge) => {
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }

    adjacency.get(edge.from).push(edge.to);
  });

  return {
    nodes,
    edges,
    getNeighbors: (nodeId) => adjacency.get(nodeId) || [],
    hasNode: (nodeId) => adjacency.has(nodeId),
    adjacency
  };
}

export function topologicalSort(graph) {
  const visited = new Set();
  const visiting = new Set();
  const ordered = [];

  function visit(nodeId) {
    if (visited.has(nodeId)) {
      return;
    }

    if (visiting.has(nodeId)) {
      throw new Error('Graph contains a cycle.');
    }

    visiting.add(nodeId);
    graph.getNeighbors(nodeId).forEach(visit);
    visiting.delete(nodeId);
    visited.add(nodeId);
    ordered.unshift(nodeId);
  }

  graph.nodes.forEach((node) => visit(node.id));
  return ordered;
}
