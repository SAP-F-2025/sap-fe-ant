# Testing Strategy for MediaPipe Integration

## Testing Pyramid

```
                    E2E Tests
                 ┌─────────────┐
                 │ Playwright  │
                 │ Cypress     │
                 └─────────────┘
              
            Integration Tests
         ┌─────────────────────┐
         │ React Testing Lib   │
         │ MediaPipe Mocks     │
         │ API Integration     │
         └─────────────────────┘
         
        Unit Tests
    ┌─────────────────────────────┐
    │ Vitest + Jest               │
    │ Hook Testing                │
    │ Component Testing           │
    │ Service Testing             │
    └─────────────────────────────┘
```

## Unit Testing

### 1. MediaPipe Hook Testing

```typescript
// src/hooks/__tests__/useMediaPipe.test.ts
import { renderHook, act } from '@testing-library/react';
import { useMediaPipe } from '../useMediaPipe';

// Mock MediaPipe
jest.mock('@mediapipe/face_detection', () => ({
  FaceDetection: jest.fn().mockImplementation(() => ({
    setOptions: jest.fn(),
    onResults: jest.fn(),
    send: jest.fn(),
  })),
}));

jest.mock('@mediapipe/camera_utils', () => ({
  Camera: jest.fn().mockImplementation(() => ({
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn(),
  })),
}));

describe('useMediaPipe', () => {
  beforeEach(() => {
    // Mock getUserMedia
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue({
          getTracks: () => [{ stop: jest.fn() }],
        }),
      },
    });
  });

  test('initializes MediaPipe when enabled', async () => {
    const { result } = renderHook(() => useMediaPipe(true));
    
    await act(async () => {
      // Wait for initialization
    });
    
    expect(result.current.isActive).toBe(true);
  });

  test('detects face not found violation', async () => {
    const { result } = renderHook(() => useMediaPipe(true));
    
    await act(async () => {
      // Simulate MediaPipe results with no detections
      const mockResults = { detections: [] };
      // Trigger onResults callback
    });
    
    expect(result.current.events).toContainEqual(
      expect.objectContaining({
        type: 'face_not_detected',
        timestamp: expect.any(Number),
      })
    );
  });

  test('cleans up resources on unmount', () => {
    const { unmount } = renderHook(() => useMediaPipe(true));
    
    unmount();
    
    // Verify camera.stop() was called
    // Verify MediaPipe cleanup
  });
});
```

### 2. Component Testing

```typescript
// src/components/Proctoring/__tests__/CameraMonitor.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CameraMonitor } from '../CameraMonitor';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CameraMonitor', () => {
  const mockProps = {
    attemptId: 1,
    settings: {
      enabled: true,
      face_detection: true,
      violation_threshold: 5,
    },
    onViolation: jest.fn(),
    onTerminate: jest.fn(),
  };

  test('renders camera feed when active', () => {
    renderWithProviders(<CameraMonitor {...mockProps} />);
    
    expect(screen.getByRole('region', { name: /proctoring camera/i })).toBeInTheDocument();
    expect(screen.getByText(/status.*active/i)).toBeInTheDocument();
  });

  test('shows permission denied state', () => {
    // Mock permission denied
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockRejectedValue(new Error('Permission denied')),
      },
    });

    renderWithProviders(<CameraMonitor {...mockProps} />);
    
    expect(screen.getByText(/camera permission required/i)).toBeInTheDocument();
  });

  test('handles violation threshold exceeded', () => {
    renderWithProviders(<CameraMonitor {...mockProps} />);
    
    // Simulate multiple violations
    act(() => {
      for (let i = 0; i < 6; i++) {
        mockProps.onViolation({
          type: 'face_not_detected',
          timestamp: Date.now(),
        });
      }
    });
    
    expect(mockProps.onTerminate).toHaveBeenCalled();
  });
});
```

### 3. Service Testing

