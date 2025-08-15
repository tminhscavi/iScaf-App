'use client';

import {
  Html5QrcodeScanner,
  Html5Qrcode,
  Html5QrcodeCameraScanConfig,
} from 'html5-qrcode';
import { useEffect } from 'react';

export default function Html5BarcodeScanner() {
  useEffect(() => {
    const html5QrCode = new Html5Qrcode('reader');
    const config: Html5QrcodeCameraScanConfig = {
      fps: 10,
      qrbox: 150,
      aspectRatio: 1 / 1,
    };

    html5QrCode
      .start(
        { facingMode: 'environment' }, // Use the back camera
        config,
        (decodedText, decodedResult) => {
          // Success handler
          console.log(`Scan successful: ${decodedText}`);
          // Handle the decoded text here
        },
        (errorMessage) => {
          // Error handler (optional)
          console.log(errorMessage);
        },
      )
      .catch((err) => {
        // Handle a potential error if the user denies permission
        console.log(`Unable to start scanning: ${err}`);
      });

    return () => {
      html5QrCode.clear();
    };
  }, []);

  return (
    <div className="w-[300px] h-[300px] aspect-square">
      <div id="reader" className="w-full h-full" />
    </div>
  );
}
