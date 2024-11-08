import React from 'react';
import { Calendar, Download, Filter, Play } from 'lucide-react';

const recordings = [
  {
    id: 1,
    camera: 'Main Entrance',
    date: '2024-03-15',
    time: '14:30:00',
    duration: '01:30:00',
    size: '250MB',
  },
  {
    id: 2,
    camera: 'Parking Lot',
    date: '2024-03-15',
    time: '13:15:00',
    duration: '02:00:00',
    size: '350MB',
  },
  {
    id: 3,
    camera: 'Storage Area',
    date: '2024-03-15',
    time: '11:45:00',
    duration: '01:15:00',
    size: '180MB',
  },
];

export function Recordings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Recordings</h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Calendar className="w-5 h-5" />
            Select Date
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Camera
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recordings.map((recording) => (
              <tr key={recording.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{recording.camera}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recording.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recording.time}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recording.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recording.size}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-blue-600 hover:text-blue-800 mx-2">
                    <Play className="w-5 h-5" />
                  </button>
                  <button className="text-gray-600 hover:text-gray-800">
                    <Download className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}