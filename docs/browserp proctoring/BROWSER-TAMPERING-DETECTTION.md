# Browser Proctoring & Tamper Detection Implementation

## Overview

Comprehensive browser proctoring system with multiple layers of security:

- **Pre-test security checks** - Validates environment before test starts
- **Continuous monitoring** - Detects violations during test
- **Prevention layer** - Blocks common cheating methods
- **Detection layer** - Logs all suspicious activities

## Features

### 1. Pre-Test Security Check

**TamperCheckModal** appears when user clicks "Start Test":

- ✅ **DevTools Open** - Detects if browser DevTools (F12) is open
- ✅ **Console Override** - Detects if console methods are tampered
- ✅ **Suspicious Extensions** - Detects browser extensions (limited)
- ❌ User **cannot start test** until all issues are resolved
- 🔄 "Re-check" button to verify fixes
- ℹ️ Shows dev mode bypass notice

### 2. Prevention Layer (Active During Test)

**DevTools Blocker** (`useDevToolsBlocker`):

- ❌ F12 key blocked
- ❌ Ctrl+Shift+I (Inspect) blocked
- ❌ Ctrl+Shift+J (Console) blocked
- ❌ Ctrl+Shift+C (Inspect Element) blocked
- ❌ Ctrl+U (View Source) blocked
- ❌ Right-click context menu disabled
- ✅ All shortcuts work in dev mode

**Fullscreen Enforcement** (if `require_full_screen=true`):

- 🖥️ Auto-enters fullscreen on test start
- 🔒 Prevents exiting fullscreen (shows warning modal)
- ✅ Auto-exits fullscreen after submission

### 3. Continuous Monitoring During Test

**Browser Proctoring** (`useBrowserProctoring`):

- 🔍 **DevTools Detection** - Checks every 2 seconds (window size difference)
- 🔍 **Tab Switching** - Detects Alt+Tab and tab switches (blur/focus + visibility API)
- 🔍 **Fullscreen Exit** - Detects when user exits fullscreen
- 🔍 **Copy/Paste** - Detects copy, paste, cut operations
- 📊 All violations logged with start/end timestamps
- ⚠️ Real-time alerts displayed to user

**Webcam Monitoring** (if `require_webcam=true`):

- 👤 Face detection (MediaPipe FaceLandmarker)
- 👥 Multiple faces detection
- 👀 Looking away detection (iris tracking)
- 😮 Mouth open detection
- 🙈 Eyes closed detection
- 🔄 Head turned detection

### 4. Violation Display

**For Webcam Tests**:

- Floating draggable ProctoringMonitor card
- Shows camera feed + violations
- Displays all violation types (camera + browser)

**For Non-Webcam Tests**:

- "Cảnh báo vi phạm" card
- Shows browser violations only
- Auto-removes after 3 seconds when violation ends

### 5. Dev Bypass Configuration

**Environment Variable** (`.env`):

```env
VITE_FORCE_TAMPER_DETECTION=false  # Default: bypass in dev
VITE_FORCE_TAMPER_DETECTION=true   # Test actual behavior in dev
```

**Config File** (`src/config/proctoring.config.ts`):

- Auto-bypass in dev mode (`import.meta.env.DEV`)
- Manual override via environment variable
- Production always enforces

## Files Structure

### Configuration

- `/src/config/proctoring.config.ts` - Dev bypass configuration
- `/.env` - Environment variables for tamper detection

### Hooks

- `/src/hooks/useBrowserTamperDetection.ts` - Pre-test security checks
- `/src/hooks/useBrowserProctoring.ts` - Continuous monitoring during test
- `/src/hooks/useDevToolsBlocker.ts` - Blocks DevTools shortcuts
- `/src/hooks/useProctoring.ts` - MediaPipe face detection

### Components

- `/src/components/Proctoring/TamperCheckModal.tsx` - Pre-test security modal
- `/src/components/Proctoring/ProctoringMonitor.tsx` - Floating camera monitor
- `/src/components/Proctoring/CameraConsentModal.tsx` - Camera permission modal

### Pages

- `/src/pages/Student/AvailableAssessments.tsx` - Shows TamperCheckModal before start
- `/src/pages/Student/TakeAssessment.tsx` - Integrates all proctoring features
- `/src/pages/Student/FaceVerification.tsx` - Face verification before test

## Integration Flow

### Starting a Test

1. User clicks "Bắt đầu" on AvailableAssessments page
2. **TamperCheckModal** appears (pre-test security check)
3. User must pass all checks or fix issues
4. If `require_webcam=true` → **CameraConsentModal** appears
5. If consent given → **FaceVerification** page (face detection)
6. After verification → Test starts
7. **Auto-enters fullscreen** (if `require_full_screen=true`)
8. **DevTools blocker** activates
9. **Browser proctoring** starts monitoring
10. **Webcam monitoring** starts (if enabled)

### During Test

- All violations detected and logged
- Real-time alerts shown to user
- Violations stored with timestamps
- Auto-refocus on fullscreen exit

### After Submission

- Auto-exits fullscreen
- Stops all monitoring
- Redirects to results page

## Detection Methods

### DevTools Detection

**Pre-Test Check:**

1. Window size difference: `outerWidth - innerWidth > 160px`
2. Debugger timing: `debugger` statement takes >100ms when DevTools open

**During Test:**

- Checks every 2 seconds
- Tracks start/end timestamps
- Logs duration when DevTools closed

### Tab Switching Detection

1. **Visibility API**: `document.hidden` for same-window tab switches
2. **Blur/Focus Events**: `window.blur/focus` for Alt+Tab to other applications
3. Tracks violation duration

