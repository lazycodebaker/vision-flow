
import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Camera, Video, VideoOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface WebcamStreamProps {
  enabled: boolean;
  resolution: string;
  applyProcessing: (imageData: ImageData) => Promise<ImageData | null>;
  isDarkTheme: boolean;
}

const WebcamStream: React.FC<WebcamStreamProps> = ({
  enabled,
  resolution,
  applyProcessing,
  isDarkTheme
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Parse resolution
  const [width, height] = resolution.split('x').map(Number);

  // Start webcam
  const startWebcam = React.useCallback(async () => {
    if (!enabled) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        setShowPermissionDialog(true);
      } else {
        setError('Could not access webcam. Please check your device settings.');
      }
    }
  }, [enabled, width, height]);

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setStreaming(false);
  };

  // Process frame
  const processFrame = async () => {
    if (!streaming || !videoRef.current || !canvasRef.current || !outputCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const outputCanvas = outputCanvasRef.current;

    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    outputCanvas.width = video.videoWidth;
    outputCanvas.height = video.videoHeight;

    // Get context and draw video frame to canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    // Get image data for processing
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      setIsProcessing(true);
      const processedData = await applyProcessing(imageData);
      setIsProcessing(false);

      if (processedData) {
        // Draw processed data to output canvas
        const outputCtx = outputCanvas.getContext('2d');
        if (outputCtx) {
          outputCtx.putImageData(processedData, 0, 0);
        }
      }
    } catch (err) {
      console.error('Processing error:', err);
    }

    // Continue processing frames
    animationFrameRef.current = requestAnimationFrame(processFrame);
  };

  // Toggle streaming
  const toggleStreaming = () => {
    if (streaming) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  // Effect for handling webcam when enabled/disabled
  useEffect(() => {
    if (enabled) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [enabled, resolution, startWebcam]);

  // Handle video playing
  const handlePlaying = () => {
    setStreaming(true);
    processFrame();
    toast.success("Webcam streaming started");
  };

  // Retry after permission dialog
  const handleRetryPermission = () => {
    setShowPermissionDialog(false);
    startWebcam();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        <div className={`rounded-lg overflow-hidden border ${isDarkTheme ? 'border-gray-800' : 'border-gray-300'
          } relative`}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onPlaying={handlePlaying}
            className="w-full h-auto"
          />
          <div className="absolute left-2 top-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
            Input
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className={`rounded-lg overflow-hidden border ${isDarkTheme ? 'border-gray-800' : 'border-gray-300'
          } relative`}>
          <canvas
            ref={outputCanvasRef}
            className="w-full h-auto"
          />
          <div className="absolute left-2 top-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
            Output
          </div>
          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <RefreshCw className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={toggleStreaming}
          variant={isDarkTheme ? "outline" : "default"}
          className={`${isDarkTheme
              ? 'bg-white/10 hover:bg-white/20 text-white border-gray-700'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300'
            }`}
        >
          {streaming ? (
            <><VideoOff className="mr-2 h-4 w-4" /> Stop Webcam</>
          ) : (
            <><Camera className="mr-2 h-4 w-4" /> Start Webcam</>
          )}
        </Button>
      </div>

      {error && (
        <div className={`p-2 rounded text-xs ${isDarkTheme ? 'bg-red-900/50 text-red-200' : 'bg-red-100 text-red-800'
          }`}>
          {error}
        </div>
      )}

      <AlertDialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Camera Permission Required</AlertDialogTitle>
            <AlertDialogDescription>
              VisionFlow needs access to your camera to enable webcam streaming. Please allow camera access in your browser settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRetryPermission}>
              <Video className="mr-2 h-4 w-4" /> Try Again
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WebcamStream;
