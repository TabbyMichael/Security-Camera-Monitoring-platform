import React from 'react';
import { Camera, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function CameraStats() {
  const stats = [
    {
      icon: Camera,
      label: 'Total Cameras',
      value: '16',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: CheckCircle,
      label: 'Online',
      value: '14',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: AlertTriangle,
      label: 'Alerts',
      value: '3',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      icon: Clock,
      label: 'Recording',
      value: '12',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-semibold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}