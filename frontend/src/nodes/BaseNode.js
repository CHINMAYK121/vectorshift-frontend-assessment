import React from 'react';
import { Handle } from 'reactflow';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';
import './BaseNode.css';

const selector = (state) => ({
  onNodesChange: state.onNodesChange,
  edges: state.edges,
  onEdgesChange: state.onEdgesChange,
});

/**
 * BaseNode Component
 * 
 * Provides a standardized visual wrapper and functionality for all pipeline nodes.
 * Automatically handles common node behaviors such as layout, styling,
 * connection handles, and edge/node deletion.
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the node.
 * @param {string} props.title - The display title of the node.
 * @param {React.ReactNode} props.icon - SVG icon element for the node header.
 * @param {string} [props.color='var(--accent-indigo)'] - Accent color for the node header and highlights.
 * @param {Array<{type: string, position: string, id: string, style?: Object}>} [props.handles=[]] - Array of handle definitions for inputs/outputs.
 * @param {Object} [props.style={}] - Additional CSS styles for the node container.
 * @param {React.ReactNode} props.children - Child components rendered inside the node body.
 */
export const BaseNode = ({ id, title, icon, color = 'var(--accent-indigo)', handles = [], style = {}, children }) => {
  const { onNodesChange, edges, onEdgesChange } = useStore(selector, shallow);

  const handleDelete = () => {
    // Delete connected edges
    const connectedEdges = edges.filter(edge => edge.source === id || edge.target === id);
    if (connectedEdges.length > 0) {
      onEdgesChange(connectedEdges.map(edge => ({ id: edge.id, type: 'remove' })));
    }
    // Delete the node
    onNodesChange([{ id, type: 'remove' }]);
  };

  return (
    <div className="base-node" style={{ '--node-accent': color, ...style }}>
      <div className="base-node-header">
        <div className="base-node-title-group">
          <span className="base-node-icon">{icon}</span>
          <span className="base-node-title">{title}</span>
        </div>
        <button className="base-node-delete-btn" onClick={handleDelete} aria-label="Delete Node">
          &times;
        </button>
      </div>
      <div className="base-node-body">
        {children}
      </div>
      {handles.map((handle) => (
        <Handle
          key={`${id}-${handle.id}`}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={{
            ...handle.style,
          }}
          className={`base-node-handle base-node-handle-${handle.type}`}
        />
      ))}
    </div>
  );
};
