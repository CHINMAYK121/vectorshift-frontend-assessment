import React, { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';
import { shallow } from 'zustand/shallow';

const storeSelector = (state) => ({
  updateNodeField: state.updateNodeField,
});

export const NotificationNode = ({ id, data }) => {
  const { updateNodeField } = useStore(storeSelector, shallow);
  const [channel, setChannel] = useState(data?.channel || 'Email');
  const [recipient, setRecipient] = useState(data?.recipient || 'alerts@company.com');

  const handleChannelChange = (e) => {
    setChannel(e.target.value);
    updateNodeField(id, 'channel', e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
    updateNodeField(id, 'recipient', e.target.value);
  };

  const bellIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );

  const handles = [
    { type: 'target', position: Position.Left, id: 'input' },
    { type: 'source', position: Position.Right, id: 'success' }
  ];

  return (
    <BaseNode
      id={id}
      title="Notification Node"
      icon={bellIcon}
      color="var(--accent-purple)"
      handles={handles}
    >
      <label>
        Channel
        <select value={channel} onChange={handleChannelChange}>
          <option value="Email">Email SMTP</option>
          <option value="Slack">Slack Webhook</option>
          <option value="SMS">SMS Gateway</option>
        </select>
      </label>
      <label>
        Recipient Target
        <input 
          type="text" 
          value={recipient} 
          onChange={handleRecipientChange} 
          placeholder="target..."
        />
      </label>
    </BaseNode>
  );
};
