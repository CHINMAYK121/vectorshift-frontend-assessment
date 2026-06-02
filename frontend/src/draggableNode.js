import React from 'react';
import { useStore } from './store';

// Color map to give each node in the toolbar its premium category color
const colorMap = {
  customInput: 'var(--accent-indigo)',
  llm: 'var(--accent-purple)',
  customOutput: 'var(--accent-emerald)',
  text: 'var(--accent-blue)',
  prompt: 'var(--accent-pink)',
  apiRequest: 'var(--accent-amber)',
  database: 'var(--accent-blue)',
  router: 'var(--accent-rose)',
  notification: 'var(--accent-purple)',
};

export const DraggableNode = ({ type, label }) => {
  const addNode = useStore((state) => state.addNode);
  const getNodeID = useStore((state) => state.getNodeID);

  const accentColor = colorMap[type] || 'var(--accent-indigo)';

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  // Click handler to instantly add nodes near the center of the canvas
  const handleClick = () => {
    const nodeID = getNodeID(type);
    
    // Position with a slight random offset to prevent stacking
    const randomOffset = Math.floor(Math.random() * 80) - 40; // -40px to +40px
    const position = {
      x: 250 + randomOffset,
      y: 160 + randomOffset,
    };

    const newNode = {
      id: nodeID,
      type,
      position,
      data: { id: nodeID, nodeType: `${type}` },
    };

    addNode(newNode);
  };

  return (
    <div
      className={type}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      onClick={handleClick}
      style={{
        cursor: 'grab',
        minWidth: '90px',
        height: '38px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        border: `1px solid ${accentColor}`,
        padding: '0 12px',
        transition: 'transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
        userSelect: 'none',
        fontFamily: 'var(--font-family)',
        fontWeight: '500',
        fontSize: '0.85rem',
        boxSizing: 'border-box'
      }}
      draggable
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-1px)';
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        e.target.style.boxShadow = `0 4px 12px rgba(255, 255, 255, 0.05), 0 0 6px ${accentColor}`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'none';
        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <span style={{ color: 'var(--text-primary)' }}>{label}</span>
    </div>
  );
};