### Fullscreen Detection

- Monitors `document.fullscreenElement`
- Triggers on fullscreen exit
- Shows warning modal to re-enter

### Copy/Paste Detection

- Listens to `copy`, `paste`, `cut` events
- Logs action type in metadata

### Face Detection (MediaPipe)

- 478 facial landmarks + iris landmarks
- Eye Aspect Ratio (EAR) for eyes closed
- Iris position for gaze tracking
- Mouth opening detection
- Head pose estimation

### Console Override Detection

- Checks if `window.console` descriptor is writable

### Extension Detection (Limited)

- Searches DOM for extension-related elements
- **Note**: Not 100% reliable

## Usage

### Development Mode (Default)

```env
# .env
VITE_FORCE_TAMPER_DETECTION=false
```

**Behavior:**

- ✅ All security checks bypassed
- ✅ DevTools shortcuts work
- ✅ Right-click enabled
- ✅ Can use console for debugging
- ℹ️ Modal shows "Chế độ phát triển" notice

### Testing Mode (Dev with Enforcement)

```env
# .env
VITE_FORCE_TAMPER_DETECTION=true
```

**Behavior:**

- ❌ All security checks enforced
- ❌ DevTools shortcuts blocked
- ❌ Right-click disabled
- 🔍 Can test actual proctoring behavior

### Production Mode (Auto-Enforced)

**Behavior:**

- ❌ All security enforced (ignores env var)
- ❌ Users must close DevTools before starting
- 🔍 Continuous monitoring during test
- 📊 All violations logged

## Violation Types

### Browser Violations

```typescript
type BrowserProctoringEvent = {
	type: 'tab_switch' | 'fullscreen_exit' | 'copy_paste' | 'browser_tamper';
	startTime: number;
	endTime: number;
	duration: number;
	metadata?: {
		action?: 'copy' | 'paste' | 'cut';
		hidden?: boolean;
		tamperType?: 'devtools' | 'console' | 'extension';
	};
};
```

### Camera Violations

```typescript
type ProctoringEvent = {
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
};
```

## Limitations

### What We CAN Do

- ✅ Detect DevTools opening
- ✅ Detect tab switching (Alt+Tab)
- ✅ Detect copy/paste
- ✅ Detect fullscreen exit
- ✅ Block common shortcuts (F12, Ctrl+Shift+I, etc.)
- ✅ Enforce fullscreen mode
- ✅ Face detection and monitoring

### What We CANNOT Do

- ❌ Truly prevent Alt+Tab (browser security limitation)
- ❌ Block OS-level shortcuts (Windows key, Cmd+Tab)
- ❌ Detect all browser extensions (many don't leave traces)
- ❌ Prevent external debugging tools
- ❌ Prevent virtual machines
- ❌ Prevent screen sharing to another device

### Reality Check

- This is the **maximum protection possible in a web browser**
- Determined users with advanced knowledge can bypass
- Best used as **deterrent + detection** rather than prevention
- For high-stakes exams, consider:
    - Physical proctoring
    - Lockdown browser (Respondus, Safe Exam Browser)
    - Dedicated exam software at OS level

## Assessment Settings Integration

### Implemented Settings

```typescript
interface AssessmentSettings {
	require_webcam?: boolean; // ✅ Camera monitoring
	prevent_tab_switching?: boolean; // ✅ Tab switch detection
	prevent_copy_paste?: boolean; // ✅ Copy/paste blocking
	require_full_screen?: boolean; // ✅ Fullscreen enforcement
	prevent_right_click?: boolean; // ✅ Right-click blocking

	// Not yet implemented:
	randomize_questions?: boolean; // ❌ Shuffle questions
	randomize_options?: boolean; // ❌ Shuffle options
	questions_per_page?: number; // ❌ Pagination
	show_progress_bar?: boolean; // ❌ Progress bar toggle
	require_identity_verification?: boolean; // ❌ Face verification
	allow_screen_reader?: boolean; // ❌ Accessibility
	font_size_adjustment?: number; // ❌ Font size
	high_contrast_mode?: boolean; // ❌ High contrast
}
```

## Recommendations

### For Low-Stakes Exams

- Enable basic proctoring (tab switching, copy/paste)
- Optional webcam
- Review violations manually

### For Medium-Stakes Exams

- Enable all browser proctoring
- Require webcam
- Require fullscreen
- Review violations + face verification

### For High-Stakes Exams

- Enable all proctoring features
- Require webcam + face verification
- Require fullscreen
- Consider physical proctoring or lockdown browser
- Manual review of all violations

## Console Logging

**Browser Proctoring:**

```
"Browser proctoring enabled:" { preventTabSwitching, requireFullscreen, preventCopyPaste }
"Tab switch violation (hidden):" { event }
"Tab switch violation (visible):" { event }
"Browser tamper detected (DevTools opened):" { event }
"Browser tamper stopped (DevTools closed):" { event, duration }
```

**Face Detection:**

```
"Proctoring violation:" { event }
"Assessment proctoring settings:" { settings }
```

## Future Enhancements

### High Priority

- [ ] Question randomization
- [ ] Option randomization
- [ ] Identity verification enforcement
- [ ] Accessibility features (screen reader, font size, high contrast)

### Medium Priority

- [ ] More DevTools detection methods
- [ ] Specific extension detection
- [ ] Performance API monitoring
- [ ] Virtual machine detection

### Low Priority

- [ ] Voice detection (high false positive rate)
- [ ] Voice chat detection (very resource-intensive)
- [ ] Network monitoring
