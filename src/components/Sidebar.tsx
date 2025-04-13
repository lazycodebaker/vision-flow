
import React from 'react';
import { Camera, Layers, Filter, CircleDashed, Scan, Star } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

const nodeTypes = [
  {
    type: 'face_detection',
    label: 'Face Detection',
    icon: <Camera className="mr-2" size={16} />,
    className: 'face-detection-node',
    description: 'Detect faces in images and videos'
  },
  {
    type: 'depth_estimation',
    label: 'Depth Estimation',
    icon: <Layers className="mr-2" size={16} />,
    className: 'depth-estimation-node',
    description: 'Generate depth maps from images'
  },
  {
    type: 'sobel_filter',
    label: 'Sobel Filter',
    icon: <Filter className="mr-2" size={16} />,
    className: 'sobel-filter-node',
    description: 'Edge detection filter'
  },
  {
    type: 'blur_effect',
    label: 'Gaussian Blur',
    icon: <CircleDashed className="mr-2" size={16} />,
    className: 'blur-effect-node',
    description: 'Apply blur effect to images'
  },
  {
    type: 'edge_detection',
    label: 'Edge Detection',
    icon: <Scan className="mr-2" size={16} />,
    className: 'edge-detection-node',
    description: 'Advanced edge detection algorithm'
  }
];

const Sidebar = () => {
  const { isDark } = useTheme();
  
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const bgColor = isDark ? 'bg-black/80' : 'bg-white/80';
  const borderColor = isDark ? 'border-gray-800' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const textColorSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const nodeColorBg = isDark ? 'bg-black/40' : 'bg-gray-100';
  const nodeColorBgHover = isDark ? 'bg-black/60' : 'bg-gray-200';
  const nodeBorder = isDark ? 'border-gray-800' : 'border-gray-300';
  const nodeBorderHover = isDark ? 'border-gray-700' : 'border-gray-400';

  return (
    <aside className={`w-full h-full ${bgColor} backdrop-blur-md border-r ${borderColor}`}>
      <div className="px-6 py-8">
        <div className="flex items-center mb-8">
          <Star className={`${textColor} mr-2`} size={18} />
          <h2 className={`text-xl font-semibold ${textColor}`}>Nodes</h2>
        </div>
        <p className={`text-sm ${textColorSecondary} mb-6`}>Drag nodes to the canvas to build your computer vision pipeline</p>
      </div>
      
      <div className="px-6 space-y-2">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.type}
            className={`dndnode group cursor-grab p-2 rounded-lg ${nodeColorBg} hover:${nodeColorBgHover} border ${nodeBorder} hover:${nodeBorderHover} transition-all duration-200`}
            onDragStart={(event) => onDragStart(event, nodeType.type)}
            draggable
          >
            <div className="flex items-center">
              {React.cloneElement(nodeType.icon, { 
                className: `group-hover:${textColor} ${nodeType.icon.props.className}` 
              })}
              <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'} group-hover:${textColor} text-sm`}>
                {nodeType.label}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} group-hover:${textColorSecondary}`}>
              {nodeType.description}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
