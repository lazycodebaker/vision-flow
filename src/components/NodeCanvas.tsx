
import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  ReactFlowInstance
} from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import NodeCard from './NodeCard';
import { NodeData } from './NodeCard';
import '@xyflow/react/dist/style.css';

interface NodeCanvasProps {
  uploadedFile: File | null;
  onProcess: (nodes: Node[], edges: Edge[]) => void;
  isProcessing: boolean;
  isDarkTheme?: boolean;
}

// Define initial nodes with TypeScript type
const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 250, y: 50 },
    className: 'input-node',
    style: { width: 120, height: 40 }
  },
  {
    id: 'output',
    type: 'output',
    data: { label: 'Output' },
    position: { x: 250, y: 350 },
    className: 'output-node',
    style: { width: 120, height: 40 }
  }
];

const NodeCanvas: React.FC<NodeCanvasProps> = ({ uploadedFile, onProcess, isProcessing, isDarkTheme = true }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>(null);

  const getDefaultParams = (nodeType: string) => {
    switch (nodeType) {
      case 'face_detection':
        return { draw_boxes: true };
      case 'depth_estimation':
        return { model: 'MiDaS Small' };
      case 'sobel_filter':
        return { ksize: 3 };
      case 'blur_effect':
        return { blur_amount: 5 };
      case 'edge_detection':
        return { threshold: 100 };
      default:
        return {};
    }
  };

  const getNodeLabel = (nodeType: string) => {
    switch (nodeType) {
      case 'face_detection':
        return 'Face Detection';
      case 'depth_estimation':
        return 'Depth Estimation';
      case 'sobel_filter':
        return 'Sobel Filter';
      case 'blur_effect':
        return 'Gaussian Blur';
      case 'edge_detection':
        return 'Edge Detection';
      default:
        return nodeType;
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleParameterChange = useCallback((nodeId: string, paramName: string, value: unknown) => {
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === nodeId
          ? {
            ...node,
            data: {
              ...node.data,
              params: {
                ...((node.data as unknown as NodeData).params || {}),
                [paramName]: value
              }
            }
          }
          : node
      )
    );
  }, [setNodes]);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNodeId = `${type}_${++nodeId}`;
      const label = getNodeLabel(type);
      let nodeClassName = '';

      switch (type) {
        case 'face_detection':
          nodeClassName = 'face-detection-node';
          break;
        case 'depth_estimation':
          nodeClassName = 'depth-estimation-node';
          break;
        case 'sobel_filter':
          nodeClassName = 'sobel-filter-node';
          break;
        case 'blur_effect':
          nodeClassName = 'blur-effect-node';
          break;
        case 'edge_detection':
          nodeClassName = 'edge-detection-node';
          break;
      }

      const newNode: Node = {
        id: newNodeId,
        type: 'custom',
        position,
        className: nodeClassName,
        style: { width: 160, height: 'auto', minHeight: 50, maxWidth: 170 },
        data: {
          label,
          type,
          params: getDefaultParams(type),
          onParameterChange: handleParameterChange,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, handleParameterChange]
  );

  const handleProcess = useCallback(() => {
    if (!uploadedFile) {
      toast.error("Please upload an image or video first");
      return;
    }

    const processingNodes = nodes.filter(node => node.type === 'custom');
    if (processingNodes.length === 0) {
      toast.error("No processing nodes added to the pipeline");
      return;
    }

    const validPipeline = edges.some(edge =>
      edge.source === 'input' &&
      edges.some(outputEdge => outputEdge.target === 'output')
    );

    if (!validPipeline) {
      toast.error("Pipeline must connect from Input to Output");
      return;
    }

    onProcess(nodes, edges);
  }, [uploadedFile, nodes, edges, onProcess]);

  const nodeTypes = {
    custom: NodeCard as React.ComponentType<unknown>
  } as NodeTypes;

  const bgClass = isDarkTheme ? "bg-[#0A0A0A]" : "bg-[#f5f5f5]";
  const controlsClass = isDarkTheme
    ? "bg-black/70 border-gray-800"
    : "bg-white/70 border-gray-300";

  return (
    <div className={`w-full h-full ${isDarkTheme ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-gray-100 to-white'}`} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className={bgClass}
        defaultEdgeOptions={{
          style: {
            stroke: isDarkTheme ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            strokeWidth: 2
          },
          type: 'smoothstep'
        }}
      >
        <Controls className={`${controlsClass} backdrop-blur-md shadow-lg rounded-md`} />
        <MiniMap
          className={`${controlsClass} backdrop-blur-md shadow-lg rounded-md`}
          nodeColor={(node) => {
            switch (node.className) {
              case 'face-detection-node': return '#3B82F6';
              case 'depth-estimation-node': return '#10B981';
              case 'sobel-filter-node': return '#F59E0B';
              case 'blur-effect-node': return '#8B5CF6';
              case 'edge-detection-node': return '#EC4899';
              case 'input-node': return isDarkTheme ? '#FFFFFF' : '#000000';
              case 'output-node': return isDarkTheme ? '#FFFFFF' : '#000000';
              default: return isDarkTheme ? '#FFFFFF' : '#000000';
            }
          }}
          maskColor={isDarkTheme ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)"}
        />
        <Background color={isDarkTheme ? "#333" : "#ccc"} gap={16} size={1} />
      </ReactFlow>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <Button
          onClick={handleProcess}
          disabled={!uploadedFile || isProcessing}
          className={`shadow-lg px-8 py-2 ${isDarkTheme
            ? 'bg-white hover:bg-gray-200 text-black'
            : 'bg-gray-800 hover:bg-gray-700 text-white'
            } text-sm font-medium rounded-full`}
        >
          {isProcessing ? 'Processing...' : 'Process Pipeline'}
        </Button>
      </div>
    </div>
  );
};

let nodeId = 0;

export default NodeCanvas;