```typescript
// src/services/__tests__/proctoringService.test.ts
import { ProctoringService } from '../proctoringService';
import { api } from '../api';

jest.mock('../api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('ProctoringService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('starts proctoring session', async () => {
    const mockResponse = {
      data: {
        session_id: 'test-session',
        settings: { face_detection: true },
      },
    };
    mockedApi.post.mockResolvedValue(mockResponse);

    const result = await ProctoringService.startSession(1);

    expect(mockedApi.post).toHaveBeenCalledWith('/attempts/1/proctoring/start', {
      browser_info: expect.objectContaining({
        user_agent: expect.any(String),
      }),
    });
    expect(result).toEqual(mockResponse.data);
  });

  test('submits events in batch', async () => {
    const events = [
      { type: 'face_not_detected', timestamp: Date.now() },
      { type: 'multiple_faces', timestamp: Date.now() },
    ];

    await ProctoringService.submitEvents(1, events);

    expect(mockedApi.post).toHaveBeenCalledWith('/attempts/1/proctoring/events', {
      events,
    });
  });

  test('handles API errors gracefully', async () => {
    mockedApi.post.mockRejectedValue(new Error('Network error'));

    await expect(ProctoringService.submitEvents(1, [])).rejects.toThrow('Network error');
  });
});
```

## Integration Testing

### 1. Full Proctoring Flow

```typescript
// src/__tests__/integration/proctoring-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../../App';

describe('Proctoring Integration', () => {
  test('complete assessment with proctoring', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    // Navigate to assessment
    await user.click(screen.getByText('Take Assessment'));
    
    // Accept camera permissions
    await user.click(screen.getByText('Allow Camera Access'));
    
    // Wait for proctoring to initialize
    await waitFor(() => {
      expect(screen.getByText(/proctoring active/i)).toBeInTheDocument();
    });
    
    // Start assessment
    await user.click(screen.getByText('Start Assessment'));
    
    // Simulate violation
    fireEvent(window, new CustomEvent('mediapipe-violation', {
      detail: { type: 'face_not_detected' }
    }));
    
    // Check violation alert
    expect(screen.getByText(/face not detected/i)).toBeInTheDocument();
    
    // Complete assessment
    await user.click(screen.getByText('Submit Assessment'));
    
    // Verify proctoring data was submitted
    await waitFor(() => {
      expect(screen.getByText(/assessment submitted/i)).toBeInTheDocument();
    });
  });
});
```

### 2. API Integration Testing

```typescript
// src/__tests__/integration/api-integration.test.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ProctoringService } from '../../services/proctoringService';

const server = setupServer(
  rest.post('/api/attempts/:id/proctoring/start', (req, res, ctx) => {
    return res(ctx.json({
      session_id: 'test-session',
      settings: { face_detection: true }
    }));
  }),
  
  rest.post('/api/attempts/:id/proctoring/events', (req, res, ctx) => {
    return res(ctx.json({
      processed: 1,
      violations: { total: 1, threshold_exceeded: false }
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('API Integration', () => {
  test('handles successful event submission', async () => {
    const events = [{ type: 'face_not_detected', timestamp: Date.now() }];
    
    await expect(ProctoringService.submitEvents(1, events)).resolves.not.toThrow();
  });

  test('handles API errors', async () => {
    server.use(
      rest.post('/api/attempts/:id/proctoring/events', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    const events = [{ type: 'face_not_detected', timestamp: Date.now() }];
    
    await expect(ProctoringService.submitEvents(1, events)).rejects.toThrow();
  });
});
```

## End-to-End Testing

### 1. Playwright E2E Tests

```typescript
// tests/e2e/proctoring.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Proctoring E2E', () => {
  test.beforeEach(async ({ page, context }) => {
    // Grant camera permissions
    await context.grantPermissions(['camera']);
  });

  test('complete proctored assessment', async ({ page }) => {
    await page.goto('/assessments/1/take');
    
    // Wait for camera initialization
    await expect(page.locator('[data-testid="camera-feed"]')).toBeVisible();
    await expect(page.locator('text=Proctoring Active')).toBeVisible();
    
    // Start assessment
    await page.click('text=Start Assessment');
    
    // Answer questions
    await page.click('[data-testid="answer-option-1"]');
    await page.click('text=Next Question');
    
    // Simulate looking away (mock MediaPipe)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('mock-violation', {
        detail: { type: 'looking_away' }
      }));
    });
    
    // Check violation alert
    await expect(page.locator('text=Looking away detected')).toBeVisible();
    
    // Complete assessment
    await page.click('text=Submit Assessment');
    
    // Verify completion
    await expect(page.locator('text=Assessment Completed')).toBeVisible();
  });

  test('handles camera permission denied', async ({ page, context }) => {
    // Deny camera permissions
    await context.clearPermissions();
    
    await page.goto('/assessments/1/take');
    
    // Check permission denied state
    await expect(page.locator('text=Camera Permission Required')).toBeVisible();
    
    // Should not allow assessment start
    await expect(page.locator('text=Start Assessment')).toBeDisabled();
  });

  test('terminates assessment on violation threshold', async ({ page }) => {
    await page.goto('/assessments/1/take');
    
    // Start assessment
    await page.click('text=Start Assessment');
    
    // Simulate multiple violations
    for (let i = 0; i < 6; i++) {
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('mock-violation', {
          detail: { type: 'face_not_detected' }
        }));
      });
      await page.waitForTimeout(1000);
    }
    
    // Check termination
    await expect(page.locator('text=Assessment Terminated')).toBeVisible();
    await expect(page.locator('text=Too many violations detected')).toBeVisible();
  });
});
```

