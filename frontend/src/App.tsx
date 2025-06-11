import { useState, useEffect } from 'react';
import AuthWrapper from './pages/AuthWrapper';
import MainAppPage from './pages/MainAppPage';
import UseCasesPage from './pages/UseCasesPage';
import { initializeEmailService } from './utils/emailService';
import type { AuthState } from './types';
import backgroundImage from './assets/3293677.png';

type AppMode = 'auth' | 'useCases' | 'voiceInvoice';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null
  });
  const [appMode, setAppMode] = useState<AppMode>('auth');

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
    setAppMode('useCases'); // Go to use cases page after successful authentication
  };

  const handleSelectUseCase = (useCase: string) => {
    if (useCase === 'voice-invoice') {
      setAppMode('voiceInvoice');
    }
    // Add more use cases here in the future
  };

  const handleGoToUseCases = () => {
    setAppMode('useCases');
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
    setAppMode('auth'); // Return to auth page
  };

  return (
    <div
      className="App min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10">
        {appMode === 'auth' ? (
          <AuthWrapper onAuthSuccess={handleAuthSuccess} />
        ) : appMode === 'useCases' ? (
          <UseCasesPage
            authState={authState}
            onSelectUseCase={handleSelectUseCase}
            onLogout={handleLogout}
            onGoToUseCases={handleGoToUseCases}
          />
        ) : (
          <MainAppPage
            authState={authState}
            onLogout={handleLogout}
            onGoToUseCases={handleGoToUseCases}
          />
        )}
      </div>
    </div>
  );
}

export default App;
