# Waitlist & Visit Counter API Integration Guide

This document describes the frontend integration with Spring Boot backend APIs for waitlist and visit counter functionality.

## Overview

The frontend now integrates with two main backend APIs:
1. **Waitlist API** - Manages user waitlist registrations
2. **Visit Counter API** - Tracks and displays real-time visit statistics

## API Endpoints

### 1. Waitlist API

#### Join Waitlist
```
POST /api/waitlist/join
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "mobileNumber": "string (required, 10 digits)",
  "email": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist!",
  "data": {
    "id": "string",
    "mobileNumber": "string",
    "joinedAt": "ISO 8601 timestamp"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message"
}
```

### 2. Visit Counter API

#### Get Visit Statistics
```
GET /api/visits/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalVisits": 635,
    "activeNow": 5,
    "lastUpdated": "ISO 8601 timestamp"
  }
}
```

#### Record Visit
```
POST /api/visits/record
```

**Request Body:**
```json
{
  "sessionId": "string (optional, for existing sessions)",
  "timestamp": "ISO 8601 timestamp"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Visit recorded successfully",
  "sessionId": "string (unique session identifier)"
}
```

## Frontend Implementation

### Services

#### WaitlistService (`src/services/WaitlistService.ts`)
Handles waitlist API calls with both production and mock implementations.

**Usage:**
```typescript
import { waitlistService } from '../services/WaitlistService';

// Production
const response = await waitlistService.join({
  mobileNumber: '9876543210',
  name: 'John Doe',
  email: 'john@example.com'
});

// Mock (for development)
const response = await waitlistService.joinMock({
  mobileNumber: '9876543210'
});
```

#### VisitCounterService (`src/services/VisitCounterService.ts`)
Manages visit tracking with automatic periodic sync every 10 seconds.

**Usage:**
```typescript
import { visitCounterService } from '../services/VisitCounterService';

// Start periodic sync (production)
visitCounterService.startPeriodicSync((stats) => {
  console.log('Total visits:', stats.totalVisits);
  console.log('Active now:', stats.activeNow);
});

// Start periodic sync with mock data (development)
visitCounterService.startPeriodicSyncMock((stats) => {
  setVisitStats(stats);
});

// Stop periodic sync (cleanup)
visitCounterService.stopPeriodicSync();

// Subscribe to updates
const unsubscribe = visitCounterService.subscribe((stats) => {
  console.log('Stats updated:', stats);
});

// Unsubscribe when done
unsubscribe();
```

### Integration Points

#### 1. Landing Page (`src/pages/LandingPage.tsx`)
- Displays real-time visit statistics
- Updates every 10 seconds automatically
- Shows total visits and active users

**Implementation:**
```typescript
const [visitStats, setVisitStats] = useState<VisitStats>({
  totalVisits: 635,
  activeNow: 1,
  lastUpdated: new Date().toISOString()
});

useEffect(() => {
  // Start visit counter periodic sync
  if (config.enableMockData) {
    visitCounterService.startPeriodicSyncMock((stats) => {
      setVisitStats(stats);
    });
  } else {
    visitCounterService.startPeriodicSync((stats) => {
      setVisitStats(stats);
    });
  }

  // Cleanup on unmount
  return () => {
    visitCounterService.stopPeriodicSync();
  };
}, []);
```

#### 2. Auth Form (`src/components/auth/AuthForm.tsx`)
- Automatically joins waitlist after successful OTP verification
- Non-blocking - errors don't prevent authentication flow

**Implementation:**
```typescript
// Join waitlist after successful authentication
try {
  if (config.enableMockData) {
    await waitlistService.joinMock({ mobileNumber });
  } else {
    await waitlistService.join({ mobileNumber });
  }
} catch (waitlistError) {
  // Log error but don't block the flow
  console.error('Failed to join waitlist:', waitlistError);
}
```

## Environment Configuration

### Development (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENABLE_MOCK_DATA=true
```

### Production (`.env.production`)
```env
VITE_API_BASE_URL=https://your-backend-domain.com
VITE_ENABLE_MOCK_DATA=false
```

## Backend Requirements

### Spring Boot Backend Structure

Your Spring Boot backend should implement the following:

#### 1. Waitlist Controller
```java
@RestController
@RequestMapping("/api/waitlist")
public class WaitlistController {
    
