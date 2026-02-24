import React, { useState, useRef } from 'react';
import { Loader2, Upload, X } from 'lucide-react';

interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    type: 'avatar' | 'bg_img';
    isUploading: boolean;
}

const GlowWrapper = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`relative group ${className}`}>
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
        {children}
    </div>
);

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onUpload, type, isUploading }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onUpload(selectedFile);
        }
    };

    const handleClose = () => {
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md glass-panel rounded-2xl shadow-2xl overflow-hidden">
                
                {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                        {type === 'avatar' ? 'Update Profile Picture' : 'Update Cover Photo'}
                    </h3>
                    <button 
                        onClick={handleClose}
                        className="p-1 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                        disabled={isUploading}
                        title="Close Modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!previewUrl ? (
                        <GlowWrapper>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-white/5 transition-all w-full"
                            >
                                <div className="p-4 rounded-full bg-white/5 mb-4 text-indigo-400">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <p className="text-sm font-medium text-white mb-1">Click to upload image</p>
                                <p className="text-xs text-gray-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                            </div>
                        </GlowWrapper>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden bg-black/50 border border-white/10">
                            <img 
                                src={previewUrl} 
                                alt="Preview" 
                                className={`w-full object-contain ${type === 'avatar' ? 'h-64 aspect-square' : 'h-48 aspect-video'}`}
                            />
                            <button 
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setSelectedFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                                title="Remove Preview"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        title="Select Image File"
                    />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t border-white/5 bg-white/[0.02]">
                    <GlowWrapper>
                        <button 
                            onClick={handleClose}
                            className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                            disabled={isUploading}
                        >
                            Cancel
                        </button>
                    </GlowWrapper>
                    <GlowWrapper>
                        <button 
                            onClick={handleUpload}
                            disabled={!selectedFile || isUploading}
                            className="relative px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </>
                            )}
                        </button>
                    </GlowWrapper>
                </div>

            </div>
        </div>
    );
};


export default ImageUploadModal;
