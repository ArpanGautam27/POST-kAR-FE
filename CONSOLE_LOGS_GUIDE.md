# Console Logs Guide - Authentication Flow

## 🎯 How to Check Console Logs

### Step 1: Open Browser Console
```
1. Open http://localhost:5173 in Chrome/Firefox
2. Press F12 (or Cmd+Option+I on Mac)
3. Click "Console" tab
4. Clear console (click trash icon or press Cmd+K)
```

### Step 2: Test Authentication
```
1. Click "Login" button
2. Enter email: ujwalnegi54@gmail.com
3. Click "Send OTP"
4. Watch console for detailed logs!
```

---

## 📊 What You'll See in Console

### When Sending OTP (Step 1)

```javascript
=== [AuthForm] SEND OTP STARTED ===
[AuthForm] Email entered: ujwalnegi54@gmail.com
[AuthForm] Calling authService.sendOTP...

[AuthService] Making request to: https://dev.post-kar.com/api/auth/send-otp
[AuthService] Request config: { method: 'POST', headers: {…} }
[AuthService] Request body: {"email":"ujwalnegi54@gmail.com","type":"login"}

// IF BACKEND IS WORKING:
[AuthService] Response status: 200 OK
[AuthService] Response data: { success: true, message: "OTP sent", otpId: "abc123" }
[AuthForm] sendOTP response: { success: true, otpId: "abc123" }
[AuthForm] ✅ OTP sent successfully!
[AuthForm] OTP ID: abc123
[AuthForm] Moved to OTP verification step
=== [AuthForm] SEND OTP COMPLETED ===

// IF BACKEND IS DOWN (CURRENT ISSUE):
[AuthService] Network error - Failed to fetch. Possible causes:
  1. CORS issue
  2. Backend server is down
  3. Invalid URL: https://dev.post-kar.com/api/auth/send-otp
  4. Network connectivity issue
[AuthService] Request failed: TypeError: Failed to fetch
[AuthForm] ❌ Exception while sending OTP: Error: Network error: Unable to connect to server...
[AuthForm] Error type: Error
[AuthForm] Error message: Network error: Unable to connect to server. Please check your connection or try again later.
[AuthForm] Error stack: Error: Network error...
    at AuthService.makeRequest (AuthService.ts:94)
    at AuthService.sendOTP (AuthService.ts:103)
    ...
=== [AuthForm] SEND OTP COMPLETED ===
```

---

### When Verifying OTP (Step 2)

```javascript
=== [AuthForm] VERIFY OTP STARTED ===
[AuthForm] Email: ujwalnegi54@gmail.com
[AuthForm] OTP entered: 1234
[AuthForm] OTP ID: abc123
[AuthForm] Calling authService.verifyOTP...

[AuthService] Making request to: https://dev.post-kar.com/api/auth/verify-otp
[AuthService] Request config: { method: 'POST', headers: {…} }
[AuthService] Request body: {"email":"ujwalnegi54@gmail.com","otp":"1234","otpId":"abc123","type":"login"}

// IF OTP IS CORRECT:
[AuthService] Response status: 200 OK
[AuthService] Response data: { success: true, token: "eyJhbG...", user: {…} }
[AuthForm] verifyOTP response: { success: true, token: "...", user: {…} }
[AuthForm] ✅ OTP verified successfully!
[AuthForm] JWT Token received: eyJhbGciOiJIUzI1NiIs...
[AuthForm] User data: { id: "user123", email: "ujwalnegi54@gmail.com", ... }
[AuthForm] User logged in, calling onSuccess()
=== [AuthForm] VERIFY OTP COMPLETED ===

// IF OTP IS WRONG:
[AuthService] Response status: 400 Bad Request
[AuthService] API Error: { success: false, message: "Invalid OTP" }
[AuthForm] verifyOTP response: { success: false, message: "Invalid OTP" }
[AuthForm] ❌ OTP verification failed: Invalid OTP
=== [AuthForm] VERIFY OTP COMPLETED ===
```

---

### When Resending OTP

