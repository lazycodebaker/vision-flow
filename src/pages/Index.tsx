
import { useState, useCallback } from 'react';
import { Edge, Node } from '@xyflow/react';
import Sidebar from '../components/Sidebar';
import NodeCanvas from '../components/NodeCanvas';
import UploadArea from '../components/UploadArea';
import OutputDisplay from '../components/OutputDisplay';
import WebcamStream from '../components/WebcamStream';
import SettingsModal, { SettingsType } from '../components/SettingsModal';
import { toast } from 'sonner';
import { ReactFlowProvider } from '@xyflow/react';
import { Github, Settings, Info, RefreshCw, Download } from 'lucide-react';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useTheme } from '@/hooks/use-theme';

import { projectSettings } from '@/settings';

const defaultSettings: SettingsType = {
  processingQuality: 2,
  autoSaveResults: false,
  showNodeLabels: true,
  enableAnimations: true,
  webcamEnabled: false,
  webcamResolution: '640x480'
};

const Index = () => {
  const { isDark, toggleTheme } = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputType, setOutputType] = useState<'image' | 'video' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingHistory, setProcessingHistory] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);

  const handleUpload = (file: File, preview: string) => {
    setUploadedFile(file);
    setPreviewUrl(preview);
    // Reset output when new file is uploaded
    setOutputUrl(null);
    setOutputType(null);
  };

  const handleClear = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (outputUrl && !outputUrl.startsWith('http')) {
      URL.revokeObjectURL(outputUrl);
    }
    setUploadedFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setOutputType(null);
  };

  const handleProcess = async (nodes: Node[], edges: Edge[]) => {
    if (!uploadedFile && !settings.webcamEnabled) {
      toast.error("Please upload an image or video first or enable webcam streaming");
      return;
    }

    setIsProcessing(true);

    try {
      // In a real implementation, we would send the data to the backend
      // For now, let's simulate processing with a timeout

      // Prepare the node graph data
      const processingNodes = nodes.filter(node => node.type === 'custom').map(node => ({
        id: node.id,
        type: (node.data).type,
        params: (node.data).params
      }));

      const connections = edges.map(edge => ({
        from: edge.source,
        to: edge.target
      }));

      const pipelineObject = nodes.filter(node => node.type === 'custom').map(node => ({
        ...{
          label: node.data.label,
          type: node.data.type,
          params: node.data.params
        }
      }));

      const SERVER_URL = `${projectSettings}/process`;
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('pipeline', JSON.stringify(pipelineObject));

      fetch(SERVER_URL, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          toast.success("Pipeline processed successfully");
        })
        .catch(error => {
          console.error(error);
          toast.error("Error processing pipeline");
        });

      // Simulate backend processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real implementation, we would receive the processed output from the backend
      // For now, just use the original file as the "processed" output
      if (previewUrl) {
        setOutputUrl(previewUrl);
        setOutputType(uploadedFile!.type.includes('image') ? 'image' : 'video');
      }

      // Add to processing history
      const timestamp = new Date().toLocaleTimeString();
      const nodeCount = processingNodes.length;
      const sourceName = uploadedFile.name; // ? uploadedFile.name : 'webcam-stream';
      setProcessingHistory(prev => [
        `[${timestamp}] Processed ${sourceName} with ${nodeCount} nodes`,
        ...prev.slice(0, 4)
      ]);

      toast.success("Processing complete");
    } catch (error) {
      console.error("Processing failed:", error);
      toast.error("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) {
      toast.error("No processed output to download");
      return;
    }

    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = outputUrl;
    // Set the download name using the original filename with a prefix
    const extension = outputType === 'image' ? '.jpg' : '.mp4';
    const filename = uploadedFile ? `processed_${uploadedFile.name}` : `processed_output${extension}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
  };

  const applyWebcamProcessing = useCallback(async (imageData: ImageData): Promise<ImageData | null> => {
    // In a real implementation, this would process the webcam frame using the current nodes/edges
    // For this demo, we'll just return the original image data after a delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 100));
    return imageData;
  }, []);

  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    toast.success("Settings saved successfully");
  };

  const themeClass = isDark ? 'dark-theme' : 'light-theme';
  const bgClass = isDark
    ? "bg-gradient-to-br from-gray-900 to-black"
    : "bg-gradient-to-br from-gray-100 to-white";

  const headerBgClass = isDark
    ? "bg-black/80 border-gray-800"
    : "bg-white/80 border-gray-200";

  const textClass = isDark ? "text-white" : "text-gray-800";
  const secondaryTextClass = isDark ? "text-gray-400" : "text-gray-600";

  return (
    <div className={`flex flex-col h-screen ${bgClass} ${textClass}`}>
      <header className={`${headerBgClass} backdrop-blur-md border-b p-4 shadow-xl`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className={`text-2xl font-bold ${textClass} flex items-center`}>
            Vision<span className={secondaryTextClass}>Flow</span>
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
            <button
              onClick={() => setSettingsOpen(true)}
              className={`${secondaryTextClass} hover:${textClass} transition-colors`}
            >
              <Settings size={20} />
            </button>
            <button className={`${secondaryTextClass} hover:${textClass} transition-colors`}>
              <Info size={20} />
            </button>
            <button className={`${secondaryTextClass} hover:${textClass} transition-colors`}>
              <Github size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 overflow-y-auto">
          <Sidebar />

          {processingHistory.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-800 dark:border-gray-800 light:border-gray-200">
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <RefreshCw size={14} className="mr-2" />
                Processing History
              </h3>
              <div className="space-y-2">
                {processingHistory.map((item, i) => (
                  <div key={i} className={`text-xs ${isDark ? 'text-gray-500 bg-gray-900/50' : 'text-gray-600 bg-gray-100/70'} p-2 rounded`}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-3/5 h-full">
          <ReactFlowProvider>
            <NodeCanvas
              uploadedFile={uploadedFile}
              onProcess={handleProcess}
              isProcessing={isProcessing}
              isDarkTheme={isDark}
            />
          </ReactFlowProvider>
        </div>

        <div className={`w-1/5 overflow-y-auto flex flex-col ${isDark ? 'bg-black/80 border-gray-800' : 'bg-white/80 border-gray-200'} backdrop-blur-md border-l`}>
          {settings.webcamEnabled ? (
            <div className="p-4">
              <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Webcam Stream
              </h3>
              <WebcamStream
                enabled={settings.webcamEnabled}
                resolution={settings.webcamResolution}
                applyProcessing={applyWebcamProcessing}
                isDarkTheme={isDark}
              />
            </div>
          ) : (
            <UploadArea
              onUpload={handleUpload}
              uploadedFile={uploadedFile}
              previewUrl={previewUrl}
              onClear={handleClear}
            />
          )}

          <div className={isDark ? 'border-t border-gray-800' : 'border-t border-gray-200'}></div>
          <OutputDisplay
            outputUrl={outputUrl}
            outputType={outputType}
            isProcessing={isProcessing}
          />

          {outputUrl && (
            <div className="p-4 text-center">
              <button
                onClick={handleDownload}
                className={`flex items-center justify-center space-x-2 mx-auto px-4 py-2 rounded-md ${isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } transition-all duration-200`}
              >
                <Download size={16} />
                <span>Download Output</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onSaveSettings={handleSaveSettings}
        settings={settings}
      />
    </div>
  );
};

export default Index;
