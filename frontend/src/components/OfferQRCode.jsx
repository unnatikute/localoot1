import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, Download, Copy, Check, X, Sparkles } from 'lucide-react';

const OfferQRCode = ({ offerId, userId, offerTitle, shopName }) => {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef();

  const qrData = JSON.stringify({
    offerId,
    userId,
    timestamp: Date.now(),
    type: 'saved_offer_visit'
  });

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `offer-qr-${offerId}-${userId}.png`;
      link.href = url;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setShowQR(!showQR)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        <motion.div
          animate={showQR ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          <QrCode className="h-4 w-4" />
        </motion.div>
        <span className="font-medium">{showQR ? 'Hide QR' : 'View QR'}</span>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="h-3 w-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">QR Code</h3>
                </div>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4 text-center">
                <div ref={qrRef} className="inline-block rounded-xl border border-gray-300 bg-white p-4">
                  <QRCodeCanvas
                    value={qrData}
                    size={220}
                    level="H"
                    includeMargin={true}
                    fgColor="#111827"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              <div className="mb-4 rounded-lg bg-gray-50 p-3">
                <p className="font-semibold text-gray-900 truncate text-sm">{offerTitle}</p>
                <p className="text-gray-600 truncate text-sm">{shopName}</p>
                <p className="mt-2 text-xs text-purple-600">📍 Show this QR when visiting the shop</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    copied
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OfferQRCode;