```javascript
=== [AuthForm] RESEND OTP STARTED ===
[AuthForm] Resending OTP to: ujwalnegi54@gmail.com

[AuthService] Making request to: https://dev.post-kar.com/api/auth/send-otp
[AuthService] Request config: { method: 'POST', headers: {…} }
[AuthService] Request body: {"email":"ujwalnegi54@gmail.com","type":"login"}

[AuthService] Response status: 200 OK
[AuthService] Response data: { success: true, otpId: "xyz789" }
[AuthForm] Resend OTP response: { success: true, otpId: "xyz789" }
[AuthForm] ✅ OTP resent successfully!
[AuthForm] New OTP ID: xyz789
=== [AuthForm] RESEND OTP COMPLETED ===
```

---

## 🔍 Key Information in Logs

### 1. Request Details
- **URL being called**: Check if it's the correct endpoint
- **Headers**: Verify Content-Type is application/json
- **Body**: See exact data being sent to backend

### 2. Response Details
- **Status Code**: 200 = success, 400 = bad request, 500 = server error, 524 = timeout
- **Response Data**: See what backend returns
- **Success/Failure**: Clear indication with ✅ or ❌

### 3. Error Information
- **Error Type**: TypeError, Error, etc.
- **Error Message**: What went wrong
- **Error Stack**: Where the error occurred
- **Possible Causes**: Listed for network errors

---

## 🐛 Debugging Common Issues

### Issue: "Failed to fetch"
**Look for:**
```
[AuthService] Network error - Failed to fetch. Possible causes:
  1. CORS issue
  2. Backend server is down  ← Check this!
  3. Invalid URL
  4. Network connectivity issue
```

**Solution:** Check if backend is running on Railway

---

### Issue: "Invalid OTP"
**Look for:**
```
[AuthForm] OTP entered: 1234
[AuthService] Response status: 400 Bad Request
[AuthService] API Error: { message: "Invalid OTP" }
```

**Solution:** Make sure you're entering the correct OTP from your email

---

### Issue: "Invalid session"
**Look for:**
```
[AuthForm] Missing OTP ID - session invalid
```

**Solution:** Click "Send OTP" again to get a new session

---

### Issue: Backend timeout (524)
**Look for:**
```
[AuthService] Response status: 524 Gateway Timeout
```

**Solution:** Backend is taking too long to respond - check Railway logs

---

## 📋 Quick Checklist

When testing auth, verify these in console:

- [ ] **Request URL is correct**: `https://dev.post-kar.com/api/auth/send-otp`
- [ ] **Request body contains email**: `{"email":"...","type":"login"}`
- [ ] **Response status is 200**: Not 400, 500, or 524
- [ ] **Response has success=true**: `{ success: true, ... }`
- [ ] **OTP ID is received**: Check for `otpId` in response
- [ ] **Token is received after verify**: Check for JWT token
- [ ] **No network errors**: No "Failed to fetch" messages

---

## 🎯 Example: Successful Login Flow

```javascript
// Step 1: Send OTP
=== [AuthForm] SEND OTP STARTED ===
[AuthForm] Email entered: ujwalnegi54@gmail.com
[AuthService] Making request to: https://dev.post-kar.com/api/auth/send-otp
[AuthService] Response status: 200 OK
[AuthForm] ✅ OTP sent successfully!
[AuthForm] OTP ID: otp_abc123xyz
=== [AuthForm] SEND OTP COMPLETED ===

// Step 2: Check email and enter OTP
=== [AuthForm] VERIFY OTP STARTED ===
[AuthForm] OTP entered: 5678
[AuthService] Making request to: https://dev.post-kar.com/api/auth/verify-otp
[AuthService] Response status: 200 OK
[AuthForm] ✅ OTP verified successfully!
[AuthForm] JWT Token received: eyJhbGciOiJIUzI1NiIs...
[AuthForm] User logged in, calling onSuccess()
=== [AuthForm] VERIFY OTP COMPLETED ===

// Success! Modal closes, user is logged in
```

---

## 💡 Tips

1. **Keep console open** while testing auth flow
2. **Clear console** before each test for clean logs
3. **Copy error messages** if you need to share them
4. **Check Network tab** too - see actual HTTP requests
5. **Look for ✅ and ❌** - easy to spot success/failure

---

## 🚀 How to Use This

1. Open browser console (F12)
2. Go to http://localhost:5173
3. Click Login
4. Enter email and watch logs in real-time!
5. Share console logs if you need help debugging

**Every action logs detailed info - you can see EXACTLY what's happening!**
