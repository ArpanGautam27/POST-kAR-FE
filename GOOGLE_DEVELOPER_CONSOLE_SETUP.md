# Google Developer Console Setup for OAuth

Complete guide to set up Google OAuth authentication using Google Developer Console (not Firebase).

## Prerequisites

- Google Account
- Access to Google Cloud Console
- Your frontend domain (e.g., `localhost:5173` for dev, `post-kar.com` for production)

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a project** → **New Project**
3. Enter project details:
   - **Project name**: `PostKAR`
   - **Location**: Leave as default or select your organization
4. Click **Create**
5. Wait for project creation (takes a few seconds)

---

## Step 2: Enable Google+ API (Required for OAuth)

1. In Google Cloud Console, select your project
2. Go to **APIs & Services** → **Library**
3. Search for **Google+ API** or **People API**
4. Click on it and click **Enable**
5. Also enable **Google OAuth2 API** if available

---

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** (for public use) or **Internal** (for organization only)
3. Click **Create**

### Fill out the consent screen:

**App information:**
- **App name**: `PostKAR`
- **User support email**: Your email (e.g., `support@post-kar.com`)
- **App logo**: (Optional) Upload your logo

**App domain:**
- **Application home page**: `https://post-kar.com`
- **Application privacy policy**: `https://post-kar.com/privacy`
- **Application terms of service**: `https://post-kar.com/terms`

**Authorized domains:**
- Add `post-kar.com` (your production domain)
- For localhost, no need to add

**Developer contact information:**
- **Email addresses**: Your email

4. Click **Save and Continue**

### Scopes (Step 2):
5. Click **Add or Remove Scopes**
6. Select these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Click **Update** → **Save and Continue**

### Test users (Step 3):
8. (Optional) Add test users if app is in testing mode
9. Click **Save and Continue**

10. Review summary and click **Back to Dashboard**

---

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Select **Application type**: **Web application**

### Configure Web Client:

**Name**: `PostKAR Web Client`

**Authorized JavaScript origins**:
Add these URIs (one per line):
```
http://localhost:5173
https://localhost:5173
https://post-kar.com
https://dev.post-kar.com
```

**Authorized redirect URIs**:
Add these URIs (one per line):
```
http://localhost:5173
https://localhost:5173
https://post-kar.com
https://dev.post-kar.com
```

4. Click **Create**

### Save Your Credentials:

You'll see a popup with:
- **Client ID**: `123456789-abc123xyz.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxxxxx`

