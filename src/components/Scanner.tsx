/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { useEffect, useRef, useState } from 'react';

export default function Scanner() {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const startScanning = async () => {
      try {
        const html5QrCode = new Html5Qrcode('reader');
        html5QrCodeRef.current = html5QrCode;

        const config: Html5QrcodeCameraScanConfig = {
          fps: 10,
          qrbox: 150,
          aspectRatio: 1 / 1,
        };

        await html5QrCode.start(
          { facingMode: 'environment' }, // Use the back camera
          config,
          (decodedText, decodedResult) => {
            // Success handler
            console.log(`Scan successful: ${decodedText}`);
            setScannedResult(decodedText);
            setError('');
            // Optionally stop scanning after successful scan
            // stopScanning();
          },
          (errorMessage) => {
            // Error handler (optional) - this fires frequently, so we don't log it
            // console.log(errorMessage);
          },
        );

        setIsScanning(true);
        setError('');
      } catch (err) {
        console.error(`Unable to start scanning: ${err}`);
        setError(`Unable to start scanning: ${err}`);
        setIsScanning(false);
      }
    };

    startScanning();

    // Cleanup function
    return () => {
      const html5QrCode = html5QrCodeRef.current;
      if (html5QrCode) {
        html5QrCode.stop()
          .then(() => {
            html5QrCode.clear();
            setIsScanning(false);
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err);
            // Force clear even if stop fails
            try {
              html5QrCode.clear();
            } catch (clearErr) {
              console.error('Error clearing scanner:', clearErr);
            }
            setIsScanning(false);
          });
      }
    };
  }, []);

  const stopScanning = async () => {
    const html5QrCode = html5QrCodeRef.current;
    if (html5QrCode && isScanning) {
      try {
        await html5QrCode.stop();
        html5QrCode.clear();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const restartScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      await stopScanning();
    }
    
    // Small delay before restarting
    setTimeout(() => {
      window.location.reload(); // Simple restart approach
    }, 100);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-[300px] h-[300px] aspect-square border-2 border-gray-300 rounded-lg overflow-hidden">
        <div id="reader" className="w-full h-full" />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          Status: {isScanning ? 'Scanning...' : 'Not scanning'}
        </p>
        
        {scannedResult && (
          <div className="mb-2 p-2 bg-green-100 border border-green-300 rounded">
            <p className="text-sm font-semibold text-green-800">Scanned:</p>
            <p className="text-sm text-green-700 break-all">{scannedResult}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-2 p-2 bg-red-100 border border-red-300 rounded">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <div className="space-x-2">
          <button
            onClick={stopScanning}
            disabled={!isScanning}
            className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
          >
            Stop
          </button>
          <button
            onClick={restartScanning}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}

// Alternative version with better error handling and state management
export function AdvancedBarcodeScanner() {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
    } catch (err) {
      console.log('Permission API not supported');
    }
  };

  const startScanning = async () => {
    if (html5QrCodeRef.current || isScanning) {
      return;
    }

    try {
      await checkCameraPermission();
      
      const html5QrCode = new Html5Qrcode('reader-advanced');
      html5QrCodeRef.current = html5QrCode;

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 200, height: 200 },
        aspectRatio: 1.0,
        disableFlip: false,
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText, decodedResult) => {
          console.log(`Scan successful: ${decodedText}`);
          setScannedResults(prev => {
            // Avoid duplicates
            if (!prev.includes(decodedText)) {
              return [decodedText, ...prev.slice(0, 4)]; // Keep last 5 results
            }
            return prev;
          });
          setError('');
        },
        (errorMessage) => {
          // Suppress frequent scanning errors
        },
      );

      setIsScanning(true);
      setError('');
    } catch (err: any) {
      console.error('Failed to start scanning:', err);
      setError(err.message || 'Failed to start camera');
      setIsScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  const stopScanning = async () => {
    if (!html5QrCodeRef.current || !isScanning) {
      return;
    }

    try {
      await html5QrCodeRef.current.stop();
      html5QrCodeRef.current.clear();
    } catch (err) {
      console.error('Error stopping scanner:', err);
    } finally {
      html5QrCodeRef.current = null;
      setIsScanning(false);
    }
  };

  useEffect(() => {
    startScanning();

    return () => {
      stopScanning();
    };
  }, []);

  const clearResults = () => {
    setScannedResults([]);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-[300px] h-[300px] aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-black">
        <div id="reader-advanced" className="w-full h-full" />
      </div>
      
      <div className="text-center w-full max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <p className="text-sm font-medium">
            {isScanning ? 'Scanning Active' : 'Scanner Stopped'}
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {scannedResults.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-semibold text-green-800">Scanned Results</h3>
              <button
                onClick={clearResults}
                className="text-xs text-green-600 hover:text-green-800"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1">
              {scannedResults.map((result, index) => (
                <div key={index} className="text-xs text-green-700 bg-white p-2 rounded border break-all">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex space-x-2 justify-center">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Stop Scanning
            </button>
          )}
        </div>
        
        {cameraPermission === 'denied' && (
          <p className="text-xs text-gray-600 mt-2">
            Camera permission denied. Please enable camera access in your browser settings.
          </p>
        )}
      </div>
    </div>
  );
}