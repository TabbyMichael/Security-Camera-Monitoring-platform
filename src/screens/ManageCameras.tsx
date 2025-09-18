import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface Camera {
  _id: string;
  name: string;
  url: string;
}

export function ManageCameras() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setIsLoading(true);
        const response = await api.getCameras();
        setCameras(response);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch cameras');
        setIsLoading(false);
      }
    };
    fetchCameras();
  }, []);

  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newCamera = await api.addCamera({ name, url });
      setCameras([...cameras, newCamera]);
      setName('');
      setUrl('');
      toast.success('Camera added successfully!');
    } catch (err) {
      setError('Failed to add camera');
      toast.error('Failed to add camera');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Cameras</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Camera</h2>
        <form onSubmit={handleAddCamera} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Camera Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">Camera URL</label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Camera
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Cameras</h2>
        {isLoading ? (
          <p>Loading cameras...</p>
        ) : (
          <ul className="space-y-3">
            {cameras.map(camera => (
              <li key={camera._id} className="p-3 border rounded-md flex justify-between items-center">
                <span>{camera.name}</span>
                <span className="text-gray-500 text-sm">{camera.url}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
