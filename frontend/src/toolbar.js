import React from 'react';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: 'var(--font-family)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
            width: '12px',
            height: '24px',
            borderRadius: '4px'
          }} />
          <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>
            VectorShift <span style={{ color: 'var(--accent-indigo)', fontWeight: '500' }}>Pipeline Editor</span>
          </span>
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Drag components onto the canvas below to model your AI workflow
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center',
        background: 'rgba(9, 13, 22, 0.4)',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginRight: '6px' }}>
          Core:
        </div>
        <DraggableNode type='customInput' label='Input' />
        <DraggableNode type='llm' label='LLM' />
        <DraggableNode type='customOutput' label='Output' />
        <DraggableNode type='text' label='Text' />
        
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', margin: '0 8px' }} />
        
        <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginRight: '6px' }}>
          Extensions:
        </div>
        <DraggableNode type='prompt' label='Prompt' />
        <DraggableNode type='apiRequest' label='API Call' />
        <DraggableNode type='database' label='Database' />
        <DraggableNode type='router' label='Router' />
        <DraggableNode type='notification' label='Notify' />
      </div>
    </div>
  );
};
