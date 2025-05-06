import React, { useState, useRef } from 'react';
import { Upload, FileX } from 'lucide-react';

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  label?: string;
  accept?: string;
  error?: string;
  currentFile?: File | null;
  previewUrl?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  label = 'Upload File',
  accept = 'image/*',
  error,
  currentFile,
  previewUrl,
}) => {
  const [preview, setPreview] = useState<string | null>(previewUrl || null);
  const [fileName, setFileName] = useState<string | null>(
    currentFile ? currentFile.name : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      setFileName(file.name);
      onFileChange(file);
      
      // Create preview for image files
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemoveFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    setPreview(null);
    onFileChange(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      if (fileInputRef.current) {
        // Not directly settable, but we'll update the state
        setFileName(file.name);
        
        // Create preview for image files
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          setPreview(null);
        }
        
        onFileChange(file);
      }
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors 
          ${fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-wine hover:bg-wine/10'}
          ${error ? 'border-red-500 bg-red-50' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />
        
        {preview ? (
          <div className="mb-3">
            <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
          </div>
        ) : (
          <Upload className="mx-auto h-12 w-12 text-wine" />
        )}
        
        {fileName ? (
          <div className="mt-2">
            <p className="text-sm font-medium text-wine">{fileName}</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="mt-1 inline-flex items-center text-sm text-red-600 hover:text-red-800"
            >
              <FileX className="h-4 w-4 mr-1" />
              Remove file
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-sm font-medium text-wine">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-wine mt-1">
              {accept === 'image/*' 
                ? 'PNG, JPG, GIF up to 10MB' 
                : 'Upload your design file'}
            </p>
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;