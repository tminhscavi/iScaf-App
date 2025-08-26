/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/utils/styles';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { ReactNode, useRef, useState, useCallback, useEffect } from 'react';
import { Button } from './ui/button';

interface IBarcodeScanner {
  startText?: string | ReactNode;
  stopText?: string | ReactNode;
  onScan?: (value: string) => void;
  stopAfterFirstScan?: boolean;
}

export default function BarcodeScanner({
  startText = 'Quét mã',
  stopText = 'Dừng quét',
  onScan,
  stopAfterFirstScan = true,
}: IBarcodeScanner) {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt');

  // Flag to prevent multiple scans
  const hasScannedRef = useRef(false);
  const scannerElementRef = useRef<HTMLDivElement>(null);

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });
      setCameraPermission(permission.state as 'granted' | 'denied' | 'prompt');
    } catch (err) {
      console.log('Permission API not supported');
    }
  };

  const forceStopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        // Try to stop the scanner gracefully first
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.log('Graceful stop failed, forcing stop:', err);
      } finally {
        setIsScanning(false);
        hasScannedRef.current = false;
      }

      // try {
      //   // Clear the scanner

      //   console.log('Scanner cleared');
      // } catch (err) {
      //   console.log('Clear failed:', err);
      // }

      // html5QrCodeRef.current = null;
    }

    // // Force clear the scanner div content
    // const scannerElement = document.getElementById('scanner');
    // if (scannerElement) {
    //   scannerElement.innerHTML = '';
    // }

    // Stop all media tracks (force camera release)
    // try {
    //   const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    //   stream.getTracks().forEach(track => {
    //     track.stop();
    //     console.log('Media track stopped');
    //   });
    // } catch (err) {
    //   console.log('Could not stop media tracks:', err);
    // }
  }, []);

  const stopScanning = useCallback(async () => {
    if (!isScanning) return;

    await forceStopScanning();
  }, [isScanning, forceStopScanning]);

  const startScanning = async () => {
    if (html5QrCodeRef.current || isScanning) {
      console.log('Scanner already running, skipping start');
      return;
    }

    try {
      await checkCameraPermission();
      console.log('Starting scanner...');

      setIsScanning(true);
      setError('');
      hasScannedRef.current = false;

      // Wait for DOM to be ready
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Ensure scanner element is clean
      const scannerElement = document.getElementById('scanner');
      if (scannerElement) {
        scannerElement.innerHTML = '';
      }

      const html5QrCode = new Html5Qrcode('scanner');
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
        async (decodedText, decodedResult) => {
          // Prevent multiple scans
          if (stopAfterFirstScan && hasScannedRef.current) {
            return;
          }

          hasScannedRef.current = true;

          if (onScan) {
            try {
              onScan(decodedText);
            } catch (error) {
              console.error('Error in onScan callback:', error);
            }
          }

          // Stop scanning after first scan if enabled
          if (stopAfterFirstScan) {
            // Use a very short delay to ensure the scan callback completes
            setTimeout(async () => {
              await forceStopScanning();
            }, 50);
          }
        },
        (errorMessage) => {
          // Only log important errors
          if (
            errorMessage.includes('Permission') ||
            errorMessage.includes('NotFound')
          ) {
            console.error('Scanner error:', errorMessage);
            setError(errorMessage);
          }
        },
      );
    } catch (err: any) {
      console.error('Failed to start scanning:', err);
      setError(err.message || 'Failed to start camera');
      setIsScanning(false);
      html5QrCodeRef.current = null;
      hasScannedRef.current = false;
    }
  };

  const handleDialogClose = useCallback(
    (open: boolean) => {
      if (!open && isScanning) {
        console.log('Dialog closing, stopping scanner');
        stopScanning();
      }
    },
    [isScanning, stopScanning],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        console.log('Component unmounting, cleaning up scanner');
        forceStopScanning();
      }
    };
  }, [forceStopScanning]);

  const clearResults = () => {
    setScannedResults([]);
  };

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isScanning} onOpenChange={handleDialogClose}>
        <DialogContent forceMount className="justify-center">
          <DialogHeader>
            <DialogTitle>
              Scanning {hasScannedRef.current ? '(Stopping...)' : ''}
            </DialogTitle>
          </DialogHeader>
          <div
            className={cn(
              'w-[400px] h-[400px] aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-black',
              !isScanning && 'invisible w-0 h-0',
            )}
          >
            <div
              id="scanner"
              ref={scannerElementRef}
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      <div className="text-center w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex space-x-2 justify-center">
          {!isScanning ? (
            <Button onClick={startScanning}>{startText}</Button>
          ) : (
            <Button variant={'destructive'} onClick={stopScanning}>
              {stopText}
            </Button>
          )}
        </div>

        {cameraPermission === 'denied' && (
          <p className="text-xs text-gray-600 mt-2">
            Vui lòng cấp quyền truy cập Camera
          </p>
        )}
      </div>
    </div>
  );
}
