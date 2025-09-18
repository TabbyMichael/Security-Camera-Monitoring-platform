import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Download, Filter, Play, X, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { format, startOfToday, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parse, parseISO } from 'date-fns';

interface Recording {
  _id: string;
  camera: {
    _id: string;
    name: string;
  };
  startTime: string;
  duration: number;
  fileUrl: string;
  type: 'motion' | 'scheduled' | 'manual';
  size: number;
}

export function Recordings() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = React.useState(startOfToday());
  const [currentMonth, setCurrentMonth] = React.useState(format(startOfToday(), 'MMM-yyyy'));
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    camera: 'All Cameras',
    type: 'All Types',
    search: '',
  });

  useEffect(() => {
    const fetchRecordings = async () => {
      setIsLoading(true);
      try {
        const data = await api.getRecordings();
        setRecordings(data);
      } catch (err) {
        setError('Failed to fetch recordings.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecordings();
  }, []);

  const cameras = useMemo(() => {
    const cameraNames = recordings.map(r => r.camera.name);
    return ['All Cameras', ...Array.from(new Set(cameraNames))];
  }, [recordings]);

  const recordingTypes = ['All Types', 'Motion', 'Scheduled', 'Manual'];

  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const days = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth),
  });

  const previousMonth = () => {
    const firstDayNextMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    setCurrentMonth(format(new Date(firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() - 1)), 'MMM-yyyy'));
  };

  const nextMonth = () => {
    const firstDayNextMonth = parse(currentMonth, 'MMM-yyyy', new Date());
    setCurrentMonth(format(new Date(firstDayNextMonth.setMonth(firstDayNextMonth.getMonth() + 1)), 'MMM-yyyy'));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const filteredRecordings = useMemo(() => {
    return recordings.filter(recording => {
      const matchesDate = isSameDay(parseISO(recording.startTime), selectedDate);
      const matchesCamera = filters.camera === 'All Cameras' || recording.camera.name === filters.camera;
      const matchesType = filters.type === 'All Types' || recording.type === filters.type.toLowerCase();
      const matchesSearch = filters.search === '' ||
        recording.camera.name.toLowerCase().includes(filters.search.toLowerCase());

      return matchesDate && matchesCamera && matchesType && matchesSearch;
    });
  }, [recordings, selectedDate, filters]);

  if (isLoading) return <p>Loading recordings...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Recordings</h1>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <CalendarIcon className="w-5 h-5" />
              {format(selectedDate, 'MMM dd, yyyy')}
            </button>

            {showCalendar && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={previousMonth}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-semibold">
                    {format(parse(currentMonth, 'MMM-yyyy', new Date()), 'MMMM yyyy')}
                  </h2>
                  <button onClick={nextMonth}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  {days.map((day: Date) => (
                    <button
                      key={day.toString()}
                      onClick={() => {
                        setSelectedDate(day);
                        setShowCalendar(false);
                      }}
                      className={`
                        text-sm p-2 rounded-full hover:bg-gray-100
                        ${!isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400'}
                        ${isSameDay(day, selectedDate) && 'bg-blue-500 text-white hover:bg-blue-600'}
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search by Camera
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        placeholder="Search cameras..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Camera
                    </label>
                    <select
                      value={filters.camera}
                      onChange={(e) => setFilters({ ...filters, camera: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {cameras.map(camera => (
                        <option key={camera} value={camera}>{camera}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recording Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {recordingTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                Type
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
            {filteredRecordings.map((recording) => (
              <tr key={recording._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{recording.camera.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(parseISO(recording.startTime), 'MMM dd, yyyy')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{format(parseISO(recording.startTime), 'HH:mm:ss')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDuration(recording.duration)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${recording.type === 'motion' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${recording.type === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                    ${recording.type === 'manual' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {recording.type.charAt(0).toUpperCase() + recording.type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatFileSize(recording.size)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <a href={recording.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 mx-2">
                    <Play className="w-5 h-5" />
                  </a>
                  <a href={recording.fileUrl} download className="text-gray-600 hover:text-gray-800">
                    <Download className="w-5 h-5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}