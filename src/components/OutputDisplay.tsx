
import React from 'react';
import { Download, Share, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OutputDisplayProps {
  outputUrl: string | null;
  outputType: 'image' | 'video' | null;
  isProcessing: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ outputUrl, outputType, isProcessing }) => {
  const handleDownload = () => {
    if (!outputUrl) return;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `processed-output.${outputType === 'image' ? 'png' : 'mp4'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div className="w-full p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Output</h2>
        {outputUrl && !isProcessing && (
          <Button 
            onClick={handleDownload}
            variant="outline" 
            size="sm"
            className="bg-transparent border border-gray-700 text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>
      
      <div className="border border-gray-800 rounded-lg backdrop-blur-md bg-black/70 p-4 min-h-[200px] flex items-center justify-center">
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm text-gray-300 font-medium">Processing...</p>
          </div>
        ) : outputUrl && outputType ? (
          <div className="w-full">
            {outputType === 'image' ? (
              <div className="relative group">
                <img 
                  src={outputUrl} 
                  alt="Processed Output" 
                  className="w-full h-auto object-contain rounded shadow-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <video 
                  src={outputUrl} 
                  controls 
                  className="w-full h-auto rounded shadow-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                  <Button
                    onClick={handleDownload}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="flex items-center text-xs text-gray-400">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                Processing complete
              </span>
              <Button
                onClick={() => {
                  if (outputUrl) {
                    navigator.clipboard.writeText(outputUrl);
                  }
                }}
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-gray-400 hover:text-white hover:bg-transparent p-0"
              >
                <Share className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400 font-medium">No output yet</p>
            <p className="text-xs text-gray-600 mt-1">Build a pipeline and process your input</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputDisplay;
