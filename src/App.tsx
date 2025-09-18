import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AppRoutes } from './routes';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import { Toaster } from 'react-hot-toast';

// Create a wrapper component to use the hook
function MainContent() {
  const { isOpen } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${
        isOpen ? 'ml-64' : 'ml-20'
      }`}>
        <Header />
        <div className="flex-1 p-6">
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SidebarProvider>
        <MainContent />
        <Toaster position="top-right" />
      </SidebarProvider>
    </Router>
  );
}

export default App;