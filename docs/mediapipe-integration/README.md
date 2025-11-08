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

## Documentation Structure

```
docs/mediapipe-integration/
├── README.md                    # This overview
├── installation.md              # Setup and dependencies
├── architecture.md              # Technical architecture
├── implementation-plan.md       # Step-by-step implementation
├── api-integration.md          # Backend API requirements
├── ui-components.md            # Frontend components design
├── testing-strategy.md         # Testing approach
└── deployment.md               # Production deployment
```

## Implementation Status

### ✅ Completed Features

**Core Proctoring (MediaPipe FaceLandmarker)**
- ✅ Face detection (no face/multiple faces)
- ✅ Gaze tracking (looking away - iris-based)
- ✅ Mouth open detection
- ✅ Head turned detection
- ✅ Eyes closed detection
- ✅ Real-time violation alerts (red → yellow transition)
- ✅ Draggable camera monitor with position persistence
- ✅ Violation event tracking (start/end timestamps)

**Assessment Integration**
- ✅ Camera consent modal (allow once/always)
- ✅ Face verification page
- ✅ Proctoring monitor in assessment taking
- ✅ Camera lifecycle management
- ✅ Violation count tracking

### 🚧 Not Implemented

**Additional Violations (Require Different Approaches)**
- ❌ Hand detection (needs MediaPipe HandLandmarker)
- ❌ Phone detection (needs MediaPipe ObjectDetector)
- ❌ Face verification/mismatch (needs face-api.js or backend)
- ❌ Tab switching (needs Page Visibility API)
- ❌ Copy/paste detection (needs Clipboard API)
- ❌ Fullscreen exit (needs Fullscreen API)
- ❌ Voice/audio detection (needs Web Audio API)
- ❌ Browser DevTools detection

**Backend Integration**
- ❌ Violation storage to database
- ❌ Proctoring event API endpoints
- ❌ Instructor review dashboard
- ❌ Analytics and reporting

## Technical Details

**MediaPipe Package**: `@mediapipe/tasks-vision`
**Model**: FaceLandmarker (478 landmarks + iris)
**Detection Thresholds**:
- Looking away: Iris position outside 0.3-0.7 (horizontal), 0.35-0.65 (vertical)
- Mouth open: Lip distance > 0.03
- Head turned: Nose offset > 0.15 from face center
- Eyes closed: Eye aspect ratio < 0.18

## Next Steps

1. Implement backend API for violation storage
2. Add hand detection (MediaPipe HandLandmarker)
3. Add face verification (face-api.js)
4. Implement browser-level violations (tab switch, fullscreen, etc.)
5. Build instructor review dashboard
