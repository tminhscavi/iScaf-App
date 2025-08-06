'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, Scan, FileText, Image, QrCode, X, Check, AlertCircle } from 'lucide-react';

// Type definitions
interface ScanResult {
  type: 'image' | 'qr' | 'document';
  data: string;
  filename?: string;
  size?: number;
  timestamp: string;
  info: string;
}

interface ScannerModeProps {
  mode: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
  active: boolean;
}

type ScanMode = 'camera' | 'upload' | 'qr';

// Custom hooks
const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (): Promise<MediaStream | null> => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      setStream(mediaStream);
      return mediaStream;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied or not available';
      setError(errorMessage);
      return null;
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return { stream, error, startCamera, stopCamera };
};

// Components
const ScannerMode: React.FC<ScannerModeProps> = ({ 
  mode, 
  icon: Icon, 
  label, 
  description, 
  onClick, 
  active 
}) => (
  <div
    onClick={onClick}
    className={`p-6 rounded-xl cursor-pointer transition-all duration-200 ${
      active 
        ? 'bg-blue-500 text-white shadow-lg scale-105' 
        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
    }`}
  >
    <Icon className={`w-8 h-8 mb-3 ${active ? 'text-white' : 'text-blue-500'}`} />
    <h3 className="font-semibold text-lg mb-1">{label}</h3>
    <p className={`text-sm ${active ? 'text-blue-100' : 'text-gray-500'}`}>{description}</p>
  </div>
);

const CameraScanner: React.FC<{
  onResult: (result: ScanResult) => void;
  onError: (error: string) => void;
}> = ({ onResult, onError }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { stream, error, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const handleStartCamera = async (): Promise<void> => {
    const mediaStream = await startCamera();
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      setIsScanning(true);
    }
  };

  const handleStopCamera = (): void => {
    stopCamera();
    setIsScanning(false);
  };

  const captureImage = (): void => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const result: ScanResult = {
          type: 'image',
          data: canvas.toDataURL(),
          timestamp: new Date().toISOString(),
          info: 'Image captured successfully'
        };
        
        onResult(result);
        handleStopCamera();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        {!isScanning ? (
          <div>
            <Camera className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Camera Scanner</h3>
            <button
              onClick={handleStartCamera}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Camera
            </button>
          </div>
        ) : (
          <div>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-h-96 object-cover"
              />
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg">
                <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-blue-500"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-blue-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-blue-500"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-blue-500"></div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={captureImage}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Scan className="w-5 h-5" />
                Capture
              </button>
              <button
                onClick={handleStopCamera}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const FileUploadScanner: React.FC<{
  onResult: (result: ScanResult) => void;
}> = ({ onResult }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (result) {
          const fileType: 'image' | 'document' = file.type.includes('image') ? 'image' : 'document';
          
          const scanResult: ScanResult = {
            type: fileType,
            data: result as string,
            filename: file.name,
            size: file.size,
            timestamp: new Date().toISOString(),
            info: `${fileType} uploaded: ${file.name}`
          };
          
          onResult(scanResult);
        }
      };
      
      if (file.type.includes('image')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsText(file);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-4">File Upload Scanner</h3>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer"
        >
          <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-sm text-gray-500">Supports images, PDFs, and text documents</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,application/pdf,.txt,.doc,.docx"
        />
      </div>
    </div>
  );
};

const QRScanner: React.FC<{
  onResult: (result: ScanResult) => void;
  onError: (error: string) => void;
}> = ({ onResult, onError }) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { stream, error, startCamera, stopCamera } = useCamera();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrReaderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const scannerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerInstanceRef.current) {
        try {
          scannerInstanceRef.current.clear();
        } catch (e) {
          // Scanner already cleared
        }
      }
    };
  }, []);

  const stopQRScan = (): void => {
    stopCamera();
    setIsScanning(false);
    if (scannerInstanceRef.current) {
      try {
        scannerInstanceRef.current.clear();
        scannerInstanceRef.current = null;
      } catch (e) {
        // Scanner already cleared
      }
    }
  };


  const startQRScan = (): void => {
    if (!qrReaderRef.current) return;
    
    import('html5-qrcode').then(({ Html5QrcodeScanner }) => {
      const config = {
        qrbox: { width: 250, height: 250 },
        fps: 20,
        rememberLastUsedCamera: true,
      };
      
      const scanner = new Html5QrcodeScanner(
        qrReaderRef.current!.id,
        config,
        false
      );
      
      scannerInstanceRef.current = scanner;
      
      scanner.render(
        (decodedText: string) => {
          const result: ScanResult = {
            type: 'qr',
            data: decodedText,
            timestamp: new Date().toISOString(),
            info: 'QR Code detected and decoded'
          };
          onResult(result);
          stopQRScan();
        },
        (errorMessage: string) => {
          console.log(`QR Code scan error: ${errorMessage}`);
        }
      );
      
      setIsScanning(true);
    }).catch((err) => {
      onError('Failed to load QR scanner library');
    });
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center">
        <QrCode className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-4">QR Code Scanner</h3>
        
        {!isScanning ? (
          <div>
            <p className="text-gray-600 mb-4">
              Point your camera at a QR code to scan it
            </p>
            <button
              onClick={startQRScan}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start QR Scan
            </button>
          </div>
        ) : (
          <div>
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-80 object-cover"
              />
              {/* QR Code targeting overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-lg relative">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-blue-400"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-400"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-blue-400"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-blue-400"></div>
                  </div>
                  <p className="text-blue-400 text-sm mt-2 text-center">
                    Position QR code within the frame
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-gray-600">Scanning for QR codes...</span>
            </div>
            
            <button
              onClick={stopQRScan}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Stop Scanning
            </button>
          </div>
        )}
        
        {/* Hidden div for html5-qrcode library (if used) */}
        <div 
          ref={qrReaderRef} 
          id={`qr-reader-${Math.random().toString(36).substr(2, 9)}`}
          className="hidden"
        ></div>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<{
  result: ScanResult;
  onClear: () => void;
}> = ({ result, onClear }) => {
  const handleOpenLink = (): void => {
    if (result.type === 'qr' && result.data.startsWith('http')) {
      window.open(result.data, '_blank');
    }
  };

  const formatFileSize = (bytes: number): string => {
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Check className="w-6 h-6 text-green-500" />
          Scan Results
        </h3>
        <button
          onClick={onClear}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Clear results"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-700 font-medium">{result.info}</p>
          <p className="text-sm text-green-600 mt-1">
            Scanned at: {new Date(result.timestamp).toLocaleString()}
          </p>
        </div>

        {result.type === 'image' && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Image className="w-5 h-5" />
              Captured Image
            </h4>
            <img
              src={result.data}
              alt="Scanned content"
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        )}

        {result.type === 'qr' && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Content
            </h4>
            <div className="p-3 bg-gray-100 rounded-lg">
              <code className="text-sm break-all">{result.data}</code>
            </div>
            {result.data.startsWith('http') && (
              <button
                onClick={handleOpenLink}
                className="mt-2 text-blue-500 hover:text-blue-600 underline"
              >
                Open Link
              </button>
            )}
          </div>
        )}

        {result.type === 'document' && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Information
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              {result.filename && <p>Filename: {result.filename}</p>}
              {result.size && <p>Size: {formatFileSize(result.size)}</p>}
            </div>
          </div>
        )}

        <button
          onClick={onClear}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          Scan Again
        </button>
      </div>
    </div>
  );
};

