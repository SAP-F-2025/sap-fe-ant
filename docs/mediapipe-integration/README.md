# MediaPipe Integration for SAP Assessment System

## Overview

This document outlines the integration of MediaPipe into the SAP Assessment Management System for proctoring capabilities during online assessments.

## Purpose

- **Real-time face detection** during assessments
- **Suspicious behavior monitoring** (multiple faces, looking away)
- **Integrity verification** for online examinations
- **Event logging** for review and analysis

## Integration Points

### 1. Assessment Taking Flow

- Enable proctoring when `require_webcam: true` in assessment settings
- Continuous monitoring during assessment attempts
- Real-time alerts for violations

### 2. Existing Components to Modify

- **Assessment Settings**: Add proctoring configuration options
- **Assessment Taking Page**: Integrate camera feed and monitoring
- **Grading Module**: Include proctoring events in review

## Quick Start

### Installation

```bash
# Install MediaPipe package
npm install @mediapipe/tasks-vision@^0.10.20
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
	optimizeDeps: {
		include: ['@mediapipe/tasks-vision'],
	},
});
```

### Environment Setup

```env
# .env
VITE_FORCE_TAMPER_DETECTION=false  # Dev mode (bypass security)
VITE_FORCE_TAMPER_DETECTION=true   # Test mode (enforce security)
```

### Browser Requirements

- Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- Camera access permission
- HTTPS required (production)

## Implementation Status

### ✅ Completed Features

**Core Proctoring (MediaPipe FaceLandmarker)**

- ✅ Face detection (no face/multiple faces)
- ✅ Gaze tracking (looking away - iris-based)
- ✅ Mouth open detection
- ✅ Head turned detection
- ✅ Eyes closed detection (blink threshold removed)
- ✅ Real-time violation alerts (red → yellow transition)
- ✅ Draggable camera monitor with position persistence
- ✅ Violation event tracking (start/end timestamps + duration)
- ✅ Multiple simultaneous violations (Map-based tracking)
- ✅ Auto-remove violations 3s after they end
- ✅ Mirrored video display

**Assessment Integration**

- ✅ Camera consent modal (allow once/always with localStorage)
- ✅ Face verification page (pre-test face detection)
- ✅ Proctoring monitor in assessment taking (floating card)
- ✅ Camera lifecycle management (proper cleanup)
- ✅ Violation count tracking
- ✅ Settings integration (require_webcam, require_full_screen, etc.)
- ✅ Expired attempt handling (auto-submit on timeout)

**Browser Proctoring (Non-MediaPipe)**

- ✅ Tab switching detection (Visibility API + blur/focus events)
- ✅ Copy/paste detection (Clipboard API)
- ✅ Fullscreen exit detection (Fullscreen API)
- ✅ Browser DevTools detection (window size + continuous monitoring)
- ✅ DevTools blocker (F12, Ctrl+Shift+I, right-click, etc.)
- ✅ Fullscreen enforcement (auto-enter, prevent exit)
- ✅ Pre-test security check (TamperCheckModal)
- ✅ Browser violation display (for non-webcam tests)

**Configuration & Dev Experience**

- ✅ Dev mode bypass (VITE_FORCE_TAMPER_DETECTION env var)
- ✅ Proctoring config file (centralized settings)
- ✅ Console logging for debugging
- ✅ Vite optimization for MediaPipe packages

### ❌ Not Implemented

**Additional MediaPipe Features**

- ❌ Hand detection (MediaPipe HandLandmarker)
- ❌ Phone detection (MediaPipe ObjectDetector)
- ❌ Face verification/matching (face-api.js or backend)

**Audio Monitoring**

- ❌ Voice detection (Web Audio API - high false positive rate)
- ❌ Voice chat detection (very resource-intensive)

**Backend Integration**

- ❌ Violation storage to database
- ❌ Proctoring event API endpoints
- ❌ Instructor review dashboard
- ❌ Analytics and reporting
- ❌ Violation playback/timeline

**Assessment Settings (Not Yet Used)**

- ❌ randomize_questions
- ❌ randomize_options
- ❌ questions_per_page
- ❌ show_progress_bar toggle
- ❌ require_identity_verification enforcement
- ❌ Accessibility features (screen reader, font size, high contrast)

## Technical Details

### MediaPipe Configuration

