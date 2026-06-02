import React, { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Gather clean node and edge representations
      const payloadNodes = nodes.map(n => ({
        id: n.id,
        type: n.type,
        data: n.data
      }));
      const payloadEdges = edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target
      }));

      // 2. Perform POST to backend API
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nodes: payloadNodes,
          edges: payloadEdges
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status code: ${response.status}`);
      }

      const data = await response.json();
      setModalData(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to the backend server. Make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalData(null);
    setError(null);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      position: 'relative'
    }}>
      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
          border: 'none',
          color: '#fff',
          fontWeight: '600',
          fontSize: '1rem',
          padding: '12px 32px',
          borderRadius: '8px',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
          fontFamily: 'var(--font-family)',
          letterSpacing: '0.5px',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
          opacity: loading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.transform = 'translateY(-2px) scale(1.03)';
            e.target.style.boxShadow = '0 6px 24px rgba(99, 102, 241, 0.45)';
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'none';
          e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.35)';
        }}
      >
        {loading ? 'Analyzing Pipeline...' : 'Submit Pipeline'}
      </button>

      {/* High-Fidelity Custom Response Modal */}
      {(modalData || error) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(5, 7, 12, 0.75)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          fontFamily: 'var(--font-family)',
          animation: 'fadeIn 0.25s ease'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '28px',
            borderRadius: '16px',
            minWidth: '340px',
            maxWidth: '420px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            animation: 'scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {error ? (
                <div style={{
                  background: 'rgba(244, 63, 94, 0.15)',
                  color: 'var(--accent-rose)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 'bold'
                }}>!</div>
              ) : modalData?.is_dag ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--accent-amber)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
              )}
              
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '700' }}>
                  {error ? 'Connection Failed' : 'Pipeline Analysis'}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {error ? 'Error during request' : 'Success response from server'}
                </span>
              </div>
            </div>

            {/* Content Body */}
            {error ? (
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: '1.4',
                background: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.15)',
                padding: '12px',
                borderRadius: '8px'
              }}>
                {error}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Nodes</span>
                  <span style={{ fontWeight: '600' }}>{modalData?.num_nodes}</span>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Edges</span>
                  <span style={{ fontWeight: '600' }}>{modalData?.num_edges}</span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: modalData?.is_dag ? 'rgba(16, 185, 129, 0.06)' : 'rgba(245, 158, 11, 0.06)',
                  border: modalData?.is_dag ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 158, 11, 0.15)',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <span style={{ color: 'var(--text-secondary)' }}>DAG Structure</span>
                  <span style={{
                    fontWeight: '700',
                    color: modalData?.is_dag ? 'var(--accent-emerald)' : 'var(--accent-amber)'
                  }}>
                    {modalData?.is_dag ? 'VALID (No Cycles)' : 'INVALID (Has Cycles)'}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: '600',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal Keyframe Styles Injection */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
