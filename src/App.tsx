import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 flex flex-col lg:ml-64">
          <Header />
          <div className="flex-1 p-6">
            <AppRoutes />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;