/**
 * Google OAuth Configuration
 * Using Google Developer Console (not Firebase)
 */

export const googleOAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
};

// Validate configuration
export function validateGoogleOAuthConfig(): boolean {
  if (!googleOAuthConfig.clientId) {
    console.error('❌ VITE_GOOGLE_CLIENT_ID is not set in environment variables');
    return false;
  }
  
  console.log('✅ Google OAuth configured with Client ID:', 
    googleOAuthConfig.clientId.substring(0, 20) + '...'
  );
  return true;
}
