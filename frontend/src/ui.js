import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

// Core Nodes
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';

// Extension Nodes
import { PromptNode } from './nodes/promptNode';
import { APIRequestNode } from './nodes/apiRequestNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { RouterNode } from './nodes/routerNode';
import { NotificationNode } from './nodes/notificationNode';

import 'reactflow/dist/style.css';

const gridSize = 16;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  prompt: PromptNode,
  apiRequest: APIRequestNode,
  database: DatabaseNode,
  router: RouterNode,
  notification: NotificationNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div 
      ref={reactFlowWrapper} 
      style={{ 
        width: '100vw', 
        height: 'calc(100vh - 210px)',
        position: 'relative'
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType='smoothstep'
        connectionLineStyle={{ stroke: 'var(--accent-indigo)', strokeWidth: 2 }}
      >
        <Background color="rgba(255,255,255,0.06)" gap={gridSize} size={1} />
        <Controls />
        <MiniMap 
          nodeColor={(node) => {
            if (node.type === 'customInput') return 'var(--accent-indigo)';
            if (node.type === 'customOutput') return 'var(--accent-emerald)';
            if (node.type === 'llm') return 'var(--accent-purple)';
            if (node.type === 'text') return 'var(--accent-blue)';
            if (node.type === 'prompt') return 'var(--accent-pink)';
            if (node.type === 'apiRequest') return 'var(--accent-amber)';
            if (node.type === 'database') return 'var(--accent-blue)';
            if (node.type === 'router') return 'var(--accent-rose)';
            if (node.type === 'notification') return 'var(--accent-purple)';
            return '#ccc';
          }}
          maskColor="rgba(0, 0, 0, 0.4)"
        />
      </ReactFlow>
    </div>
  );
};
