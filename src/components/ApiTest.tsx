import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function ApiTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.test();
        setMessage(response.message);
        setStatus('success');
      } catch {
        setMessage('Failed to connect to backend');
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">API Connection Status</h2>
      <div className={`
        flex items-center gap-2 
        ${status === 'loading' && 'text-yellow-600'}
        ${status === 'success' && 'text-green-600'}
        ${status === 'error' && 'text-red-600'}
      `}>
        <div className={`w-3 h-3 rounded-full 
          ${status === 'loading' && 'bg-yellow-600 animate-pulse'}
          ${status === 'success' && 'bg-green-600'}
          ${status === 'error' && 'bg-red-600'}
        `} />
        <span>{message || status}</span>
      </div>
    </div>
  );
} 