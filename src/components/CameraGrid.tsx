import React, { useState, useEffect } from 'react';
import { Camera, Grid2x2, Grid3x3, Maximize2, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

interface Camera {
  _id: string;
  name: string;
  url: string;
}

export function CameraGrid() {
  const [layout, setLayout] = React.useState<'2x2' | '3x3'>('2x2');
  const [maximizedCamera, setMaximizedCamera] = React.useState<string | null>(null);
  const [mutedCameras, setMutedCameras] = React.useState<Set<string>>(new Set());
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const userCameras = await api.getCameras();
        setCameras(userCameras);
        setError(null);
      } catch (err) {
        setError('An error occurred while fetching your cameras');
        console.error('Error fetching cameras:', err);
      }
    };

    fetchCameras();
  }, []);

  const handleMute = (cameraId: string) => {
    setMutedCameras(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cameraId)) {
        newSet.delete(cameraId);
      } else {
        newSet.add(cameraId);
      }
      return newSet;
    });
  };

  const gridClassName = layout === '2x2' 
    ? 'grid grid-cols-2 gap-4' 
    : 'grid grid-cols-3 gap-4';

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 bg-red-100 text-red-700 rounded-lg">
        <AlertTriangle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Camera className="w-6 h-6 mr-2" />
          Live Camera Feeds
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout('2x2')}
            className={`p-2 rounded-lg ${layout === '2x2' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <Grid2x2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLayout('3x3')}
            className={`p-2 rounded-lg ${layout === '3x3' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className={gridClassName}>
        {cameras.map((camera) => (
          <div 
            key={camera._id}
            className="relative bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-video w-full">
              <iframe
                src={camera.url}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid={`camera-feed-${camera._id}`}
              />
            </div>
            <div className="p-3 bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{camera.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMaximizedCamera(maximizedCamera === camera._id ? null : camera._id)}
                    className="p-2 rounded-lg text-gray-600 hover:text-blue-500"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleMute(camera._id)}
                    className="p-2 rounded-lg text-gray-600 hover:text-blue-500"
                  >
                    {mutedCameras.has(camera._id) ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}