## Performance Testing

### 1. Memory Leak Detection

```typescript
// tests/performance/memory-leaks.test.ts
describe('Memory Leak Tests', () => {
  test('MediaPipe cleanup prevents memory leaks', async () => {
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Render and unmount component multiple times
    for (let i = 0; i < 10; i++) {
      const { unmount } = render(<CameraMonitor {...mockProps} />);
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });
      unmount();
    }
    
    // Force garbage collection
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    const memoryIncrease = finalMemory - initialMemory;
    
    // Memory increase should be minimal (< 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
});
```

### 2. Performance Benchmarks

```typescript
// tests/performance/benchmarks.test.ts
describe('Performance Benchmarks', () => {
  test('MediaPipe initialization time', async () => {
    const startTime = performance.now();
    
    const { result } = renderHook(() => useMediaPipe(true));
    
    await waitFor(() => {
      expect(result.current.isActive).toBe(true);
    });
    
    const initTime = performance.now() - startTime;
    
    // Should initialize within 3 seconds
    expect(initTime).toBeLessThan(3000);
  });

  test('violation detection latency', async () => {
    const { result } = renderHook(() => useMediaPipe(true));
    
    const startTime = performance.now();
    
    // Simulate MediaPipe detection
    act(() => {
      // Trigger violation detection
    });
    
    await waitFor(() => {
      expect(result.current.events.length).toBeGreaterThan(0);
    });
    
    const detectionTime = performance.now() - startTime;
    
    // Should detect within 500ms
    expect(detectionTime).toBeLessThan(500);
  });
});
```

## Test Data and Mocks

### 1. MediaPipe Mocks

```typescript
// src/test/mocks/mediapipe.ts
export const createMockFaceDetection = () => ({
  setOptions: jest.fn(),
  onResults: jest.fn(),
  send: jest.fn().mockResolvedValue(undefined),
  close: jest.fn(),
});

export const createMockCamera = () => ({
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn(),
});

export const mockDetectionResults = {
  noFace: { detections: [] },
  singleFace: {
    detections: [{
      boundingBox: { xCenter: 0.5, yCenter: 0.5, width: 0.3, height: 0.4 },
      landmarks: [],
      score: [0.95]
    }]
  },
  multipleFaces: {
    detections: [
      { boundingBox: { xCenter: 0.3, yCenter: 0.5, width: 0.2, height: 0.3 }, score: [0.9] },
      { boundingBox: { xCenter: 0.7, yCenter: 0.5, width: 0.2, height: 0.3 }, score: [0.85] }
    ]
  }
};
```

### 2. Test Utilities

```typescript
// src/test/utils/proctoring-test-utils.tsx
export const renderWithProctoringProvider = (
  component: React.ReactElement,
  initialSettings?: Partial<ProctoringSettings>
) => {
  const defaultSettings = {
    enabled: true,
    face_detection: true,
    violation_threshold: 5,
    ...initialSettings
  };

  return render(
    <ProctoringProvider settings={defaultSettings}>
      {component}
    </ProctoringProvider>
  );
};

export const simulateViolation = (type: ViolationType, count = 1) => {
  for (let i = 0; i < count; i++) {
    fireEvent(window, new CustomEvent('proctoring-violation', {
      detail: { type, timestamp: Date.now() + i }
    }));
  }
};
```

## Continuous Integration

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/proctoring-tests.yml
name: Proctoring Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:coverage
        
      - name: Run E2E tests
        run: npm run test:e2e
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### 2. Test Coverage Goals

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: Happy path + error scenarios
- **Performance Tests**: Memory and timing benchmarks
