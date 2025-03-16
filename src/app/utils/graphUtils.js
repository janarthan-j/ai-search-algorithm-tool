// src/utils/graphUtils.js
export const createGraph = () => ({
    nodes: {},
  });
  
  export const addNode = (graph, nodeId) => {
    if (!graph.nodes[nodeId]) {
      graph.nodes[nodeId] = {
        id: nodeId,
        heuristic: 0,
        edges: [],
        type: 'general',
        g: 0,
        h: 0,
        f: 0,
        x: 0,
        y: 0,
      };
    }
  };
  
  export const removeNode = (graph, nodeId) => {
    delete graph.nodes[nodeId];
    for (const node of Object.values(graph.nodes)) {
      node.edges = node.edges.filter(edge => edge.to !== nodeId);
    }
  };
  
  export const addEdge = (graph, fromNodeId, toNodeId, cost) => {
    if (graph.nodes[fromNodeId] && graph.nodes[toNodeId]) {
      graph.nodes[fromNodeId].edges.push({ to: toNodeId, cost });
    }
  };
  
  export const removeEdge = (graph, fromNodeId, toNodeId) => {
    if (graph.nodes[fromNodeId]) {
      graph.nodes[fromNodeId].edges = graph.nodes[fromNodeId].edges.filter(edge => edge.to !== toNodeId);
    }
  };
  
  export const setHeuristic = (graph, nodeId, heuristic) => {
    if (graph.nodes[nodeId]) {
      graph.nodes[nodeId].heuristic = heuristic;
      graph.nodes[nodeId].h = heuristic;
      graph.nodes[nodeId].f = graph.nodes[nodeId].g + heuristic;
    }
  };