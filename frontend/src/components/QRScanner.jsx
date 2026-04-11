import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { QrCode, Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const QRScanner = ({ shopkeeperId, onScanSuccess, scannedQRs = new Set() }) => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (showScanner && videoRef.current) {
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [showScanner]);

  const startScanner = async () => {
    try {
      // Check if camera is available
      await QrScanner.hasCamera();

      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result),
        {
          onDecodeError: (err) => {
            console.error('QR decode error:', err);
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scannerRef.current.start();
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Camera access denied or not available');
    }
  };

  const handleScan = async (result) => {
    if (result && !scanning) {
      setScanning(true);
      try {
        const qrData = JSON.parse(result.data);

        if (qrData.type === 'saved_offer_visit') {
          const qrKey = `${qrData.offerId}-${qrData.userId}`;
          
          if (scannedQRs.has(qrKey)) {
            setScanResult({
              success: false,
              message: 'This QR code has already been scanned and cannot be scanned again.'
            });
            setScanning(false);
            return;
          }

          // Record the scan in the backend
          const scanData = {
            offerId: qrData.offerId,
            userId: qrData.userId,
            shopkeeperId,
            scannedAt: new Date().toISOString(),
            qrTimestamp: qrData.timestamp
          };

          // Mock API call - replace with actual endpoint
          // await axios.post('http://localhost:8080/api/qr-scans/record', scanData);

          setScanResult({
            success: true,
            message: 'Visit recorded successfully!',
            data: qrData
          });

          if (onScanSuccess) {
            onScanSuccess(scanData);
          }
        } else {
          setScanResult({
            success: false,
            message: 'Invalid QR code format'
          });
        }
      } catch (err) {
        console.error('Error processing QR code:', err);
        setScanResult({
          success: false,
          message: 'Invalid QR code data'
        });
      } finally {
        setScanning(false);
      }
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setError(null);
    setScanning(false);
  };

  const closeScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setShowScanner(false);
    resetScanner();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowScanner(!showScanner)}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <Camera className="h-4 w-4" />
        {showScanner ? 'Close Scanner' : 'Scan QR Code'}
      </button>

      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <QrCode className="h-5 w-5 text-green-600" />
                QR Code Scanner
              </h3>
              <button
                onClick={closeScanner}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {!scanResult && !error && (
            <div className="space-y-4">
                  <div className="text-center text-sm text-gray-600 mb-4">
                    Position the QR code within the camera frame
                  </div>

                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full max-w-md mx-auto border-2 border-green-400 rounded"
                      style={{ transform: 'scaleX(-1)' }} // Mirror the video
                    />
                    <div className="absolute inset-0 border-2 border-white rounded pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-400 rounded"></div>
                    </div>
                  </div>

                  {scanning && (
                    <div className="text-center text-blue-600 font-medium">
                      Processing QR code...
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">Scanner Error</span>
                  </div>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={resetScanner}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {scanResult && (
                <div className="text-center space-y-4">
                  <div className={`flex items-center justify-center gap-2 ${
                    scanResult.success ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {scanResult.success ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <AlertCircle className="h-6 w-6" />
                    )}
                    <span className="font-medium">
                      {scanResult.success ? 'Success!' : 'Error'}
                    </span>
                  </div>

                  <p className="text-gray-700">{scanResult.message}</p>

                  {scanResult.success && scanResult.data && (
                    <div className="bg-gray-50 p-3 rounded text-left text-sm">
                      <p><strong>Offer ID:</strong> {scanResult.data.offerId}</p>
                      <p><strong>User ID:</strong> {scanResult.data.userId}</p>
                      <p><strong>Scanned at:</strong> {new Date().toLocaleString()}</p>
                    </div>
                  )}

                  <button
                    onClick={resetScanner}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Scan Another Code
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;