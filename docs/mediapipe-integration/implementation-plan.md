# MediaPipe Implementation Plan

## Phase 1: Foundation Setup (Week 1)

### 1.1 Dependencies & Environment

- [x] Install MediaPipe packages (@mediapipe/tasks-vision)
- [ ] Configure HTTPS for development
- [x] Update Vite configuration for MediaPipe
- [x] Set up CDN access for models

### 1.2 Core Hook Development

- [x] Create `useMediaPipeFaceDetection` hook
- [x] Implement face detection with 478 landmarks
- [x] Add event logging system (duration-based tracking)
- [x] Test camera permissions

### 1.3 Type Definitions

- [x] Extend `AssessmentSettings` interface (require_webcam exists)
- [x] Add `ProctoringEvent` types (startTime, endTime, duration)
- [ ] Create `ViolationSummary` interface
- [ ] Update API response types

## Phase 2: Core Components (Week 2)

### 2.1 ProctoringProvider Context

```typescript
// Location: src/contexts/ProctoringContext.tsx
- Global proctoring state management
- Event aggregation and storage
- Violation threshold tracking
```

### 2.2 CameraMonitor Component

```typescript
// Location: src/components/Proctoring/ProctoringMonitor.tsx
- [x] Video stream display (mirrored)
- [x] Real-time monitoring overlay
- [x] MediaPipe integration
- [x] Event emission
- [x] Draggable floating card
- [x] Position persistence (localStorage)
- [x] Viewport boundary detection
- [x] Violation count display
- [x] Real-time violation alerts (red during, yellow after)
```

### 2.3 ViolationAlert Component

```typescript
// Location: src/components/Proctoring/ViolationAlert.tsx
- Real-time violation notifications
- Severity-based styling
- Auto-dismiss functionality
```

## Phase 3: Assessment Integration (Week 3)

### 3.1 Assessment Settings UI

```typescript
// Location: src/pages/Assessments/components/ProctoringSettings.tsx
- Proctoring configuration form
- Feature toggles (face detection, attention monitoring)
- Violation threshold settings
- Preview functionality
```

### 3.2 Assessment Taking Page

```typescript
// Location: src/pages/Student/TakeAssessment.tsx
- [x] Integrate ProctoringMonitor (floating card)
- [x] Conditional rendering based on require_webcam
- [x] Violation event collection
- [ ] Handle violation workflows
- [ ] Implement auto-termination
```

### 3.3 Permission Handling

```typescript
// Location: src/components/Proctoring/PermissionGate.tsx
- Camera permission requests
- Fallback for denied permissions
- User guidance and troubleshooting
```

## Phase 4: Backend Integration (Week 4)

### 4.1 API Extensions

```typescript
// New endpoints needed:
POST /api/assessments/{id}/proctoring/start
POST /api/assessments/{id}/proctoring/events
GET  /api/assessments/{id}/proctoring/summary
POST /api/assessments/{id}/proctoring/terminate
```

### 4.2 Service Layer

```typescript
// Location: src/services/proctoringService.ts
- Event submission to backend
- Real-time event streaming
- Violation reporting
- Assessment termination
```

### 4.3 React Query Integration

```typescript
// Location: src/hooks/useProctoring.ts
- useProctoringEvents query
- useSubmitViolation mutation
- useTerminateAssessment mutation
- Real-time updates with polling
```

## Phase 5: Reporting & Analytics (Week 5)

### 5.1 Proctoring Dashboard

```typescript
// Location: src/pages/Proctoring/Dashboard.tsx
- Violation statistics
- Real-time monitoring view
- Assessment proctoring status
- Instructor alerts
```

### 5.2 Event Timeline

```typescript
// Location: src/components/Proctoring/EventTimeline.tsx
- Chronological event display
- Violation severity indicators
- Filtering and search
- Export functionality
```

### 5.3 Reports Integration

```typescript
// Location: src/pages/Reports/ProctoringReport.tsx
- Detailed violation reports
- Student behavior analytics
- Compliance documentation
- PDF export capability
```

## Phase 6: Testing & Optimization (Week 6)

### 6.1 Unit Testing

```typescript
// Test files to create:
src/hooks/__tests__/useMediaPipe.test.ts
src/components/Proctoring/__tests__/CameraMonitor.test.tsx
src/services/__tests__/proctoringService.test.ts
```

### 6.2 Integration Testing

- End-to-end assessment flow
- Permission handling scenarios
- Violation detection accuracy
- Performance under load

### 6.3 Performance Optimization

- Frame rate optimization
- Memory leak prevention
- Model loading optimization
- Event throttling fine-tuning

## Implementation Checklist

### Core Features

- [x] Face detection and tracking (478 landmarks)
- [x] Multiple person detection (up to 2 faces)
- [ ] Attention monitoring (looking away)
- [x] Real-time violation alerts (with duration tracking)
- [x] Event logging (frontend only, duration-based)
- [ ] Event storage (backend)
- [ ] Assessment auto-termination

### UI Components

- [x] Camera preview with overlay (ProctoringMonitor)
- [x] Draggable floating card with position persistence
- [x] Landmark visualization toggle (MediaPipeCameraTest)
- [ ] Proctoring settings form
- [x] Violation alert notifications (red/yellow based on state)
- [x] Permission request dialog (browser native)
- [x] Proctoring status indicator (face count badge)
- [x] Violation count display (in card header)
- [ ] Event timeline display

### Integration Points

- [ ] Assessment creation flow (settings already exist)
- [x] Assessment taking flow (floating card integration)
- [ ] Grading and review flow
- [ ] Reporting dashboard
- [ ] User management (permissions)

### Technical Requirements

- [ ] HTTPS configuration (dev only)
- [x] Camera permission handling
- [x] MediaPipe model loading (CDN)
- [x] Real-time event processing (60 FPS)
- [x] Violation duration tracking (start/end)
- [x] Position persistence (localStorage)
- [ ] Backend API integration
- [ ] Data persistence (backend)

## Success Metrics

### Functional Metrics

- 95%+ face detection accuracy
- <500ms violation detection latency
- <2% false positive rate
- 99.9% uptime during assessments

### Performance Metrics

- <100MB memory usage
- <25% CPU utilization
- <3 seconds initial load time
- 60 FPS camera stream

### User Experience Metrics

- <5% permission denial rate
- <1% assessment termination due to technical issues
- >90% instructor satisfaction
- <10 seconds setup time