**Package**: `@mediapipe/tasks-vision@0.10.20`
**Model**: FaceLandmarker (float16)
**Model URL**: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`
**Running Mode**: VIDEO (for continuous detection)
**Method**: `detectForVideo()` (not `detect()`)

### Detection Thresholds

**Face Detection**:

- No face: `results.faceLandmarks.length === 0`
- Multiple faces: `results.faceLandmarks.length > 1`

**Gaze Tracking (Iris-based)**:

- Iris landmarks: 468 (left), 473 (right)
- Looking away: Iris outside 0.3-0.7 (horizontal), 0.35-0.65 (vertical)
- More accurate than nose-based detection

**Mouth Open**:

- Upper lip: Landmark 13
- Lower lip: Landmark 14
- Threshold: Distance > 0.03

**Head Turned**:

- Nose tip: Landmark 1
- Face center: Average of all landmarks
- Threshold: Horizontal offset > 0.15

**Eyes Closed**:

- Eye Aspect Ratio (EAR) calculation
- Left eye: Landmarks 159, 145, 133, 33
- Right eye: Landmarks 386, 374, 362, 263
- Threshold: EAR < 0.18
- Note: Blink detection removed (no 300ms threshold)

### Browser Proctoring

**DevTools Detection**:

- Window size: `outerWidth - innerWidth > 160px`
- Debugger timing: `debugger` takes >100ms when open
- Continuous check: Every 2 seconds

**Tab Switching**:

- Visibility API: `document.hidden`
- Blur/Focus: `window.blur/focus` events
- Tracks both same-window and Alt+Tab switches

**Fullscreen**:

- API: `document.fullscreenElement`
- Auto-enter on test start
- Warning modal on exit attempt

### Violation Event Structure

```typescript
// Camera violations (MediaPipe)
interface ProctoringEvent {
	type:
		| 'face_not_detected'
		| 'multiple_faces'
		| 'looking_away'
		| 'mouth_open'
		| 'head_turned'
		| 'eyes_closed';
	startTime: number;
	endTime: number;
	duration: number;
	metadata?: any;
}

// Browser violations
interface BrowserProctoringEvent {
	type: 'tab_switch' | 'fullscreen_exit' | 'copy_paste' | 'browser_tamper';
	startTime: number;
	endTime: number;
	duration: number;
	metadata?: {
		action?: 'copy' | 'paste' | 'cut';
		hidden?: boolean;
		tamperType?: 'devtools' | 'console' | 'extension';
	};
}
```

## Architecture

### Component Hierarchy

```
TakeAssessment
├── useBrowserProctoring (hook) - Browser violations
├── useDevToolsBlocker (hook) - Blocks shortcuts
├── ProctoringMonitor (component) - Only if require_webcam=true
│   ├── useMediaPipeFaceDetection (hook) - Face violations
│   ├── useBrowserProctoring (hook) - Browser violations
│   └── Video + Canvas + Alerts
└── Browser Violation Card - Only if !require_webcam
```

### Data Flow

1. **Violation Detection** → Hook detects violation
2. **Event Creation** → Creates event with timestamp
3. **State Update** → Updates violation Map
4. **UI Display** → Shows alert (red for active, yellow for ended)
5. **Auto-Remove** → Removes after 3 seconds
6. **Logging** → Console logs for debugging

### File Organization

```
src/
├── config/
│   └── proctoring.config.ts          # Dev bypass config
├── hooks/
│   ├── useProctoring.ts              # MediaPipe face detection
│   ├── useBrowserProctoring.ts       # Browser violations
│   ├── useBrowserTamperDetection.ts  # Pre-test checks
│   └── useDevToolsBlocker.ts         # Blocks shortcuts
├── components/Proctoring/
│   ├── ProctoringMonitor.tsx         # Floating camera card
│   ├── TamperCheckModal.tsx          # Pre-test security
│   └── CameraConsentModal.tsx        # Camera permission
└── pages/Student/
    ├── AvailableAssessments.tsx      # Shows TamperCheckModal
    ├── FaceVerification.tsx          # Pre-test face check
    └── TakeAssessment.tsx            # Main test page
