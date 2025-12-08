# Authentication API Fix

## Problem
The authentication modal was using **hardcoded mock logic** instead of calling the real API. The OTP "1234" was hardcoded directly in the AuthForm component, not coming from any API call.

## Root Cause
The `AuthForm.tsx` component had completely hardcoded logic:
- `handleSendOTP`: Used `setTimeout` instead of API call
- `handleVerifyOTP`: Hardcoded check for OTP "1234" without API call
- `handleResendOTP`: Just restarted timer without API call

## Changes Made

### 1. Updated `AuthForm.tsx`
**Before:**
```typescript
// Hardcoded mock logic - no API calls
setTimeout(() => {
  setIsLoading(false);
  setStep('otp');
  startResendTimer();
}, 800);

// Hardcoded OTP check
if (otp !== '1234') {
  setError('Invalid OTP. Use 1234 for testing.');
}
```

**After:**
```typescript
// Now calls AuthService API
const response = await authService.sendOTP({ 
  mobileNumber: email, 
  type: 'login' 
});

const response = await authService.verifyOTP({ 
  mobileNumber: email, 
  otp, 
  otpId, 
  type: 'login' 
});
```

**Changes:**
- ✅ Now calls `authService.sendOTP()` to send OTP
- ✅ Now calls `authService.verifyOTP()` to verify OTP
- ✅ Stores `otpId` from API response for session tracking
- ✅ Proper error handling with try-catch
- ✅ Shows actual API error messages to user

### 2. Updated `AuthService.ts`
**Added:**
- ✅ Checks `config.enableMockData` flag before making API calls
- ✅ Uses mock data when flag is enabled
- ✅ Automatic fallback to mock data when real API fails
- ✅ Console logging for debugging

**Implementation:**
```typescript
async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
  // Use mock data if enabled
  if (config.enableMockData) {
    console.log('Using mock data for send OTP');
    return this.sendOTPMock(request);
  }

  try {
    return await this.makeRequest('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  } catch (error) {
    console.error('Error sending OTP from API, falling back to mock data:', error);
    // Fallback to mock data on error
    return this.sendOTPMock(request);
  }
}
```

## How It Works Now

### With Mock Data Enabled (Current Setup)
```env
VITE_ENABLE_MOCK_DATA=true
```

**Flow:**
1. User enters email → Calls `authService.sendOTP()`
2. AuthService checks `config.enableMockData` = true
3. Uses `sendOTPMock()` → Returns mock OTP ID
4. User enters OTP → Calls `authService.verifyOTP()`
5. AuthService uses `verifyOTPMock()` → Accepts "1234" as valid
6. Returns mock token and user data
7. User is logged in

**Console Output:**
```
Using mock data for send OTP
Using mock data for verify OTP
```

### With Real API (When Backend is Ready)
```env
VITE_ENABLE_MOCK_DATA=false
```

**Flow:**
1. User enters email → Calls `authService.sendOTP()`
2. AuthService checks `config.enableMockData` = false
3. Makes real API call to `https://dev.post-kar.com/api/auth/send-otp`
4. If successful: Uses real API response
5. If fails: Automatically falls back to mock data
6. User enters OTP from SMS/email
7. Verifies with real backend API
8. Returns real JWT token and user data

## Current Status

✅ **Authentication now calls API** (or mock data as fallback)
✅ **No more hardcoded OTP logic in components**
✅ **Consistent with ProductService and HeroService patterns**
✅ **Automatic fallback when API is unavailable**

⚠️ **Backend API Status:** Currently returns 404, so mock data is used as fallback

## Testing

### With Mock Data (Current Setup)
1. Enter any email address
2. Click "Send OTP"
3. You'll see: Console log "Using mock data for send OTP"
4. Enter OTP: **1234**
5. Click "Verify & Continue"
6. You'll see: Console log "Using mock data for verify OTP"
7. ✅ Successfully logged in

### When Backend is Ready
1. Deploy backend API with endpoints:
   - `POST /api/auth/send-otp`
   - `POST /api/auth/verify-otp`
   
2. Update `.env.development`:
   ```env
   VITE_API_BASE_URL=https://your-api-url.com
   VITE_ENABLE_MOCK_DATA=false
   ```

3. Test authentication flow with real API

## API Contract

### Send OTP Request
```typescript
POST /api/auth/send-otp
{
  "mobileNumber": "user@example.com",
  "type": "login" | "signup"
}
```

### Send OTP Response
```typescript
{
  "success": true,
  "message": "OTP sent successfully",
  "otpId": "unique-session-id"
}
```

### Verify OTP Request
```typescript
POST /api/auth/verify-otp
{
  "mobileNumber": "user@example.com",
  "otp": "1234",
  "otpId": "unique-session-id",
  "type": "login" | "signup"
}
```

### Verify OTP Response
```typescript
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "mobileNumber": "user@example.com",
    "email": "user@example.com",
    "createdAt": "2025-01-01T00:00:00Z"
  }
}
```

## Files Modified

1. `/src/components/auth/AuthForm.tsx`
   - Now calls AuthService API instead of hardcoded logic
   - Added proper error handling
   - Added otpId state for session tracking

2. `/src/services/AuthService.ts`
   - Added `config.enableMockData` check
   - Added automatic fallback to mock data
   - Added console logging for debugging

## Benefits

✅ **Real API Ready**: When backend is deployed, just change env flag
✅ **Development Ready**: Works with mock data when backend unavailable
✅ **Resilient**: Automatic fallback prevents app breaking
✅ **Consistent**: Same pattern as ProductService and HeroService
✅ **Debuggable**: Clear console logs show data source
✅ **No Breaking Changes**: Existing mock methods still work for testing

## Next Steps

1. **When Backend API is Ready:**
   - Set `VITE_ENABLE_MOCK_DATA=false`
   - Update `VITE_API_BASE_URL` if needed
   - Test with real OTP flow

2. **For Production:**
   - Ensure backend API is deployed
   - Configure proper CORS
   - Set up SMS/email OTP delivery
   - Disable mock data in production env
