import { useState, useEffect } from 'react';
import Navigation from '../components/layout/Navigation';
import { useNavigation } from '../hooks/useNavigation';
import { useCamera } from '../hooks/useCamera';
import { mediaService } from '../services/MediaService';
import type { MediaResponse } from '../types';
import './ScannerPage.css';

export default function ScannerPage() {
  const { goBack } = useNavigation();
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureImage } = useCamera();
  
  const [isScanning, setIsScanning] = useState(false);
  const [detectedMedia, setDetectedMedia] = useState<MediaResponse | null>(null);
  const [showVideoOverlay, setShowVideoOverlay] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);


  const handleGoBack = () => {
    stopCamera();
    goBack();
  };

  const handleStartScanning = async () => {
    await startCamera();
  };

  const handleStopScanning = () => {
    stopCamera();
    setShowVideoOverlay(false);
    setDetectedMedia(null);
  };

  const handleCapture = async () => {
    if (!isStreaming) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const imageBlob = await captureImage();
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      // Convert blob to base64
      const base64Image = await mediaService.convertBlobToBase64(imageBlob);

      // Send to backend for detection
      const mediaResponse = await mediaService.detectImageAndGetMedia(base64Image);

      if (mediaResponse.success && mediaResponse.data.url) {
        setDetectedMedia(mediaResponse);
        setShowVideoOverlay(true);
      } else {
        setScanError(mediaResponse.error || 'No AR content found for this image');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setScanError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCloseOverlay = () => {
    setShowVideoOverlay(false);
    setDetectedMedia(null);
  };

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="scanner-page">
      <Navigation />
      <div className="scanner-container">
        {/* Camera Error State */}
        {error && (
          <div className="scanner-error">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">{error.type === 'https' ? 'HTTPS Required' : 'Camera Error'}</h2>
            <p className="error-message">{error.message}</p>
            {error.type === 'permission' && (
              <div className="error-help">
                <p>To enable camera access:</p>
                <ol>
                  <li>Click the camera icon in your browser's address bar</li>
                  <li>Select "Allow" for camera permissions</li>
                  <li>Refresh this page</li>
                </ol>
              </div>
            )}
            <div className="scanner-actions">
              <button onClick={handleGoBack} className="btn btn-primary">
                ← Go Back
              </button>
              {error.type === 'permission' && (
                <button onClick={handleStartScanning} className="btn btn-secondary">
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Camera View */}
        {!error && (
          <div className="scanner-content">
            <div className="camera-view">
              <video
                ref={videoRef}
                className="camera-video"
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              
              {/* Scan Frame Overlay */}
              <div className="scan-frame-overlay">
                <div className="scan-corners">
                  <div className="corner corner-tl"></div>
                  <div className="corner corner-tr"></div>
                  <div className="corner corner-bl"></div>
                  <div className="corner corner-br"></div>
                </div>
                {isStreaming && <div className="scan-line"></div>}
              </div>

              {/* Scanning Indicator */}
              {isScanning && (
                <div className="scanning-indicator">
                  <div className="spinner"></div>
                  <p>Detecting image...</p>
                </div>
              )}
            </div>

            <div className="scanner-controls">
              <h1 className="scanner-title">AR Scanner</h1>
              <p className="scanner-description">
                Point your camera at a product image to unlock AR content
              </p>

              {scanError && (
                <div className="scan-error-message">
                  <span className="error-icon">❌</span>
                  <span>{scanError}</span>
                </div>
              )}

              <div className="scanner-actions">
                <button 
                  onClick={handleCapture} 
                  className="btn btn-capture"
                  disabled={!isStreaming || isScanning}
                >
                  {isScanning ? 'Scanning...' : '📸 Capture & Scan'}
                </button>
                <button onClick={handleStopScanning} className="btn btn-secondary">
                  Stop Camera
                </button>
                <button onClick={handleGoBack} className="btn btn-outline">
                  ← Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Overlay */}
        {showVideoOverlay && detectedMedia && detectedMedia.data.url && (
          <div className="video-overlay">
            <div className="video-overlay-content">
              <button className="close-overlay" onClick={handleCloseOverlay}>
                ✕
              </button>
              <video
                className="overlay-video"
                src={detectedMedia.data.url}
                controls
                autoPlay
                playsInline
              />
              {detectedMedia.data.metadata && (
                <div className="video-metadata">
                  <h3>AR Content Detected</h3>
                  {detectedMedia.data.metadata.title && (
                    <p className="metadata-title">{detectedMedia.data.metadata.title}</p>
                  )}
                  {detectedMedia.data.metadata.description && (
                    <p className="metadata-description">{detectedMedia.data.metadata.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}