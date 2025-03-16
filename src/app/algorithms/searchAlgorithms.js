// src/algorithms/searchAlgorithms.js
export const bfs = (graph, startNodeId, endNodeId) => {
  const startNode = graph.nodes[startNodeId];
  const endNode = graph.nodes[endNodeId];
  const queue = [startNode];
  const visitedNodesInOrder = [];

  while (queue.length > 0) {
    const currentNode = queue.shift();
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === endNode) return visitedNodesInOrder;

      for (const edge of currentNode.edges) {
        const neighbor = graph.nodes[edge.to];
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};

export const dfs = (graph, startNodeId, endNodeId) => {
  const startNode = graph.nodes[startNodeId];
  const endNode = graph.nodes[endNodeId];
  const stack = [startNode];
  const visitedNodesInOrder = [];

  while (stack.length > 0) {
    const currentNode = stack.pop();
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === endNode) return visitedNodesInOrder;

      for (const edge of currentNode.edges) {
        const neighbor = graph.nodes[edge.to];
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          stack.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};

export const bestFirstSearch = (graph, startNodeId, endNodeId) => {
  const startNode = graph.nodes[startNodeId];
  const endNode = graph.nodes[endNodeId];
  const openList = [startNode];
  const visitedNodesInOrder = [];

  while (openList.length > 0) {
    openList.sort((a, b) => a.heuristic - b.heuristic);
    const currentNode = openList.shift();
    if (!currentNode.isVisited) {
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);

      if (currentNode === endNode) return visitedNodesInOrder;

      for (const edge of currentNode.edges) {
        const neighbor = graph.nodes[edge.to];
        if (!neighbor.isVisited) {
          neighbor.previousNode = currentNode;
          openList.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};

export const aStar = (graph, startNodeId, endNodeId) => {
  const startNode = graph.nodes[startNodeId];
  const endNode = graph.nodes[endNodeId];
  const openList = [startNode];
  const closedList = [];
  const visitedNodesInOrder = [];

  while (openList.length > 0) {
    openList.sort((a, b) => (a.f) - (b.f));
    const currentNode = openList.shift();
    closedList.push(currentNode);
    visitedNodesInOrder.push(currentNode);

    if (currentNode === endNode) return visitedNodesInOrder;

    for (const edge of currentNode.edges) {
      const neighbor = graph.nodes[edge.to];
      const tentativeGScore = currentNode.g + edge.cost;

      if (closedList.includes(neighbor)) continue;

      if (!openList.includes(neighbor) || tentativeGScore < neighbor.g) {
        neighbor.previousNode = currentNode;
        neighbor.g = tentativeGScore;
        neighbor.h = neighbor.heuristic;
        neighbor.f = neighbor.g + neighbor.h;

        if (!openList.includes(neighbor)) {
          openList.push(neighbor);
        }
      }
    }
  }

  return visitedNodesInOrder;
};