import { useState, useEffect } from 'react';
import AuthWrapper from './pages/AuthWrapper';
import MainAppPage from './pages/MainAppPage';
import { initializeEmailService } from './utils/emailService';
import type { AuthState } from './types';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  });

  // Initialize email service when app starts
  useEffect(() => {
    const initEmail = async () => {
      const initialized = await initializeEmailService();
      if (!initialized) {
        console.warn('⚠️ Email service initialization failed - using fallback mode');
      }
    };
    
    initEmail();
  }, []);

  const handleAuthSuccess = (newAuthState: AuthState) => {
    setAuthState(newAuthState);
  };

  const handleLogout = () => {
    // Clear any stored data
    localStorage.removeItem('rememberedEmail');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null
    });
  };

  return (
    <div className="App">
      {authState.isAuthenticated ? (
        <MainAppPage 
          authState={authState} 
          onLogout={handleLogout} 
        />
      ) : (
        <AuthWrapper onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;
