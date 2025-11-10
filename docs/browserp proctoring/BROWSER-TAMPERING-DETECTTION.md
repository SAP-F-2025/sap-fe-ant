# Browser Tamper Detection Implementation

## Overview

Implemented browser tamper detection system that checks for security issues **before** the test starts and continuously monitors **during** the test.

## Features

### 1. Pre-Test Security Check

- Modal appears when user clicks "Start Test"
- Checks for:
  - ✅ **DevTools Open** - Detects if browser DevTools (F12) is open
  - ✅ **Console Override** - Detects if console methods are tampered
  - ✅ **Suspicious Extensions** - Detects browser extensions (limited)
- User **cannot start test** until all issues are resolved
- "Re-check" button to verify fixes

### 2. Continuous Monitoring During Test

- Monitors for DevTools opening every 2 seconds
- Triggers violation if DevTools detected during test
- Violations logged and displayed in ProctoringMonitor

### 3. Dev Bypass Configuration

- Config file: `src/config/proctoring.config.ts`
- **Auto-bypass in dev mode** (`import.meta.env.DEV`)
- Manual override: Set `FORCE_TAMPER_DETECTION = true` to test actual behavior

## Files Created

### 1. `/src/config/proctoring.config.ts`

```typescript
export const PROCTORING_CONFIG = {
  BYPASS_TAMPER_DETECTION: import.meta.env.DEV, // Auto-bypass in dev
  FORCE_TAMPER_DETECTION: false, // Set true to test in dev
};
```

### 2. `/src/hooks/useBrowserTamperDetection.ts`

- Hook for detecting browser tampering
- Methods:
  - `checkDevTools()` - Window size difference + debugger timing
  - `checkConsoleOverride()` - Console integrity check
  - `checkSuspiciousExtensions()` - DOM-based extension detection
- Returns: `{ tamperStatus, hasTampering, performCheck, isBypassed }`

### 3. `/src/components/Proctoring/TamperCheckModal.tsx`

- Modal component for pre-test security check
- Shows status of each check (✓ or ✗)
- Disables "Start Test" button if issues detected
- Shows dev mode bypass notice

## Integration

### TakeAssessment Page

1. **Pre-Test Screen**: Shows before test starts
2. **Start Test Button**: Triggers tamper check modal
3. **Tamper Check Modal**: User must pass all checks
4. **Test Screen**: Only shown after passing checks

### ProctoringMonitor Component

- Added `detectTampering` prop
- Passes to `useBrowserProctoring` hook
- Displays "Phát hiện DevTools" alert when detected

### useBrowserProctoring Hook

- Added `detectTampering` parameter
- Checks every 2 seconds during test
- Triggers `browser_tamper` violation with metadata

## Detection Methods

### DevTools Detection

1. **Window Size Difference**: `outerWidth - innerWidth > 160px`
2. **Debugger Timing**: `debugger` statement takes >100ms when DevTools open

### Console Override Detection

- Checks if `window.console` descriptor is writable

### Extension Detection (Limited)

- Searches DOM for elements with `data-extension`, `class*="extension"`, `id*="extension"`
- **Note**: Not 100% reliable, many extensions don't leave traces

## Usage

### Development Mode (Bypass Enabled)

```typescript
// In proctoring.config.ts
BYPASS_TAMPER_DETECTION: true // Default in dev
FORCE_TAMPER_DETECTION: false
```

- All checks show as passed
- Modal shows "Development Mode" notice
- Can start test without restrictions

### Testing Actual Behavior in Dev

```typescript
// In proctoring.config.ts
FORCE_TAMPER_DETECTION: true
```

- Enables actual tamper detection
- Can test DevTools detection
- Can test pre-test blocking

### Production Mode

- Auto-enforces tamper detection
- Users must close DevTools before starting
- Continuous monitoring during test

## Violation Types

### browser_tamper

```typescript
{
  type: 'browser_tamper',
  startTime: number,
  endTime: number,
  duration: 0,
  metadata: {
    tamperType: 'devtools' | 'console' | 'extension'
  }
}
```

## Limitations

1. **DevTools Detection**: Can be bypassed with external debugging tools
2. **Extension Detection**: Limited to DOM-based detection, many extensions undetectable
3. **Console Override**: Only checks if descriptor is writable
4. **Not 100% Secure**: Determined users can bypass with advanced techniques

## Recommendations

- Use in combination with other proctoring methods (webcam, tab switching)
- Log all violations for manual review
- Consider this as a deterrent, not foolproof security
- For high-stakes exams, use professional proctoring services

## Future Enhancements

- [ ] Add more DevTools detection methods
- [ ] Detect specific extensions by name
- [ ] Monitor performance API for suspicious timing
- [ ] Detect virtual machines
- [ ] Add voice detection (ViolationVoice)
- [ ] Add voice chat detection (ViolationVoiceChat)
