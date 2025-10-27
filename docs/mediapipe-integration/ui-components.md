# UI Components Design for MediaPipe Proctoring

## Component Hierarchy

```
ProctoringProvider (Context)
├── AssessmentTaking
│   ├── CameraMonitor
│   │   ├── VideoStream
│   │   ├── DetectionOverlay
│   │   └── StatusIndicator
│   ├── ViolationAlert
│   └── ProctoringControls
├── ProctoringSettings (Assessment Creation)
│   ├── FeatureToggles
│   ├── ThresholdSettings
│   └── PreviewMode
└── ProctoringDashboard (Instructor View)
    ├── LiveMonitoring
    ├── EventTimeline
    └── ViolationSummary
```

## Core Components

### 1. CameraMonitor Component

**Purpose**: Main proctoring interface during assessment taking

```typescript
interface CameraMonitorProps {
  attemptId: number;
  settings: ProctoringSettings;
  onViolation: (event: ProctoringEvent) => void;
  onTerminate: () => void;
}
```

**Features**:

- Live camera feed display (640x480)
- Real-time face detection overlay
- Status indicators (active/inactive/error)
- Violation counter
- Privacy controls (pause/resume)

**Ant Design Components Used**:

- `Card` for container
- `Badge` for status indicators
- `Progress` for violation threshold
- `Button` for controls
- `Alert` for error states

### 2. ViolationAlert Component

**Purpose**: Real-time violation notifications

```typescript
interface ViolationAlertProps {
  event: ProctoringEvent;
  severity: 'info' | 'warning' | 'error';
  onDismiss: () => void;
  autoHide?: boolean;
}
```

**Features**:

- Severity-based styling
- Auto-dismiss after 5 seconds
- Sound notifications (optional)
- Action buttons (dismiss, details)

**Ant Design Components Used**:

- `Notification` for alerts
- `Icon` for violation types
- `Button` for actions

### 3. ProctoringSettings Component

**Purpose**: Configuration interface for assessment creators

```typescript
interface ProctoringSettingsProps {
  value: ProctoringSettings;
  onChange: (settings: ProctoringSettings) => void;
  preview?: boolean;
}
```

**Features**:

- Feature toggles (face detection, attention monitoring)
- Threshold sliders (violation limits)
- Preview mode with test camera
- Help tooltips and documentation

**Ant Design Components Used**:

- `Form` for settings
- `Switch` for feature toggles
- `Slider` for thresholds
- `Tooltip` for help text
- `Collapse` for advanced settings

## Detailed Component Specifications

### CameraMonitor Implementation

```typescript
// Visual Layout
┌─────────────────────────────────────┐
│ Camera Feed (640x480)               │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     [Face Detection Box]        │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Status: ● Active  Violations: 2/5   │
│ [Pause] [Settings] [Help]           │
└─────────────────────────────────────┘
```

**State Management**:

- Camera stream active/inactive
- Detection results from MediaPipe
- Violation count and threshold
- Error states and recovery

**Styling with Ant Design Tokens**:

```typescript
const styles = {
  container: {
    padding: token.paddingLG,
    borderRadius: token.borderRadius,
    backgroundColor: token.colorBgContainer,
  },
  videoContainer: {
    position: 'relative',
    border: `2px solid ${token.colorBorder}`,
    borderRadius: token.borderRadius,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
  }
};
```

### ViolationAlert Design

```typescript
// Alert Types and Styling
const alertConfig = {
  face_not_detected: {
    type: 'warning',
    icon: <EyeInvisibleOutlined />,
    message: 'Face not detected',
    description: 'Please ensure your face is visible to the camera'
  },
  multiple_faces: {
    type: 'error', 
    icon: <TeamOutlined />,
    message: 'Multiple people detected',
    description: 'Only one person should be visible during the assessment'
  },
  looking_away: {
    type: 'info',
    icon: <EyeOutlined />,
    message: 'Looking away detected',
    description: 'Please keep your attention on the assessment'
  }
};
```

### ProctoringSettings Form

