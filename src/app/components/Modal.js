// src/components/Modal.js
import React,{useState} from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit, nodeTypes }) => {
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState(nodeTypes[0]);
  const [heuristic, setHeuristic] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nodeName, nodeType, parseFloat(heuristic) || 0);
    onClose();
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Add Node</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Type:</label>
              <select value={nodeType} onChange={(e) => setNodeType(e.target.value)}>
                {nodeTypes.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Heuristic:</label>
              <input
                type="number"
                value={heuristic}
                onChange={(e) => setHeuristic(e.target.value)}
              />
            </div>
            <button type="submit">Add Node</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </form>
        </div>
      </div>
    )
  );
};

export default Modal;