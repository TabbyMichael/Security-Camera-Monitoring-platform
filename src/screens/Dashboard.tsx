import React from 'react';
import { CameraStats } from '../components/CameraStats';
import { Activity, ArrowUp, Users, Clock } from 'lucide-react';

const activityData = [
  { time: '2 minutes ago', event: 'Motion detected in Parking Lot' },
  { time: '15 minutes ago', event: 'New user badge access at Main Entrance' },
  { time: '1 hour ago', event: 'System update completed' },
  { time: '2 hours ago', event: 'Backup completed successfully' },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <CameraStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {activityData.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <p className="text-gray-800">{item.event}</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ArrowUp className="w-6 h-6" />
            System Status
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-500" />
                <span>Active Users</span>
              </div>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-green-500" />
                <span>System Uptime</span>
              </div>
              <span className="font-semibold">99.9%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}