```

## Performance Considerations

### MediaPipe Optimization

- Model loaded once and cached
- VIDEO running mode for continuous detection
- Canvas rendering optimized
- Proper cleanup on unmount

### Browser Proctoring Optimization

- DevTools check: Every 2 seconds (not every frame)
- Event listeners: Properly cleaned up
- State updates: Batched with Map
- Timeouts: Cleared on unmount

### Memory Management

- Camera stream: Stopped on unmount
- MediaPipe: Proper disposal
- Event listeners: All removed
- Timeouts: All cleared

## Testing

### Manual Testing Checklist

**MediaPipe Face Detection**:

- [ ] No face detected
- [ ] Multiple faces detected
- [ ] Looking left/right/up/down
- [ ] Mouth open
- [ ] Head turned
- [ ] Eyes closed
- [ ] Violations appear/disappear correctly

**Browser Proctoring**:

- [ ] F12 blocked
- [ ] Right-click blocked
- [ ] Alt+Tab detected
- [ ] Copy/paste detected
- [ ] DevTools detected (open/close)
- [ ] Fullscreen enforced

**Dev Mode**:

- [ ] Bypass works with VITE_FORCE_TAMPER_DETECTION=false
- [ ] Enforcement works with VITE_FORCE_TAMPER_DETECTION=true
- [ ] Production always enforces

## Known Issues & Limitations

### MediaPipe

- Lighting conditions affect accuracy
- Glasses can interfere with eye detection
- Face angle >45° may not detect properly
- Requires good camera quality
- High CPU usage with continuous detection

### Browser Proctoring

- Cannot truly prevent Alt+Tab (browser security limitation)
- Cannot block OS-level shortcuts (Windows key, Cmd+Tab)
- Cannot detect all browser extensions
- Cannot prevent external debugging tools
- Cannot prevent virtual machines
- Cannot prevent screen sharing to another device

### General

- Network latency affects model loading
- Mobile browser support limited
- Requires stable internet connection

## Deployment Considerations

### Production Requirements

**HTTPS**: Required for camera access

```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
}
```

**Content Security Policy**:

```
script-src 'self' https://cdn.jsdelivr.net;
connect-src 'self' https://storage.googleapis.com;
media-src 'self' blob:;
```

**CDN Access**: Ensure firewall allows:

- `https://storage.googleapis.com/mediapipe-models/`
- `https://cdn.jsdelivr.net/npm/@mediapipe/`

### Performance Optimization

- Use CDN for model loading (faster than bundling)
- Enable gzip compression for assets
- Configure proper cache headers
- Monitor memory usage (limit: ~100MB)
- Monitor CPU usage (target: <25%)

### Monitoring

**Key Metrics**:

- Face detection accuracy: >95%
- Violation detection latency: <500ms
- False positive rate: <2%
- Camera permission denial rate: <5%
- Memory usage: <100MB
- CPU utilization: <25%

## Troubleshooting

### Camera Not Working

- Check HTTPS enabled
- Verify camera permissions granted
- Check browser compatibility
- Test with different camera

### Models Not Loading

- Verify CDN access (check network tab)
- Check Content Security Policy
- Verify internet connection
- Check firewall settings

### Performance Issues

- Reduce detection frequency
- Check CPU/memory usage
- Close other applications
- Update browser to latest version

### Memory Leaks

- Ensure proper cleanup in useEffect
- Stop camera stream on unmount
- Clear all event listeners
- Dispose MediaPipe instances (browser limitation)
- Cannot detect all extensions
- Cannot prevent external debugging tools
- Cannot prevent screen sharing to another device

### General

- High CPU usage with webcam + MediaPipe
- Network latency affects model loading
- Mobile browser support limited

## Next Steps (Priority Order)

### High Priority

1. Backend API for violation storage
2. Instructor review dashboard
3. Question/option randomization
4. Identity verification enforcement

### Medium Priority

5. Hand detection (MediaPipe HandLandmarker)
6. Face verification/matching
7. Accessibility features
8. Analytics and reporting

### Low Priority

9. Phone detection (ObjectDetector)
10. Voice detection (high false positives)
11. Virtual machine detection

## Resources

- [MediaPipe Documentation](https://developers.google.com/mediapipe)
- [FaceLandmarker Guide](https://developers.google.com/mediapipe/solutions/vision/face_landmarker)
- [Browser Proctoring Doc](../browserp%20proctoring/BROWSER-TAMPERING-DETECTTION.md)
- [Vite MediaPipe Config](../../vite.config.ts)
