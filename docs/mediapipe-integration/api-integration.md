# API Integration for MediaPipe Proctoring

## Backend Requirements

### Database Schema Extensions

#### Proctoring Events Table

```sql
CREATE TABLE proctoring_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attempt_id BIGINT NOT NULL,
    event_type ENUM('face_not_detected', 'multiple_faces', 'looking_away', 'suspicious_movement'),
    timestamp TIMESTAMP NOT NULL,
    confidence DECIMAL(3,2),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (attempt_id) REFERENCES attempts(id)
);
```

#### Assessment Settings Extension

```sql
ALTER TABLE assessments ADD COLUMN proctoring_settings JSON;

-- Example proctoring_settings JSON:
{
  "enabled": true,
  "face_detection": true,
  "multiple_person_detection": true,
  "attention_monitoring": true,
  "violation_threshold": 5,
  "auto_terminate": true,
  "warning_threshold": 3
}
```

## API Endpoints

### 1. Start Proctoring Session

```http
POST /api/attempts/{attemptId}/proctoring/start
Content-Type: application/json

{
  "browser_info": {
    "user_agent": "string",
    "screen_resolution": "1920x1080",
    "timezone": "UTC"
  }
}

Response:
{
  "session_id": "uuid",
  "settings": {
    "face_detection": true,
    "violation_threshold": 5
  }
}
```

### 2. Submit Proctoring Events

```http
POST /api/attempts/{attemptId}/proctoring/events
Content-Type: application/json

{
  "events": [
    {
      "type": "face_not_detected",
      "timestamp": 1640995200000,
      "confidence": 0.95,
      "metadata": {
        "duration": 2.5,
        "frame_count": 75
      }
    }
  ]
}

Response:
{
  "processed": 1,
  "violations": {
    "total": 3,
    "threshold_exceeded": false
  }
}
```

### 3. Get Proctoring Summary

```http
GET /api/attempts/{attemptId}/proctoring/summary

Response:
{
  "total_events": 15,
  "violations_by_type": {
    "face_not_detected": 8,
    "multiple_faces": 2,
    "looking_away": 5
  },
  "violation_timeline": [
    {
      "timestamp": 1640995200000,
      "type": "face_not_detected",
      "severity": "warning"
    }
  ],
  "risk_score": 0.75,
  "recommendation": "manual_review"
}
```

### 4. Terminate Assessment

```http
POST /api/attempts/{attemptId}/proctoring/terminate
Content-Type: application/json

{
  "reason": "violation_threshold_exceeded",
  "final_violation_count": 6,
  "auto_terminated": true
}

Response:
{
  "terminated": true,
  "final_score": null,
  "termination_time": "2023-01-01T12:00:00Z"
}
```

## Frontend Service Implementation

### ProctoringService

```typescript
// src/services/proctoringService.ts
export class ProctoringService {
  static async startSession(attemptId: number): Promise<ProctoringSession> {
    const response = await api.post(`/attempts/${attemptId}/proctoring/start`, {
      browser_info: {
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
    return response.data;
  }

  static async submitEvents(attemptId: number, events: ProctoringEvent[]): Promise<void> {
    await api.post(`/attempts/${attemptId}/proctoring/events`, { events });
  }

  static async getSummary(attemptId: number): Promise<ProctoringsSummary> {
    const response = await api.get(`/attempts/${attemptId}/proctoring/summary`);
    return response.data;
  }

  static async terminateAssessment(attemptId: number, reason: string): Promise<void> {
    await api.post(`/attempts/${attemptId}/proctoring/terminate`, { reason });
  }
}
```

## React Query Hooks

### useProctoring Hook

```typescript
// src/hooks/useProctoring.ts
export const useProctoring = (attemptId: number) => {
  const queryClient = useQueryClient();

  const startSession = useMutation({
    mutationFn: () => ProctoringService.startSession(attemptId),
    onSuccess: (data) => {
      queryClient.setQueryData(['proctoring-session', attemptId], data);
    }
  });

  const submitEvents = useMutation({
    mutationFn: (events: ProctoringEvent[]) => 
      ProctoringService.submitEvents(attemptId, events),
    onError: (error) => {
      console.error('Failed to submit proctoring events:', error);
      // Implement retry logic or local storage backup
    }
  });

  const summary = useQuery({
    queryKey: ['proctoring-summary', attemptId],
    queryFn: () => ProctoringService.getSummary(attemptId),
    enabled: false // Only fetch when needed
  });

  return {
    startSession,
    submitEvents,
    summary,
    terminateAssessment: useMutation({
      mutationFn: (reason: string) => 
        ProctoringService.terminateAssessment(attemptId, reason)
    })
  };
};
```

## Real-time Event Handling

### Event Batching Strategy

```typescript
// Batch events every 10 seconds or when 10 events accumulate
class EventBatcher {
  private events: ProctoringEvent[] = [];
  private timer: NodeJS.Timeout | null = null;

  addEvent(event: ProctoringEvent) {
    this.events.push(event);
    
    if (this.events.length >= 10) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), 10000);
    }
  }

  private flush() {
    if (this.events.length > 0) {
      ProctoringService.submitEvents(attemptId, this.events);
      this.events = [];
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
```

## Error Handling

### Network Resilience

```typescript
// Implement offline storage for events
class OfflineEventStore {
  private static STORAGE_KEY = 'proctoring_events_offline';

  static store(attemptId: number, events: ProctoringEvent[]) {
    const stored = this.getStored();
    stored[attemptId] = [...(stored[attemptId] || []), ...events];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
  }

  static sync(attemptId: number) {
    const stored = this.getStored();
    const events = stored[attemptId];
    
    if (events?.length) {
      return ProctoringService.submitEvents(attemptId, events)
        .then(() => {
          delete stored[attemptId];
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stored));
        });
    }
  }

  private static getStored(): Record<number, ProctoringEvent[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }
}
```

## Security Considerations

### Data Validation

```typescript
// Validate events before submission
const eventSchema = z.object({
  type: z.enum(['face_not_detected', 'multiple_faces', 'looking_away']),
  timestamp: z.number().min(Date.now() - 86400000), // Within last 24 hours
  confidence: z.number().min(0).max(1).optional(),
  metadata: z.record(z.any()).optional()
});

export const validateEvents = (events: unknown[]): ProctoringEvent[] => {
  return events.map(event => eventSchema.parse(event));
};
```

### Rate Limiting

```typescript
// Client-side rate limiting to prevent spam
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests = 60; // per minute
  private readonly windowMs = 60000;

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length >= this.maxRequests) {
      return false;
    }
    
    this.requests.push(now);
    return true;
  }
}
```
