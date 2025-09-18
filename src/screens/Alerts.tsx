import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AlertTriangle, Camera, Clock, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface Alert {
  _id: string;
  type: 'motion' | 'offline' | 'tampering' | 'low_light';
  camera: {
    _id: string;
    name: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  resolved: boolean;
  createdAt: string;
}

const severityConfig = {
  low: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  medium: {
    color: 'bg-orange-100 text-orange-800',
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  },
  high: {
    color: 'bg-red-100 text-red-800',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  },
  critical: {
    color: 'bg-red-200 text-red-900 animate-pulse',
    icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
  },
};

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const data = await api.getAlerts();
        setAlerts(data);
      } catch (err) {
        setError('Failed to fetch alerts.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const handleResolve = async (alertId: string) => {
    try {
      const updatedAlert = await api.resolveAlert(alertId);
      setAlerts(alerts.map(a => a._id === alertId ? updatedAlert : a));
      toast.success('Alert resolved successfully!');
    } catch (err) {
      toast.error('Failed to resolve alert.');
    }
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  if (isLoading) return <p>Loading alerts...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <AlertTriangle className="w-7 h-7 text-red-500" />
          Active Alerts ({activeAlerts.length})
        </h1>
        <div className="space-y-4">
          {activeAlerts.length > 0 ? activeAlerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="pt-1">{severityConfig[alert.severity].icon}</div>
                  <div className="space-y-1">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        severityConfig[alert.severity].color
                      }`}
                    >
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </span>
                    <p className="text-gray-800 font-medium">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        <span>{alert.camera.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(alert._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-semibold"
                >
                  Resolve
                </button>
              </div>
            </div>
          )) : <p className="text-gray-500">No active alerts.</p>}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
          <CheckCircle className="w-7 h-7 text-green-500" />
          Resolved Alerts ({resolvedAlerts.length})
        </h1>
        <div className="space-y-4">
        {resolvedAlerts.length > 0 ? resolvedAlerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-white rounded-lg shadow-sm p-4 opacity-70"
            >
              <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                  <div className="pt-1"><CheckCircle className="w-5 h-5 text-green-500" /></div>
                  <div className="space-y-1">
                    <p className="text-gray-600">{alert.message}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        <span>{alert.camera.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : <p className="text-gray-500">No resolved alerts.</p>}
        </div>
      </div>
    </div>
  );
}