    @PostMapping("/join")
    public ResponseEntity<WaitlistResponse> joinWaitlist(@RequestBody WaitlistRequest request) {
        // Implementation
    }
}
```

#### 2. Visit Counter Controller
```java
@RestController
@RequestMapping("/api/visits")
public class VisitController {
    
    @GetMapping("/stats")
    public ResponseEntity<VisitStatsResponse> getStats() {
        // Implementation
    }
    
    @PostMapping("/record")
    public ResponseEntity<RecordVisitResponse> recordVisit(@RequestBody RecordVisitRequest request) {
        // Implementation
    }
}
```

### MongoDB Schema

#### Waitlist Collection
```javascript
{
  _id: ObjectId,
  name: String,
  mobileNumber: String (indexed, unique),
  email: String,
  joinedAt: Date,
  status: String // 'pending', 'contacted', 'converted'
}
```

#### Visits Collection
```javascript
{
  _id: ObjectId,
  sessionId: String (indexed, unique),
  timestamp: Date,
  lastActivity: Date,
  ipAddress: String,
  userAgent: String
}
```

### Visit Counter Logic

The backend should:
1. **Record Visit**: Create or update session with current timestamp
2. **Get Stats**:
   - `totalVisits`: Count of unique sessions
   - `activeNow`: Count of sessions with `lastActivity` within last 5 minutes
   - `lastUpdated`: Current timestamp

#### Example Implementation
```java
public VisitStats getStats() {
    long totalVisits = visitRepository.count();
    
    // Active users: sessions active in last 5 minutes
    Date fiveMinutesAgo = new Date(System.currentTimeMillis() - 5 * 60 * 1000);
    long activeNow = visitRepository.countByLastActivityAfter(fiveMinutesAgo);
    
    return new VisitStats(totalVisits, activeNow, new Date());
}
```

## CORS Configuration

Ensure your Spring Boot backend allows requests from the frontend:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins(
                        "http://localhost:5173",  // Vite dev server
                        "https://postkar-fe.netlify.app"  // Production
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

## Testing

### Development Mode (Mock Data)
1. Set `VITE_ENABLE_MOCK_DATA=true` in `.env.development`
2. Run frontend: `npm run dev`
3. Mock services will simulate API responses

### Production Mode (Real API)
1. Set `VITE_ENABLE_MOCK_DATA=false` in `.env.production`
2. Ensure Spring Boot backend is running
3. Build frontend: `npm run build`
4. Deploy built files to Spring Boot's `static` directory

## Deployment

### Option 1: Separate Deployment
- Frontend: Netlify/Vercel
- Backend: Heroku/Railway/AWS
- Update `VITE_API_BASE_URL` to backend URL

### Option 2: Integrated Deployment (Recommended)
1. Build frontend: `npm run build`
2. Copy `dist/` contents to Spring Boot's `src/main/resources/static/`
3. Deploy Spring Boot application
4. Frontend will be served from same domain as backend

```bash
# Build frontend
npm run build

# Copy to Spring Boot static directory
cp -r dist/* ../backend/src/main/resources/static/

# Build and run Spring Boot
cd ../backend
./mvnw clean package
java -jar target/postkar-backend.jar
```

## Troubleshooting

### Issue: CORS errors
**Solution**: Verify CORS configuration in Spring Boot backend

### Issue: Visit counter not updating
**Solution**: Check browser console for errors, verify backend `/api/visits/stats` endpoint

### Issue: Waitlist API fails
**Solution**: Verify backend is running on correct port (8080), check network tab for request details

### Issue: Mock data in production
**Solution**: Ensure `VITE_ENABLE_MOCK_DATA=false` in production environment

## Performance Considerations

1. **Visit Counter Sync Interval**: Currently 10 seconds, adjust in `VisitCounterService.ts` if needed
2. **Session Storage**: Uses `sessionStorage` for session persistence
3. **Error Handling**: All API calls have proper error handling and fallbacks
4. **Non-blocking**: Waitlist join doesn't block authentication flow

## Future Enhancements

- [ ] Add analytics tracking for waitlist conversions
- [ ] Implement visit heatmap by time of day
- [ ] Add geographic distribution of visits
- [ ] Email notifications for waitlist users
- [ ] Admin dashboard for waitlist management
