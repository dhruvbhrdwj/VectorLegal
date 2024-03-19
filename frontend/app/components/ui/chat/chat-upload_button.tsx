import React, { useRef, useState } from 'react';

const Spinner = () => (
  <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

const UploadButton: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploaded(false);
    const files = event.target.files;
    if (files && files.length > 0) {
      const allowedTypes = ['application/pdf', 'text/plain'];
      const invalidFiles = Array.from(files).filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        alert('Invalid file types. Allowed types are: pdf, text');
        return;
      }
  
      setLoading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
      try {
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData,
        });
        // Handle response as needed
        setUploaded(true);
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        multiple
        onChange={handleFileChange}
      />
      <button
        className={`p-4 text-black mr-4 rounded-xl shadow-xl ${
          uploaded
            ? 'bg-green-500 hover:bg-green-700'
            : 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:bg-opacity-75'
        } flex items-center justify-center`}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? <><Spinner /> Uploading...</> : uploaded ? 'Docs Uploaded!' : 'Upload Documents'}
      </button>
    </>
  );
};

export default UploadButton;
