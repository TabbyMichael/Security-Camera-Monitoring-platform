import React from 'react';
import { AlertTriangle, Camera, Clock, MapPin } from 'lucide-react';

const alerts = [
  {
    id: 1,
    type: 'Motion Detected',
    camera: 'Main Entrance',
    location: 'Front Door',
    timestamp: '2 minutes ago',
    severity: 'high',
  },
  {
    id: 2,
    type: 'Camera Offline',
    camera: 'Storage Area',
    location: 'Back Building',
    timestamp: '15 minutes ago',
    severity: 'critical',
  },
  {
    id: 3,
    type: 'Low Light Warning',
    camera: 'Parking Lot',
    location: 'North Side',
    timestamp: '1 hour ago',
    severity: 'medium',
  },
];

const severityColors = {
  low: 'bg-yellow-100 text-yellow-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  critical: 'bg-red-100 text-red-800 animate-pulse',
};

export function Alerts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-500" />
          Active Alerts
        </h1>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      severityColors[alert.severity]
                    }`}
                  >
                    {alert.type}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Camera className="w-4 h-4" />
                    <span>{alert.camera}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{alert.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}