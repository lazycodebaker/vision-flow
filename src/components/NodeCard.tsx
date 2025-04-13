
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useTheme } from '@/hooks/use-theme';

export interface NodeData {
  label: string;
  type: string;
  params: {
    [key: string]: unknown
  };
  onParameterChange: (id: string, paramName: string, value: unknown) => void;
}

const NodeCard = ({ id, data }: NodeProps) => {
  // Cast data to NodeData to access its properties safely
  const nodeData = data as unknown as NodeData;
  const { isDark } = useTheme();

  const renderParameters = () => {
    switch (nodeData.type) {
      case 'face_detection':
        return (
          <div className="custom-node-form">
            <label className={`flex items-center text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <input
                type="checkbox"
                checked={Boolean(nodeData.params.draw_boxes)}
                onChange={(e) => nodeData.onParameterChange(id, 'draw_boxes', e.target.checked)}
                className="mr-1 w-3 h-3 rounded border-gray-700 text-black focus:ring-black"
              />
              Draw Boxes
            </label>
          </div>
        );
      case 'depth_estimation':
        return (
          <div className="custom-node-form">
            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Model</label>
            <select
              value={String(nodeData.params.model ?? 'MiDaS Small')}
              onChange={(e) => nodeData.onParameterChange(id, 'model', e.target.value)}
              className={`w-full text-xs p-1 border rounded ${isDark
                ? 'border-gray-700 bg-gray-800 text-gray-200 focus:ring-white focus:border-white'
                : 'border-gray-300 bg-white text-gray-800 focus:ring-gray-400 focus:border-gray-400'
                }`}
            >
              <option value="MiDaS Small">MiDaS Small</option>
              <option value="MiDaS Large">MiDaS Large</option>
            </select>
          </div>
        );
      case 'sobel_filter':
        return (
          <div className="custom-node-form">
            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Size</label>
            <input
              type="number"
              min={1}
              max={7}
              step={2}
              value={Number(nodeData.params.ksize ?? 3)}
              onChange={(e) => nodeData.onParameterChange(id, 'ksize', parseInt(e.target.value))}
              className={`w-full p-1 text-xs border rounded ${isDark
                ? 'border-gray-700 bg-gray-800 text-gray-200 focus:ring-white focus:border-white'
                : 'border-gray-300 bg-white text-gray-800 focus:ring-gray-400 focus:border-gray-400'
                }`}
            />
          </div>
        );
      case 'blur_effect':
        return (
          <div className="custom-node-form">
            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Blur</label>
            <input
              type="range"
              min={1}
              max={25}
              value={Number(nodeData.params.blur_amount ?? 5)}
              onChange={(e) => nodeData.onParameterChange(id, 'blur_amount', parseInt(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: isDark ? 'white' : '#333' }}
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Number(nodeData.params.blur_amount ?? 5)}</p>
          </div>
        );
      case 'edge_detection':
        return (
          <div className="custom-node-form">
            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Sensitivity</label>
            <input
              type="range"
              min={50}
              max={200}
              value={Number(nodeData.params.threshold ?? 100)}
              onChange={(e) => nodeData.onParameterChange(id, 'threshold', parseInt(e.target.value))}
              className="w-full h-1"
              style={{ accentColor: isDark ? 'white' : '#333' }}
            />
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{Number(nodeData.params.threshold ?? 100)}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`react-flow__node-custom backdrop-blur-md p-2 rounded-lg border shadow-xl ${isDark
      ? 'bg-black/70 border-gray-800 text-gray-100'
      : 'bg-white/70 border-gray-300 text-gray-800'
      }`}>
      <Handle type="target" position={Position.Top} className={`!border-${isDark ? 'gray-800' : 'gray-300'} ${isDark ? '!bg-white' : '!bg-gray-800'}`} />
      <div>
        <div className="font-bold text-xs mb-1">{nodeData.label}</div>
        {renderParameters()}
      </div>
      <Handle type="source" position={Position.Bottom} className={`!border-${isDark ? 'gray-800' : 'gray-300'} ${isDark ? '!bg-white' : '!bg-gray-800'}`} />
    </div>
  );
};

export default NodeCard;
