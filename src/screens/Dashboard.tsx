import { CameraStats } from '../components/CameraStats';
import { Activity, ArrowUp, Users, Clock, Camera, Bell, Shield, ChevronRight, PlayCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ApiTest } from '../components/ApiTest';

const activityData = [
  {
    time: '2 minutes ago',
    event: 'Motion detected in Parking Lot',
    type: 'motion',
    camera: 'Parking Lot',
    priority: 'high'
  },
  {
    time: '15 minutes ago',
    event: 'New user badge access at Main Entrance',
    type: 'access',
    camera: 'Main Entrance',
    priority: 'medium'
  },
  {
    time: '1 hour ago',
    event: 'System update completed successfully',
    type: 'system',
    camera: null,
    priority: 'low'
  },
  {
    time: '2 hours ago',
    event: 'Backup completed successfully',
    type: 'system',
    camera: null,
    priority: 'low'
  },
];

const recentRecordings = [
  {
    id: 1,
    camera: 'Main Entrance',
    timestamp: '2 hours ago',
    duration: '1:30',
    size: '250MB',
    thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    camera: 'Parking Lot',
    timestamp: '3 hours ago',
    duration: '2:15',
    size: '320MB',
    thumbnail: 'https://images.unsplash.com/photo-1621972750749-0fbb1abb7736?auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    camera: 'Storage Area',
    timestamp: '4 hours ago',
    duration: '1:45',
    size: '280MB',
    thumbnail: 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&q=80'
  }
];

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

      <ApiTest />
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
            {activityData.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  item.type === 'motion' ? 'bg-red-100' :
                  item.type === 'access' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {item.type === 'motion' ? <Camera className="w-5 h-5 text-red-500" /> :
                   item.type === 'access' ? <Users className="w-5 h-5 text-green-500" /> :
                   <Shield className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-gray-800 font-medium">{item.event}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{item.time}</span>
                        {item.camera && (
                          <span className="text-sm text-gray-500">• {item.camera}</span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority.toUpperCase()}
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

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">CPU Usage</span>
                <span className="text-gray-900 font-medium">{systemHealth.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${systemHealth.cpuUsage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Memory Usage</span>
                <span className="text-gray-900 font-medium">{systemHealth.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${systemHealth.memoryUsage}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Uptime</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.uptime}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Bandwidth</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.bandwidth}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Active Users</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.activeUsers}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">Last Backup</div>
                <div className="text-lg font-semibold mt-1">{systemHealth.lastBackup}</div>
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
          {recentRecordings.map((recording) => (
            <div key={recording.id} className="group relative">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img
                  src={recording.thumbnail}
                  alt={recording.camera}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{recording.camera}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                    <Clock className="w-4 h-4" />
                    {recording.timestamp}
                    <span>•</span>
                    {recording.duration}
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                    <Download className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}