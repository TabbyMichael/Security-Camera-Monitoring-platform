import React from 'react';
import { Search, Camera, Video, Bell, X, Clock, History, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SearchResult = {
  id: string;
  type: 'camera' | 'recording' | 'alert';
  title: string;
  subtitle: string;
  timestamp?: string;
  priority?: 'high' | 'medium' | 'low';
};

type SearchHistory = {
  query: string;
  timestamp: number;
};

export function SearchBar() {
  const [query, setQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [searchHistory, setSearchHistory] = React.useState<SearchHistory[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const demoResults: SearchResult[] = [
    { 
      id: '1', 
      type: 'camera', 
      title: 'Main Entrance', 
      subtitle: 'Front Door', 
      timestamp: 'Online',
      priority: 'high'
    },
    { 
      id: '2', 
      type: 'camera', 
      title: 'Parking Lot', 
      subtitle: 'North Side', 
      timestamp: 'Online',
      priority: 'medium'
    },
    { 
      id: '3', 
      type: 'recording', 
      title: 'Motion Detection', 
      subtitle: 'Main Entrance', 
      timestamp: '2 hours ago',
      priority: 'low'
    },
    { 
      id: '4', 
      type: 'alert', 
      title: 'Motion Detected', 
      subtitle: 'Parking Lot', 
      timestamp: '15 mins ago',
      priority: 'high'
    },
  ];

  // Save search to history
  const saveToHistory = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [
      { query: searchQuery, timestamp: Date.now() },
      ...searchHistory.filter(h => h.query !== searchQuery),
    ].slice(0, 5); // Keep only last 5 searches
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Debounced search function
  const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  const handleSearch = React.useCallback(
    debounce((...args: unknown[]) => {
      const value = args[0] as string;
      if (value.length > 0) {
        setIsSearching(true);
        // Filter and sort results based on priority and relevance
        const filtered = demoResults
          .filter(result => 
            result.title.toLowerCase().includes(value.toLowerCase()) ||
            result.subtitle.toLowerCase().includes(value.toLowerCase())
          )
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority || 'low'] || 0) - (priorityOrder[a.priority || 'low'] || 0);
          });
        setResults(filtered);
      } else {
        setIsSearching(false);
        setResults([]);
      }
    }, 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    handleSearch(value);
    setShowHistory(value.length === 0);
  };

  const handleResultClick = (result: SearchResult) => {
    saveToHistory(query);
    setIsSearching(false);
    setQuery('');
    // Navigate based on result type
    switch (result.type) {
      case 'camera':
        navigate('/live');
        break;
      case 'recording':
        navigate('/recordings');
        break;
      case 'alert':
        navigate('/alerts');
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = showHistory ? searchHistory : results;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < items.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          if (showHistory) {
            const historyItem = items[selectedIndex] as SearchHistory;
            setQuery(historyItem.query);
            handleSearch(historyItem.query);
            setShowHistory(false);
          } else {
            handleResultClick(items[selectedIndex] as SearchResult);
          }
        }
        break;
      case 'Escape':
        setIsSearching(false);
        setShowHistory(false);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'camera':
        return <Camera className="w-5 h-5" />;
      case 'recording':
        return <Video className="w-5 h-5" />;
      case 'alert':
        return <Bell className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearching(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input on keyboard shortcut
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(!query)}
          placeholder="Search cameras, recordings, or alerts... (Ctrl + K)"
          className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsSearching(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {(isSearching || showHistory) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {showHistory && searchHistory.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-500">
                <span className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
              {searchHistory.map((item, index) => (
                <button
                  key={item.timestamp}
                  onClick={() => {
                    setQuery(item.query);
                    handleSearch(item.query);
                    setShowHistory(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-gray-50' : ''
                  }`}
                >
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{item.query}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="py-2">
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-gray-50' : ''
                      }`}
                    >
                      <div className={`
                        p-2 rounded-lg
                        ${result.type === 'camera' ? 'bg-blue-100 text-blue-600' : ''}
                        ${result.type === 'recording' ? 'bg-purple-100 text-purple-600' : ''}
                        ${result.type === 'alert' ? 'bg-red-100 text-red-600' : ''}
                      `}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">{result.title}</div>
                        <div className="text-sm text-gray-500">{result.subtitle}</div>
                      </div>
                      {result.timestamp && (
                        <div className="text-sm text-gray-500">{result.timestamp}</div>
                      )}
                      {result.priority && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${result.priority === 'high' ? 'bg-red-100 text-red-600' : ''}
                          ${result.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : ''}
                          ${result.priority === 'low' ? 'bg-green-100 text-green-600' : ''}
                        `}>
                          {result.priority.toUpperCase()}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 