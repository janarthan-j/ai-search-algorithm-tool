// src/components/Controls.js
import React from 'react';

const Controls = ({ selectedAlgorithm, handleAlgorithmChange, onStart, onStop, onReset, heuristic, pathCost, handleHeuristicChange, handlePathCostChange }) => {
  return (
    <div>
      <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
        <option value="bfs">BFS</option>
        <option value="dfs">DFS</option>
        <option value="best-first">Best-First Search</option>
        <option value="a-star">A*</option>
      </select>
      <input
        type="number"
        placeholder="Heuristic"
        value={heuristic}
        onChange={handleHeuristicChange}
      />
      <input
        type="number"
        placeholder="Path Cost"
        value={pathCost}
        onChange={handlePathCostChange}
      />
      <button onClick={onStart}>Start</button>
      <button onClick={onStop}>Stop</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
};

export default Controls;