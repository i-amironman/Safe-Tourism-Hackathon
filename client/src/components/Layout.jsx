
import { Outlet, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthModal from './AuthModal';
import { GlobalFooter } from './GlobalFooter';

export default function Layout() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/auth/me', {
        withCredentials: true
      });
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Auth check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true
      });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                SafeTravel
              </Link>
              <div className="hidden md:flex gap-6">
                <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link to="/hospitals" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Hospitals
                </Link>
                <Link to="/hotels" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Hotels
                </Link>
                <Link to="/crime" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Crime Data
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isLoading && (
                user ? (
                  <>
                    <span className="text-gray-700">
                      Welcome, <span className="font-semibold">{user.name}</span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>

      <GlobalFooter />

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onAuthSuccess={handleAuthSuccess}
        />
      )}
    </div>
  );
}
