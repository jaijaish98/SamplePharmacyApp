// Google OAuth Configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id.apps.googleusercontent.com';

// Google OAuth Configuration
export const googleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  callback: handleGoogleCallback,
  auto_select: false,
  cancel_on_tap_outside: true,
};

// Handle Google OAuth callback
function handleGoogleCallback(response) {
  console.log('Google OAuth Response:', response);
  return response;
}

// Initialize Google OAuth
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.google !== 'undefined') {
      resolve(window.google);
    } else {
      // Wait for Google script to load
      const checkGoogle = setInterval(() => {
        if (typeof window.google !== 'undefined') {
          clearInterval(checkGoogle);
          resolve(window.google);
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkGoogle);
        reject(new Error('Google Identity Services failed to load'));
      }, 10000);
    }
  });
};

// Decode JWT token
export const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Extract user info from Google response
export const extractUserInfo = (credential) => {
  const userInfo = decodeJWT(credential);
  if (!userInfo) return null;
  
  return {
    id: userInfo.sub,
    email: userInfo.email,
    name: userInfo.name,
    picture: userInfo.picture,
    given_name: userInfo.given_name,
    family_name: userInfo.family_name,
    email_verified: userInfo.email_verified,
  };
};