```typescript
// Form Layout
<Form layout="vertical">
  <Form.Item label="Enable Proctoring" name="enabled">
    <Switch />
  </Form.Item>
  
  <Collapse>
    <Panel header="Detection Settings">
      <Form.Item label="Face Detection" name="face_detection">
        <Switch />
      </Form.Item>
      
      <Form.Item label="Multiple Person Detection" name="multiple_person_detection">
        <Switch />
      </Form.Item>
      
      <Form.Item label="Attention Monitoring" name="attention_monitoring">
        <Switch />
      </Form.Item>
    </Panel>
    
    <Panel header="Violation Thresholds">
      <Form.Item label="Warning Threshold" name="warning_threshold">
        <Slider min={1} max={10} marks={{ 3: '3', 5: '5', 7: '7' }} />
      </Form.Item>
      
      <Form.Item label="Termination Threshold" name="violation_threshold">
        <Slider min={3} max={15} marks={{ 5: '5', 10: '10', 15: '15' }} />
      </Form.Item>
    </Panel>
  </Collapse>
</Form>
```

## Responsive Design

### Breakpoint Behavior

**Desktop (≥1200px)**:

- Full camera feed (640x480)
- Side-by-side layout with assessment
- Detailed violation information

**Tablet (768px - 1199px)**:

- Reduced camera feed (480x360)
- Stacked layout
- Condensed violation alerts

**Mobile (≤767px)**:

- Minimal camera feed (320x240)
- Overlay mode
- Essential alerts only

### Responsive Implementation

```typescript
const useResponsiveCamera = () => {
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });
  
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDimensions({ width: 320, height: 240 });
      } else if (width < 1200) {
        setDimensions({ width: 480, height: 360 });
      } else {
        setDimensions({ width: 640, height: 480 });
      }
    };
    
    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return dimensions;
};
```

## Accessibility Features

### WCAG Compliance

**Keyboard Navigation**:

- Tab order: Camera controls → Settings → Help
- Space/Enter to activate buttons
- Escape to dismiss alerts

**Screen Reader Support**:

```typescript
<div 
  role="region" 
  aria-label="Proctoring camera feed"
  aria-describedby="proctoring-status"
>
  <video aria-label="Assessment proctoring camera" />
  <div id="proctoring-status" aria-live="polite">
    {violations > 0 && `${violations} violations detected`}
  </div>
</div>
```

**High Contrast Mode**:

```typescript
const highContrastStyles = {
  border: `3px solid ${token.colorTextBase}`,
  backgroundColor: token.colorBgBase,
  color: token.colorTextBase,
};
```

## Animation and Transitions

### Smooth State Changes

```typescript
// Ant Design motion tokens
const motionConfig = {
  violation: {
    enter: 'fadeInUp',
    exit: 'fadeOutDown',
    duration: token.motionDurationMid,
  },
  camera: {
    loading: 'pulse',
    error: 'shake',
    duration: token.motionDurationSlow,
  }
};
```

### Loading States

```typescript
<Skeleton.Image 
  active 
  style={{ width: 640, height: 480 }}
  loading={!cameraReady}
>
  <video ref={videoRef} />
</Skeleton.Image>
```

## Error States and Recovery

### Error Handling UI

```typescript
const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <Result
    status="error"
    title="Camera Access Failed"
    subTitle={error.message}
    extra={[
      <Button type="primary" onClick={onRetry}>
        Try Again
      </Button>,
      <Button onClick={showTroubleshooting}>
        Troubleshooting Guide
      </Button>
    ]}
  />
);
```

### Permission Denied State

```typescript
const PermissionDenied = () => (
  <Alert
    type="warning"
    showIcon
    message="Camera Permission Required"
    description={
      <div>
        <p>Please allow camera access to enable proctoring.</p>
        <Button type="link" onClick={showPermissionGuide}>
          How to enable camera permissions
        </Button>
      </div>
    }
  />
);
```

## Testing Considerations

### Component Testing

```typescript
// Test camera permission handling
test('shows permission denied state when camera access is denied', () => {
  mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
  render(<CameraMonitor />);
  expect(screen.getByText('Camera Permission Required')).toBeInTheDocument();
});

// Test violation detection
test('displays violation alert when face not detected', () => {
  const onViolation = jest.fn();
  render(<CameraMonitor onViolation={onViolation} />);
  
  // Simulate MediaPipe detection result
  fireEvent(mockMediaPipe, 'results', { detections: [] });
  
  expect(onViolation).toHaveBeenCalledWith({
    type: 'face_not_detected',
    timestamp: expect.any(Number)
  });
});
```

### Visual Testing

- Storybook stories for all component states
- Chromatic visual regression testing
- Cross-browser compatibility testing
- Mobile device testing
