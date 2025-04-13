
import React, { useCallback, useState } from 'react';
import { Upload, X, ImageIcon, VideoIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadAreaProps {
  onUpload: (file: File, preview: string) => void;
  uploadedFile: File | null;
  previewUrl: string | null;
  onClear: () => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, uploadedFile, previewUrl, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length) {
        const file = files[0];
        const isValid = file.type.includes('image') || file.type.includes('video');

        if (isValid) {
          const fileUrl = URL.createObjectURL(file);
          onUpload(file, fileUrl);
        } else {
          alert('Please upload an image (PNG/JPG) or video (MP4) file.');
        }
      }
    },
    [onUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const fileUrl = URL.createObjectURL(file);
        onUpload(file, fileUrl);
      }
    },
    [onUpload]
  );

  return (
    <div className="w-full p-6 flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4">Input</h2>

      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[180px]
            ${isDragging ? 'border-white bg-gray-900' : 'border-gray-700'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className={`p-4 rounded-full mb-3 transition-all ${isDragging ? 'bg-gray-800' : 'bg-gray-900'}`}>
            <Upload className={`h-8 w-8 ${isDragging ? 'text-white' : 'text-gray-500'}`} />
          </div>
          <p className="text-sm text-center text-gray-300 mb-2 font-medium">
            Drop Image/Video Here
          </p>
          <p className="text-xs text-center text-gray-500">
            Supports: PNG, JPG, MP4
          </p>
          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,video/mp4"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="border border-gray-800 rounded-lg backdrop-blur-md bg-black/70 overflow-hidden">
          <div className="flex justify-between items-center p-3 border-b border-gray-800">
            <span className="text-sm font-medium truncate max-w-[80%] text-gray-300">
              {uploadedFile.type.includes('image') ? (
                <span className="flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2 text-blue-400" />
                  {uploadedFile.name}
                </span>
              ) : (
                <span className="flex items-center">
                  <VideoIcon className="h-4 w-4 mr-2 text-purple-400" />
                  {uploadedFile.name}
                </span>
              )}
            </span>
            <Button variant="ghost" size="sm" onClick={onClear} className="text-gray-500 hover:text-white hover:bg-transparent p-0 h-8 w-8">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="overflow-hidden bg-gradient-to-b from-gray-900 to-black">
            {previewUrl && uploadedFile.type.includes('image') ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto object-contain"
              />
            ) : previewUrl && uploadedFile.type.includes('video') ? (
              <video
                src={previewUrl}
                className="w-full h-auto"
                controls
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
