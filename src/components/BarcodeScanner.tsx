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
import { ReactNode, useRef, useState } from 'react';
import { Button } from './ui/button';

interface IBarcodeScanner {
  startText?: string | ReactNode;
  stopText?: string | ReactNode;
  onScan?: (value: string) => void;
  stopAfterFirstScan?: boolean; // New prop to control auto-stop behavior
}

export default function BarcodeScanner({
  startText = 'Quét mã',
  stopText = 'Dừng quét',
  onScan,
  stopAfterFirstScan = true, // Default to true for auto-stop
}: IBarcodeScanner) {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResults, setScannedResults] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [cameraPermission, setCameraPermission] = useState<
    'granted' | 'denied' | 'prompt'
  >('prompt');

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

  const startScanning = async () => {
    if (html5QrCodeRef.current || isScanning) {
      return;
    }

    try {
      await checkCameraPermission();
      setIsScanning(true);
      setTimeout(async () => {
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
            console.log(`Scan successful: ${decodedText}`);

            // setScannedResults((prev) => {

            //   if (!prev.includes(decodedText)) {
            //     return [decodedText, ...prev.slice(0, 4)];
            //   }
            //   return prev;
            // });
            setError('');

            if (onScan) {
              onScan(decodedText);
            }

            if (stopAfterFirstScan) {
              stopScanning();
            }
          },
          (errorMessage) => {
            // Suppress frequent scanning errors
          },
        );
      }, 300);

      setError('');
    } catch (err: any) {
      console.error('Failed to start scanning:', err);
      setError(err.message || 'Failed to start camera');
      setIsScanning(false);
      html5QrCodeRef.current = null;
    }
  };

  const clearResults = () => {
    setScannedResults([]);
  };

  return (
    <div className="flex flex-col items-center">
      <Dialog open={isScanning} onOpenChange={(open) => stopScanning()}>
        <DialogContent forceMount className="justify-center">
          <DialogHeader>
            <DialogTitle>Scanning</DialogTitle>
          </DialogHeader>
          <div
            className={cn(
              'w-[400px] h-[400px] aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-black',
              !isScanning && 'invisible w-0 h-0',
            )}
          >
            <div id="scanner" className="w-full h-full" />
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
