// src/components/Graph.js
import React, { useState } from 'react';
import './Graph.css';

const Graph = ({ graph, handleNodeClick, handleEdgeClick, handleNodeDrag, handleNodeDrop }) => {
  const [draggedNode, setDraggedNode] = useState(null);
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [sourceNode, setSourceNode] = useState(null);

  const handleDragStart = (e, node) => {
    e.dataTransfer.setData('text/plain', node.id);
    setDraggedNode(node);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetNode) => {
    e.preventDefault();
    const sourceNodeId = e.dataTransfer.getData('text/plain');
    if (sourceNodeId !== targetNode.id) {
      handleEdgeClick(sourceNodeId, targetNode.id);
    }
    setDraggedNode(null);
  };

  const handleMouseEnterNode = (node) => {
    setHoveredNode(node);
  };

  const handleMouseLeaveNode = () => {
    setHoveredNode(null);
  };

  const handleMouseEnterEdge = (edge) => {
    setHoveredEdge(edge);
  };

  const handleMouseLeaveEdge = () => {
    setHoveredEdge(null);
  };

  // const handleNodeClick = (nodeId) => {
  //   if (sourceNode) {
  //     handleEdgeClick(sourceNode.id, nodeId);
  //     setSourceNode(null);
  //   } else {
  //     setSourceNode(graph.nodes[nodeId]);
  //   }
  // };

  return (
    <div className="graph">
      {Object.values(graph.nodes).map(node => (
        <div
          key={node.id}
          id={`node-${node.id}`}
          className={`node ${node.type}`}
          style={{ left: `${node.x}px`, top: `${node.y}px` }}
          draggable
          onDragStart={(e) => handleDragStart(e, node)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, node)}
          onClick={() => handleNodeClick(node.id)}
          onMouseEnter={() => handleMouseEnterNode(node)}
          onMouseLeave={handleMouseLeaveNode}
        >
          {node.name}
          <div className="heuristic">{`H: ${node.heuristic}`}</div>
          {hoveredNode === node && (
            <button onClick={() => handleSetHeuristic(node.id)}>Set Heuristic</button>
          )}
          {node.edges.map(edge => (
            <div
              key={edge.to}
              className={`edge ${hoveredEdge === edge ? 'hovered' : ''}`}
              onClick={() => handleEdgeClick(node.id, edge.to)}
              onMouseEnter={() => handleMouseEnterEdge(edge)}
              onMouseLeave={handleMouseLeaveEdge}
            >
              {edge.cost}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Graph;