**Important**: 
- Copy the **Client ID** (you'll need it for frontend)
- Copy the **Client Secret** (you'll need it for backend)
- Click **OK**

---

## Step 5: Update Environment Variables

### Frontend (.env.development):

```bash
# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
```

### Backend (.env):

```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abc123xyz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
```

---

## Step 6: Backend Implementation

Your backend needs to handle Google OAuth access tokens.

### Endpoint: `POST /api/auth/google`

**Request:**
```json
{
  "accessToken": "ya29.a0AfB_..." 
}
```

**Response:**
```json
{
  "success": true,
  "token": "your-jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@gmail.com",
    "createdAt": "2025-12-16T12:00:00.000Z"
  }
}
```

### Backend Code (Node.js/Express):

#### Install Dependencies:
```bash
npm install googleapis
```

#### Implementation:

```javascript
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { accessToken } = req.body;
    
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify access token and get user info
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const googleUser = await userInfoResponse.json();
    console.log('Google user info:', googleUser);

    // Extract user data
    const { email, name, sub: googleId, picture } = googleUser;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google'
      });
    }

    // Find or create user in your database
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name,
        googleId,
        profilePicture: picture,
        authProvider: 'google',
        createdAt: new Date()
      });
      console.log('New user created:', user.id);
    } else {
      // Update existing user
      user.googleId = googleId;
      user.profilePicture = picture;
      user.name = name || user.name;
      await user.save();
      console.log('Existing user updated:', user.id);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({
      success: false,
      message: 'Failed to authenticate with Google'
    });
  }
});
```

---

## Step 7: Testing

### 1. Update Environment Variables
Make sure your `.env.development` has the correct Google Client ID.

### 2. Restart Development Server
```bash
npm run dev
```

### 3. Test Authentication
1. Open app in browser (https://localhost:5173)
2. Click **Sign In** button
3. Click **Continue with Google**
4. Google OAuth consent screen appears
5. Select your Google account
6. Grant permissions
7. Should redirect back and authenticate

### 4. Check Console Logs
**Frontend Console:**
```
[GoogleSignInButton] ✅ Google Sign-In successful
[GoogleSignInButton] Access token received
[GoogleSignInButton] ✅ Backend authentication successful
```

**Backend Console:**
```
Google user info: { email: '...', name: '...', ... }
New user created: user-id-123
```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI doesn't match what's configured in Google Console.

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Make sure these are added:
   - `http://localhost:5173`
   - `https://localhost:5173`
4. **Important**: No trailing slashes!

### Error: "Access blocked: This app's request is invalid"

**Cause**: OAuth consent screen not properly configured.

**Solution**:
1. Complete all required fields in OAuth consent screen
2. Add your domain to **Authorized domains**
3. Make sure app is published (or add yourself as test user)

### Error: "idpiframe_initialization_failed"

**Cause**: Cookies are blocked or browser security settings.

**Solution**:
1. Allow third-party cookies for localhost
2. Use HTTPS (Vite uses HTTPS by default)
3. Clear browser cache and cookies

### Pop-up Blocked

**Cause**: Browser blocked the OAuth popup.

**Solution**:
1. Allow pop-ups for your domain
2. User should click the button again

### Backend: "Failed to fetch user info"

**Cause**: Invalid or expired access token.

**Solution**:
1. Verify token is being sent correctly
2. Check network tab for actual token value
3. Test token manually: `curl -H "Authorization: Bearer TOKEN" https://www.googleapis.com/oauth2/v3/userinfo`

---

## Production Deployment

### Before Going Live:

1. **Publish OAuth App**:
   - Go to OAuth consent screen
   - Click **Publish App**
   - May require verification if requesting sensitive scopes

2. **Add Production Domains**:
   - Update **Authorized JavaScript origins** with production domain
   - Update **Authorized redirect URIs** with production domain

3. **Environment Variables**:
   - Create `.env.production` with production Client ID
   - Never commit `.env` files to Git

4. **Test in Production**:
   - Test OAuth flow on production domain
   - Verify user data is saved correctly
   - Check all scopes work as expected

---

## Security Best Practices

✅ **DO**:
- Always verify access tokens on backend
- Use HTTPS in production
- Store Client Secret securely (backend only)
- Implement token refresh if needed
- Add rate limiting to auth endpoints

❌ **DON'T**:
- Never expose Client Secret in frontend
- Don't skip token verification
- Don't trust user data from frontend without verification
- Don't commit credentials to Git

---

## Files Modified

### Frontend:
- `src/config/googleOAuth.ts` - Google OAuth config
- `src/components/auth/GoogleSignInButton.tsx` - Google Sign-In button
- `src/components/auth/AuthForm.tsx` - Updated to use Google Sign-In
- `src/services/AuthService.ts` - Added `googleAuth()` method
- `src/router/AppRouter.tsx` - Wrapped with GoogleOAuthProvider
- `.env.development` - Added VITE_GOOGLE_CLIENT_ID

### Backend:
- Create `POST /api/auth/google` endpoint
- Install `googleapis` package
- Add Google OAuth verification logic

---

## API Reference

### Google OAuth 2.0 Endpoints

**User Info**:
```
GET https://www.googleapis.com/oauth2/v3/userinfo
Authorization: Bearer {access_token}
```

**Token Info** (for debugging):
```
GET https://oauth2.googleapis.com/tokeninfo?access_token={access_token}
```

### Response Format

**User Info Response**:
```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "given_name": "John",
  "family_name": "Doe",
  "picture": "https://lh3.googleusercontent.com/...",
  "email": "john@gmail.com",
  "email_verified": true,
  "locale": "en"
}
```

---

## Support

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)

---

## Next Steps

1. ✅ Frontend implementation (completed)
2. ⏳ Create Google Cloud project
3. ⏳ Configure OAuth consent screen
4. ⏳ Get Client ID and Client Secret
5. ⏳ Update environment variables
6. ⏳ Implement backend endpoint
7. ⏳ Test authentication flow
8. ⏳ Deploy to production
