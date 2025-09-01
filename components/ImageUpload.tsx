import React, { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadToCloudinary } from '@/lib/cloudinary';

const compressImage = async (file: File): Promise<File> => {
  // If file is less than 1MB, return it as is
  if (file.size <= 1024 * 1024) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Start with high quality
        let quality = 0.9;
        let compressedBlob: Blob;
        
        // Convert to blob and check size
        canvas.toBlob(
          (blob) => {
            if (blob) {
              compressedBlob = blob;
              // If still over 1MB, reduce quality until under 1MB
              while (compressedBlob.size > 1024 * 1024 && quality > 0.1) {
                quality -= 0.1;
                canvas.toBlob(
                  (newBlob) => {
                    if (newBlob) {
                      compressedBlob = newBlob;
                    }
                  },
                  'image/jpeg',
                  quality
                );
              }
              
              // Convert blob to File
              const compressedFile = new File(
                [compressedBlob],
                file.name,
                {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                }
              );
              
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

const ImagePreview = ({ 
  file, 
  existingUrl, 
  onClear, 
  alt 
}: { 
  file?: File | null, 
  existingUrl?: string, 
  onClear: () => void, 
  alt: string 
}) => {
  const imageUrl = file ? URL.createObjectURL(file) : existingUrl;
  
  return (
    <div className="relative">
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-32 h-32 object-cover rounded-lg"
      />
      <button 
        onClick={onClear} 
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ImageUpload = ({ 
  id, 
  label, 
  files, 
  setFiles, 
  uploadUrls,
  setUploadUrls,
  existingUrls 
}: { 
  id: string, 
  label: string, 
  files: File[], 
  setFiles: (files: File[]) => void,
  uploadUrls?: string[],
  setUploadUrls?: (urls: string[]) => void,
  existingUrls?: string[] 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [compressionStatus, setCompressionStatus] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    setIsUploading(true);
    
    try {
      // Compress files if needed
      const compressedFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          if (file.size > 1024 * 1024) {
            setCompressionStatus(`Compressing ${file.name}...`);
            return await compressImage(file);
          }
          return file;
        })
      );

      setFiles([...files, ...compressedFiles]);

      // Optional Cloudinary upload
      if (setUploadUrls) {
        setCompressionStatus('Uploading to cloud...');
        const newUrls = await Promise.all(
          compressedFiles.map(file => uploadToCloudinary(file))
        );
        setUploadUrls([...(uploadUrls || []), ...newUrls]);
      }
    } catch (error) {
      console.error('Upload or compression failed', error);
    } finally {
      setIsUploading(false);
      setCompressionStatus('');
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(updatedFiles);

    // Remove corresponding URL if upload URLs are managed
    if (setUploadUrls && uploadUrls) {
      const updatedUrls = uploadUrls.filter((_, index) => index !== indexToRemove);
      setUploadUrls(updatedUrls);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <ImagePreview
              key={index}
              file={file}
              onClear={() => removeFile(index)}
              alt={`${label} ${index + 1}`}
            />
          ))}
          {existingUrls?.map((url, index) => (
            <ImagePreview
              key={`existing-${index}`}
              existingUrl={url}
              onClear={() => {
                // Placeholder for existing URL removal logic
              }}
              alt={`Existing ${label} ${index + 1}`}
            />
          ))}

          {(files.length + (existingUrls?.length || 0)) < 5 && (
            <div 
              className={`flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer ${isUploading ? 'opacity-50' : 'hover:border-primary'}`}
              onClick={() => !isUploading && document.getElementById(id)?.click()}
            >
              <div className="text-center">
                {isUploading ? (
                  <div className="space-y-1">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <span className="text-sm text-gray-500">
                      {compressionStatus || 'Processing...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500">Upload</span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <Input
          id={id}
          name={id}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ImageUpload;