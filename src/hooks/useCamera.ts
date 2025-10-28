import { useState, useEffect, useRef, useCallback } from 'react';

export interface CameraError {
  type: 'permission' | 'not_found' | 'not_supported' | 'https' | 'unknown';
  message: string;
}

export interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  isStreaming: boolean;
  error: CameraError | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  captureImage: () => Promise<Blob | null>;
  hasPermission: boolean;
}

/**
 * Custom hook for camera access and image capture
 * Handles camera permissions, HTTPS requirements, and error states
 */
export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<CameraError | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);

    // Check if running on HTTPS (required for camera access)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError({
        type: 'https',
        message: 'Camera access requires HTTPS. Please use a secure connection.'
      });
      return;
    }

    // Check if mediaDevices API is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError({
        type: 'not_supported',
        message: 'Camera access is not supported in this browser. Please use a modern browser.'
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsStreaming(true);
          setHasPermission(true);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError({
            type: 'permission',
            message: 'Camera permission denied. Please allow camera access in your browser settings.'
          });
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError({
            type: 'not_found',
            message: 'No camera found on this device.'
          });
        } else {
          setError({
            type: 'unknown',
            message: `Failed to access camera: ${err.message}`
          });
        }
      } else {
        setError({
          type: 'unknown',
          message: 'An unknown error occurred while accessing the camera.'
        });
      }
    }
  }, []);

  const captureImage = useCallback(async (): Promise<Blob | null> => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) {
      return null;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      return null;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  }, [isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isStreaming,
    error,
    startCamera,
    stopCamera,
    captureImage,
    hasPermission
  };
}