// Main Scanner Component
const Scanner: React.FC = () => {
  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResult = useCallback((scanResult: ScanResult): void => {
    setResult(scanResult);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string): void => {
    setError(errorMessage);
  }, []);

  const clearResult = useCallback((): void => {
    setResult(null);
    setError(null);
  }, []);

  const scanModes: Array<{
    mode: ScanMode;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    description: string;
  }> = [
    {
      mode: 'camera',
      icon: Camera,
      label: 'Camera Scan',
      description: 'Use camera to scan documents or QR codes'
    },
    {
      mode: 'upload',
      icon: Upload,
      label: 'File Upload',
      description: 'Upload images or documents to scan'
    },
    {
      mode: 'qr',
      icon: QrCode,
      label: 'QR Scanner',
      description: 'Dedicated QR code scanning'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Universal Scanner</h1>
          <p className="text-gray-600">Scan documents, images, QR codes and more</p>
        </div>

        {/* Scanner Mode Selection */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {scanModes.map((mode) => (
              <ScannerMode
                key={mode.mode}
                mode={mode.mode}
                icon={mode.icon}
                label={mode.label}
                description={mode.description}
                onClick={() => setScanMode(mode.mode)}
                active={scanMode === mode.mode}
              />
            ))}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Scanner Components */}
        {!result && (
          <>
            {scanMode === 'camera' && (
              <CameraScanner onResult={handleResult} onError={handleError} />
            )}
            {scanMode === 'upload' && (
              <FileUploadScanner onResult={handleResult} />
            )}
            {scanMode === 'qr' && (
              <QRScanner onResult={handleResult} onError={handleError} />
            )}
          </>
        )}

        {/* Results Display */}
        {result && (
          <ResultsDisplay result={result} onClear={clearResult} />
        )}
      </div>
    </div>
  );
};

export default Scanner;