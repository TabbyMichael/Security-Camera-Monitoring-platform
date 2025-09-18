import React, { useState, useEffect } from 'react';
import { CameraStats } from '../components/CameraStats';
import { Activity, ArrowUp, Users, Clock, Camera, Bell, Shield, ChevronRight, PlayCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  _id: string;
  type: string;
  camera: { name: string };
  message: string;
  severity: string;
  createdAt: string;
}

interface Recording {
  _id: string;
  camera: { name: string };
  startTime: string;
  duration: number;
  fileUrl: string;
}

const systemHealth = {
  uptime: '99.9%',
  storage: '2.1TB / 4TB',
  storagePercentage: 52.5,
  bandwidth: '150Mbps',
  activeUsers: 12,
  lastBackup: '2 hours ago',
  cpuUsage: 35,
  memoryUsage: 45
};

export function Dashboard() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [alertsData, recordingsData] = await Promise.all([
          api.getAlerts(),
          api.getRecordings(),
        ]);
        setAlerts(alertsData.slice(0, 4)); // Get latest 4 alerts
        setRecordings(recordingsData.slice(0, 3)); // Get latest 3 recordings
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewAll = (section: 'activity' | 'recordings') => {
    switch (section) {
      case 'activity':
        navigate('/alerts');
        break;
      case 'recordings':
        navigate('/recordings');
        break;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your security system.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/alerts')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Bell className="w-5 h-5" />
            View Alerts
          </button>
          <button 
            onClick={() => navigate('/live')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Camera className="w-5 h-5" />
            Live View
          </button>
        </div>
      </div>

      <CameraStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" />
              Recent Activity
            </h2>
            <button 
              onClick={() => handleViewAll('activity')}
              className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {isLoading ? <p>Loading activity...</p> : alerts.map((item) => (
              <div key={item._id} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  item.type === 'motion' ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {item.type === 'motion' ? <Camera className="w-5 h-5 text-red-500" /> :
                   <Shield className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-800 font-medium">{item.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
                        {item.camera && (
                          <span className="text-sm text-gray-500">• {item.camera.name}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.severity === 'high' || item.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      item.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ArrowUp className="w-6 h-6 text-green-500" />
            System Health
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Storage Usage</span>
                <span className="text-gray-900 font-medium">{systemHealth.storage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${systemHealth.storagePercentage}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Uptime</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.uptime}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.activeUsers}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Recordings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <PlayCircle className="w-6 h-6 text-purple-500" />
            Recent Recordings
          </h2>
          <button 
            onClick={() => handleViewAll('recordings')}
            className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? <p>Loading recordings...</p> : recordings.map((recording) => (
            <div key={recording._id} className="group relative">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{recording.camera.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(recording.startTime), { addSuffix: true })}
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <PlayCircle className="w-12 h-12 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}