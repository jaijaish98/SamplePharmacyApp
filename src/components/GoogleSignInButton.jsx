import { useEffect, useRef, useState } from 'react';
import { initializeGoogleAuth, extractUserInfo, GOOGLE_CLIENT_ID } from '../config/googleAuth';
import './GoogleSignInButton.css';

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const googleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const initGoogle = async () => {
      try {
        const google = await initializeGoogleAuth();
        setGoogleLoaded(true);
        
        // Initialize Google Identity Services
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the Google Sign-In button
        if (googleButtonRef.current) {
          google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        }
      } catch (error) {
        console.error('Failed to initialize Google Auth:', error);
        if (onError) {
          onError(error);
        }
      }
    };

    initGoogle();
  }, []);

  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    
    try {
      const userInfo = extractUserInfo(response.credential);
      
      if (userInfo) {
        // Simulate a brief loading time for better UX
        setTimeout(() => {
          setIsLoading(false);
          if (onSuccess) {
            onSuccess({
              ...userInfo,
              role: 'Admin', // Default role for Google SSO users
              loginMethod: 'google'
            });
          }
        }, 1000);
      } else {
        throw new Error('Failed to extract user information');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Google Sign-In Error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  const handleManualSignIn = () => {
    if (!googleLoaded || disabled || isLoading) return;
    
    setIsLoading(true);
    
    // For demo purposes when Google Client ID is not configured
    if (GOOGLE_CLIENT_ID === 'demo-client-id.apps.googleusercontent.com') {
      setTimeout(() => {
        setIsLoading(false);
        if (onSuccess) {
          onSuccess({
            id: 'demo-google-user',
            email: 'admin@sathyapharmacy.com',
            name: 'Demo Google User',
            picture: 'https://via.placeholder.com/96x96/2563eb/ffffff?text=DU',
            given_name: 'Demo',
            family_name: 'User',
            email_verified: true,
            role: 'Admin',
            loginMethod: 'google'
          });
        }
      }, 1500);
      return;
    }

    // Trigger Google One Tap or Sign-In flow
    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      setIsLoading(false);
      console.error('Google Sign-In Error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <div className="google-signin-container">
      {/* Google's rendered button (hidden if demo mode) */}
      <div 
        ref={googleButtonRef} 
        className={`google-button-container ${
          GOOGLE_CLIENT_ID === 'demo-client-id.apps.googleusercontent.com' ? 'hidden' : ''
        }`}
      />
      
      {/* Custom Google Sign-In button for demo mode */}
      {GOOGLE_CLIENT_ID === 'demo-client-id.apps.googleusercontent.com' && (
        <button
          type="button"
          className={`google-signin-btn ${isLoading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={handleManualSignIn}
          disabled={disabled || isLoading}
        >
          <div className="google-signin-content">
            {isLoading ? (
              <>
                <div className="google-spinner"></div>
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default GoogleSignInButton;
