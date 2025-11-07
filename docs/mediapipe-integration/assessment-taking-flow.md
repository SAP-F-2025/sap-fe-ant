# Assessment Taking Flow with MediaPipe Integration

## Current Assessment Taking Flow Analysis

### **File**: `src/pages/Student/TakeAssessment.tsx`

### **Existing Flow Steps**

```
1. Route: /student/take-assessment/:attemptId
2. Fetch attempt details (includes questions, assessment, settings)
3. Initialize timer countdown
4. Load existing answers
5. Display current question
6. Auto-save answers (2-second debounce)
7. Navigate between questions
8. Submit attempt (manual or timeout)
```

## MediaPipe Integration Points

### **1. Assessment Settings Check (ALREADY EXISTS)**

**Location**: Line 47-48 in TakeAssessment.tsx
```typescript
const { data: attempt, isLoading } = useQuery<AttemptDetail>({
  queryKey: ['attempt-detail', attemptId],
  queryFn: () => studentService.getAttemptDetails(Number(attemptId)),
});

// attempt.assessment.settings.require_webcam - ALREADY AVAILABLE
```

**Integration**:
```typescript
const requiresProctoring = attempt?.assessment?.settings?.require_webcam;
```

### **2. Component Initialization**

**Current**: Lines 31-42 (state initialization)
**Add**: Proctoring state

```typescript
const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
const [answers, setAnswers] = useState<Record<number, any>>({});
const [timeRemaining, setTimeRemaining] = useState<number>(0);
const [autoSaving, setAutoSaving] = useState(false);

// ADD:
const [proctoringActive, setProctoringActive] = useState(false);
const [violations, setViolations] = useState<ProctoringEvent[]>([]);
```

### **3. Proctoring Lifecycle**

**Mount** (useEffect):
```typescript
useEffect(() => {
  if (requiresProctoring && attempt) {
    // Initialize MediaPipe
    // Request camera permissions
    // Start monitoring
  }
  
  return () => {
    // Cleanup MediaPipe
    // Stop camera
  };
}, [requiresProctoring, attempt]);
```

### **4. Violation Handling**

**Add to existing timer logic** (Lines 115-135):
```typescript
// Current: Timer countdown
useEffect(() => {
  // ... existing timer logic
}, [attempt, attemptId]);

// ADD: Violation threshold check
useEffect(() => {
  const violationThreshold = attempt?.assessment?.settings?.proctoring?.violation_threshold || 5;
  
  if (violations.length >= violationThreshold) {
    handleAutoTerminate('violation_threshold_exceeded');
  }
}, [violations, attempt]);
```

### **5. UI Layout Modification**

**Current Layout** (Lines 600-750):
```
┌─────────────────────────────────────┐
│ Header (Timer, Progress, Stats)    │
├─────────────────────────────────────┤
│ Question Card                       │
│  - Question text                    │
│  - Answer input                     │
│  - Navigation                       │
├─────────────────────────────────────┤
│ Question Navigation Grid            │
└─────────────────────────────────────┘
```

**New Layout with Proctoring**:
```
┌─────────────────────────────────────┐
│ Header (Timer, Progress, Stats)    │
├──────────────┬──────────────────────┤
│ Camera       │ Question Card        │
│ Monitor      │  - Question text     │
│ (if enabled) │  - Answer input      │
│              │  - Navigation        │
├──────────────┴──────────────────────┤
│ Question Navigation Grid            │
└─────────────────────────────────────┘
```

### **6. Submission Flow Enhancement**

**Current** (Lines 145-165):
```typescript
const buildCompleteAttemptRequest = (endReason?: string): CompleteAttemptRequest => {
  const answersArray: SubmitAnswerRequest[] = Object.entries(answers).map(
    ([questionId, answer]) => ({
      question_id: Number(questionId),
      answer,
    })
  );

  return {
    attempt_id: Number(attemptId),
    answers: answersArray,
    end_reason: endReason,
  };
};
```

**Enhanced**:
```typescript
const buildCompleteAttemptRequest = (endReason?: string): CompleteAttemptRequest => {
  const answersArray: SubmitAnswerRequest[] = Object.entries(answers).map(
    ([questionId, answer]) => ({
      question_id: Number(questionId),
      answer,
    })
  );

  return {
    attempt_id: Number(attemptId),
    answers: answersArray,
    end_reason: endReason,
    proctoring_summary: requiresProctoring ? {
      total_violations: violations.length,
      violation_types: groupViolationsByType(violations),
      monitoring_duration: calculateMonitoringDuration(),
    } : undefined,
  };
};
```

## Implementation Strategy

### **Phase 1: Minimal Integration (Week 1)**

1. Add `useMediaPipe` hook
2. Conditionally render `<CameraMonitor />` based on `require_webcam`
3. Display violation count in header
4. No auto-termination yet

**Changes**:
- Add 1 import
- Add 1 conditional component
- Add 1 state variable
- ~20 lines of code

### **Phase 2: Full Integration (Week 2)**

1. Implement violation threshold logic
2. Add auto-termination
3. Add violation alerts
4. Submit proctoring data with attempt

**Changes**:
- Add violation handling logic
- Modify submission flow
- Add alert components
- ~50 lines of code

### **Phase 3: Polish (Week 3)**

1. Responsive layout for camera
2. Permission error handling
3. Proctoring status indicators
4. Event logging to backend

## Code Changes Required

### **Minimal Changes to TakeAssessment.tsx**

```typescript
// 1. Add import
import { CameraMonitor } from '../../components/Proctoring/CameraMonitor';
import { useProctoring } from '../../hooks/useProctoring';

// 2. Add hook (inside component)
const { 
  violations, 
  isActive, 
  startProctoring, 
  stopProctoring 
} = useProctoring(Number(attemptId), requiresProctoring);

// 3. Add to layout (around line 620)
<Row gutter={16}>
  {requiresProctoring && (
    <Col xs={24} lg={8}>
      <CameraMonitor
        attemptId={Number(attemptId)}
        settings={attempt.assessment.settings.proctoring}
        onViolation={(event) => {
          // Handle violation
        }}
      />
    </Col>
  )}
  <Col xs={24} lg={requiresProctoring ? 16 : 24}>
    {/* Existing Question Card */}
  </Col>
</Row>
```

**Total Impact**: ~30 lines added, 0 lines modified, 0 breaking changes

## Testing Checklist

- [ ] Assessment without proctoring works unchanged
- [ ] Assessment with `require_webcam: true` shows camera
- [ ] Camera permission denied shows error
- [ ] Violations are counted correctly
- [ ] Auto-termination works at threshold
- [ ] Submission includes proctoring data
- [ ] Timer continues during proctoring
- [ ] Auto-save works with proctoring active
- [ ] Navigation works with camera active
- [ ] Cleanup happens on unmount

## Backward Compatibility

✅ **100% Backward Compatible**
- Existing assessments without proctoring: No changes
- Existing code: No modifications needed
- Existing API: Optional proctoring fields
- Existing UI: Graceful degradation if MediaPipe fails

## Performance Considerations

- Camera only initializes if `require_webcam: true`
- MediaPipe runs client-side (no server load)
- Event batching reduces API calls
- Cleanup prevents memory leaks
- Responsive layout adapts to screen size

## Next Steps

1. Review this flow analysis
2. Implement Phase 1 (minimal integration)
3. Test with existing assessments
4. Proceed to Phase 2 if successful
