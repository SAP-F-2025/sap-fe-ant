# MediaPipe Architecture Design

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Assessment    │    │   Proctoring     │    │   MediaPipe     │
│   Component     │◄──►│   Service        │◄──►│   Engine        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Event Store   │    │   Violation      │    │   Camera        │
│   (React Query) │    │   Handler        │    │   Stream        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Component Structure

### Core Components

#### 1. ProctoringProvider

```typescript
// Context provider for proctoring state
interface ProctoringContextType {
  isEnabled: boolean;
  events: ProctoringEvent[];
  violations: ViolationSummary;
  startProctoring: () => void;
  stopProctoring: () => void;
}
```

#### 2. CameraMonitor

```typescript
// Main camera monitoring component
interface CameraMonitorProps {
  onViolation: (event: ProctoringEvent) => void;
  settings: ProctoringSettings;
  enabled: boolean;
}
```

#### 3. ViolationAlert

```typescript
// Real-time violation alerts
interface ViolationAlertProps {
  event: ProctoringEvent;
  onDismiss: () => void;
  severity: 'warning' | 'error';
}
```

## Data Flow

### 1. Initialization

```
Assessment Start → Check Settings → Request Permissions → Initialize MediaPipe
```

### 2. Monitoring Loop

```
Camera Frame → MediaPipe Processing → Event Detection → Store Event → UI Update
```

### 3. Violation Handling

```
Violation Detected → Alert User → Log Event → Check Threshold → Action (Warning/Terminate)
```

## State Management

### React Query Integration

```typescript
// Proctoring events query
const useProctoringEvents = (attemptId: number) => {
  return useQuery({
    queryKey: ['proctoring-events', attemptId],
    queryFn: () => fetchProctoringEvents(attemptId),
    refetchInterval: 5000, // Real-time updates
  });
};
```

### Local State (useMediaPipe Hook)

- Camera stream management
- Real-time event detection
- Buffer management (last 50 events)
- Performance optimization

## Integration Points

### Assessment Settings Extension

```typescript
interface AssessmentSettings {
  // Existing settings...
  proctoring?: {
    enabled: boolean;
    face_detection: boolean;
    multiple_person_detection: boolean;
    attention_monitoring: boolean;
    violation_threshold: number;
    auto_terminate: boolean;
  };
}
```

### Event Storage

```typescript
interface ProctoringEvent {
  id: string;
  attempt_id: number;
  type: 'face_not_detected' | 'multiple_faces' | 'looking_away';
  timestamp: number;
  confidence: number;
  metadata?: Record<string, any>;
}
```

## Performance Considerations

### Optimization Strategies

1. **Frame Rate Control**: Process every 3rd frame (10 FPS)
2. **Model Selection**: Use lightweight models for real-time processing
3. **Memory Management**: Cleanup MediaPipe instances properly
4. **Event Throttling**: Debounce similar events (1-second intervals)

### Resource Usage

- **CPU**: ~15-25% on modern devices
- **Memory**: ~50-100MB additional
- **Network**: ~2MB initial model download
- **Battery**: Moderate impact on mobile devices

## Security & Privacy

### Data Handling

- **No video recording**: Only process frames in real-time
- **Local processing**: MediaPipe runs client-side
- **Event logging**: Store only violation metadata
- **Compliance**: GDPR/FERPA compliant design

### Access Control

- Camera permissions managed by browser
- Proctoring enabled only for authorized assessments
- Event data encrypted in transit and at rest
