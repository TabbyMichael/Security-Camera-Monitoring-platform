import React from 'react';
import { Camera, Grid2x2, Grid3x3, Maximize2, Minimize2, Video, Volume2, VolumeX } from 'lucide-react';

type CameraFeed = {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'offline';
  recording: boolean;
};

const demoFeeds: CameraFeed[] = [
  { id: '1', name: 'Main Entrance', location: 'Front Door', status: 'online', recording: true },
  { id: '2', name: 'Parking Lot', location: 'North Side', status: 'online', recording: true },
  { id: '3', name: 'Storage Area', location: 'Back Building', status: 'offline', recording: false },
  { id: '4', name: 'Side Gate', location: 'East Wing', status: 'online', recording: true },
  { id: '5', name: 'Reception', location: 'Main Building', status: 'online', recording: true },
  { id: '6', name: 'Loading Dock', location: 'Warehouse', status: 'online', recording: false }
];

export function CameraGrid() {
  const [layout, setLayout] = React.useState<'2x2' | '3x3'>('2x2');
  const [selectedCamera, setSelectedCamera] = React.useState<string | null>(null);
  const [maximizedCamera, setMaximizedCamera] = React.useState<string | null>(null);
  const [mutedCameras, setMutedCameras] = React.useState<Set<string>>(new Set());

  const handleMaximize = (feedId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the camera selection
    setMaximizedCamera(maximizedCamera === feedId ? null : feedId);
  };

  const handleMute = (feedId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the camera selection
    setMutedCameras(prev => {
      const newMuted = new Set(prev);
      if (newMuted.has(feedId)) {
        newMuted.delete(feedId);
      } else {
        newMuted.add(feedId);
      }
      return newMuted;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Camera className="w-6 h-6" />
          <h2 className="text-xl font-bold">Live Camera Feeds</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout('2x2')}
            className={`p-2 rounded-lg ${
              layout === '2x2' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Grid2x2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLayout('3x3')}
            className={`p-2 rounded-lg ${
              layout === '3x3' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        className={`grid gap-4 ${
          maximizedCamera 
            ? 'grid-cols-1' 
            : layout === '2x2' 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-3'
        }`}
      >
        {demoFeeds
          .filter(feed => !maximizedCamera || feed.id === maximizedCamera)
          .map((feed) => (
          <div
            key={feed.id}
            className={`bg-gray-900 rounded-lg overflow-hidden relative group ${
              selectedCamera === feed.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedCamera(feed.id)}
          >
            <div className="aspect-video bg-gray-800 relative">
              <img
                src={`https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?auto=format&fit=crop&w=800&q=80`}
                alt={feed.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h3 className="text-white font-medium">{feed.name}</h3>
                <p className="text-gray-300 text-sm">{feed.location}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => handleMute(feed.id, e)}
                  className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                  title={mutedCameras.has(feed.id) ? "Unmute" : "Mute"}
                >
                  {mutedCameras.has(feed.id) ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <button 
                  onClick={(e) => handleMaximize(feed.id, e)}
                  className="p-2 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                  title={maximizedCamera === feed.id ? "Minimize" : "Maximize"}
                >
                  {maximizedCamera === feed.id ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feed.status === 'online'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}
                >
                  {feed.status.toUpperCase()}
                </span>
                {feed.recording && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-500 flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    REC
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}