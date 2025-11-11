# VM Detection Methods - Technical Details

## Browser-Based Detection Techniques

### 1. WebGL Renderer Detection

**How it works**: WebGL exposes GPU vendor and renderer information through the `WEBGL_debug_renderer_info` extension.

**VM Signatures**:

- `SwiftShader` - Software renderer used by Chrome in VMs
- `llvmpipe` - Software renderer used by Firefox in VMs
- `VMware SVGA` - VMware graphics adapter
- `VirtualBox Graphics Adapter` - VirtualBox graphics
- `Microsoft Basic Render Driver` - Hyper-V/Windows Sandbox

**Implementation**:

```typescript
function getWebGLInfo() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return null;
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return null;
  
  return {
    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
  };
}
```

**Bypass Methods**:

- Enable 3D acceleration in VM settings
- Use privacy extensions that block WebGL info
- Disable WebGL entirely (but this itself is suspicious)

**False Positives**:

- Old integrated GPUs (Intel HD 2000/3000)
- Disabled hardware acceleration
- Linux systems with Mesa drivers
- Chromebooks with software rendering

---

### 2. Device Memory API

**How it works**: `navigator.deviceMemory` reports approximate RAM in GB.

**VM Indicators**:

- ≤2GB: High probability of VM
- 4GB: Medium probability
- ≥8GB: Low probability (but capped at 8GB)

**Implementation**:

```typescript
function getDeviceMemory() {
  return (navigator as any).deviceMemory || null;
}
```

**Limitations**:

- Only supported in Chrome/Edge
- Returns `undefined` in Firefox/Safari
- Capped at 8GB (can't distinguish 16GB from 32GB)
- Quantized values (0.25, 0.5, 1, 2, 4, 8)

**Bypass Methods**:

- Configure VM with 8GB RAM
- Use Firefox/Safari (returns undefined)

**False Positives**:

- Budget laptops (2-4GB common)
- Old computers
- Chromebooks
- Tablets

---

### 3. Hardware Concurrency (CPU Cores)

**How it works**: `navigator.hardwareConcurrency` reports logical CPU count.

**VM Indicators**:

- 1-2 cores: High probability
- 4 cores: Medium probability
- ≥8 cores: Low probability

**Implementation**:

```typescript
function getCPUCores() {
  return navigator.hardwareConcurrency || null;
}
```

**Bypass Methods**:

- Configure VM with 4+ cores
- Easy to adjust in VM settings

**False Positives**:

- Old laptops (2 cores common)
- Budget devices
- Tablets
- Single-core systems

---

### 4. Screen Resolution

**How it works**: Check for common VM default resolutions.

**VM Indicators**:

- 1024x768 (VirtualBox default)
- 800x600 (old VM default)
- 1280x1024 (VMware default)

**Implementation**:

```typescript
function getScreenInfo() {
  return {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelDepth: screen.pixelDepth
  };
}
```

**Bypass Methods**:

- Resize VM window
- Set custom resolution
- Use fullscreen mode

**False Positives**:

- Projector mode
- Accessibility settings
- Old monitors
- Multi-monitor setups

---

### 5. Browser Focus Detection

**How it works**: VMs may not properly propagate focus events.

**VM Indicators**:

- Browser never loses focus when clicking outside VM
- Inconsistent focus/blur events

**Implementation**:

```typescript
let focusLossCount = 0;

window.addEventListener('blur', () => {
  focusLossCount++;
});

// If focusLossCount stays 0 for extended period, might be VM
```

**Bypass Methods**:

- Use seamless mode (VMware Unity, VirtualBox Seamless)
- Install guest additions properly

**False Positives**:

- Fullscreen applications
- Kiosk mode
- Single-window workflows

---

### 6. WebRTC Local IP Leak

**How it works**: WebRTC can leak local IP addresses, VMs often have specific IP ranges.

**VM Indicators**:

- IP in 192.168.x.x range (NAT)
- Specific VM network adapter IPs

**Implementation**:

```typescript
async function getLocalIPs() {
  const ips: string[] = [];
  const pc = new RTCPeerConnection({ iceServers: [] });
  
  pc.createDataChannel('');
  await pc.createOffer().then(offer => pc.setLocalDescription(offer));
  
  pc.onicecandidate = (ice) => {
    if (!ice || !ice.candidate) return;
    const ipMatch = /([0-9]{1,3}\.){3}[0-9]{1,3}/.exec(ice.candidate.candidate);
    if (ipMatch) ips.push(ipMatch[0]);
  };
  
  return ips;
}
```

**Bypass Methods**:

- Use bridged networking
- VPN
- Browser blocks WebRTC leaks

**False Positives**:

- Home networks (192.168.x.x is standard)
- Corporate networks
- Mobile hotspots

---

### 7. Canvas Fingerprinting Anomalies

**How it works**: VMs may render canvas differently due to software rendering.

**VM Indicators**:

- Identical canvas fingerprints across "different" devices
- Anomalous rendering patterns

**Implementation**:

```typescript
function getCanvasFingerprint() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('VM Detection Test', 2, 2);
  
  return canvas.toDataURL();
}
```

**Bypass Methods**:

- Enable 3D acceleration
- Use canvas fingerprint randomizers

**False Positives**:

- Same hardware/software combination
- Browser fingerprint protection

---

### 8. Timing Attacks

**How it works**: VMs have performance overhead, detectable through timing.

**VM Indicators**:

- Slower performance on compute-heavy tasks
- Inconsistent timing patterns

**Implementation**:

```typescript
function performanceTest() {
  const start = performance.now();
  
  // CPU-intensive task
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
  }
  
  const duration = performance.now() - start;
  return duration;
}
```

**Bypass Methods**:

- Allocate more CPU to VM
- Use hardware virtualization

**False Positives**:

- Slow computers
- Background processes
- Thermal throttling

---

### 9. MAC Address Vendor Detection

**How it works**: VM network adapters use specific MAC address ranges.

**VM Indicators**:

- VMware: `00:05:69`, `00:0C:29`, `00:1C:14`, `00:50:56`
- VirtualBox: `08:00:27`
- Hyper-V: `00:15:5D`
- Parallels: `00:1C:42`

**Implementation**:

```typescript
// Note: Direct MAC access not available in browser
// Can only detect through network timing or WebRTC leaks
async function detectVMMAC() {
  // This is theoretical - browsers don't expose MAC addresses
  // But can be detected server-side from network packets
  return null;
}
```

**Limitations**:

- Not accessible from browser JavaScript
- Requires server-side packet inspection
- Can be spoofed easily in VM settings

**Bypass Methods**:

- Change MAC address in VM settings
- Use random MAC generation

**False Positives**:

- None (if MAC is detected, it's definitive)

---

### 10. Battery API Detection

**How it works**: VMs typically don't report battery status.

**VM Indicators**:

- No battery detected on "laptop"
- Always reports charging/100%
- Inconsistent battery behavior

**Implementation**:

```typescript
async function detectBatteryAnomaly() {
  if (!('getBattery' in navigator)) return null;
  
  try {
    const battery = await (navigator as any).getBattery();
    return {
      charging: battery.charging,
      level: battery.level,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime
    };
  } catch {
    return null;
  }
}
```

**Limitations**:

- API removed from Firefox for privacy
- Not available on desktop browsers
- VMs can pass through host battery info

**Bypass Methods**:

- Configure VM to report battery
- Use laptop as host

**False Positives**:

- Desktop computers (no battery)
- Removed battery
- API not supported

---

### 11. Touch/Pointer Events Detection

**How it works**: VMs may not properly emulate touch events.

**VM Indicators**:

- No touch support on "mobile" device
- Mouse events only
- Inconsistent pointer types

**Implementation**:

```typescript
function detectTouchSupport() {
  return {
    hasTouchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    maxTouchPoints: navigator.maxTouchPoints,
    pointerEnabled: 'PointerEvent' in window
  };
}
```

**Bypass Methods**:

- Enable touch emulation in VM
- Use mobile emulator settings

**False Positives**:

- Desktop computers (no touch)
- Disabled touch drivers

---

### 12. Sensor API Detection

**How it works**: VMs lack physical sensors (accelerometer, gyroscope).

**VM Indicators**:

- No sensor data on "mobile" device
- Sensors not available
- Static sensor readings

**Implementation**:

```typescript
function detectSensors() {
  return {
    hasAccelerometer: 'Accelerometer' in window,
    hasGyroscope: 'Gyroscope' in window,
    hasOrientationSensor: 'AbsoluteOrientationSensor' in window,
    deviceOrientation: 'ondeviceorientation' in window
  };
}
```

**Limitations**:

- Desktop browsers don't have sensors
- Only useful for mobile device detection

**Bypass Methods**:

- Use real mobile device
- Emulate sensor data

**False Positives**:

- Desktop computers
- Disabled sensors
- Privacy settings

---

### 13. Audio Context Fingerprinting

**How it works**: VMs may process audio differently.

**VM Indicators**:

- Different audio processing signatures
- Software audio rendering
- Identical fingerprints across "devices"

**Implementation**:

```typescript
function getAudioFingerprint() {
  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = context.createOscillator();
  const analyser = context.createAnalyser();
  const gainNode = context.createGain();
  const scriptProcessor = context.createScriptProcessor(4096, 1, 1);
  
  gainNode.gain.value = 0;
  oscillator.connect(analyser);
  analyser.connect(scriptProcessor);
  scriptProcessor.connect(gainNode);
  gainNode.connect(context.destination);
  
  oscillator.start(0);
  
  return new Promise((resolve) => {
    scriptProcessor.onaudioprocess = (event) => {
      const output = event.outputBuffer.getChannelData(0);
      const hash = Array.from(output.slice(0, 30)).join(',');
      oscillator.stop();
      scriptProcessor.disconnect();
      resolve(hash);
    };
  });
}
```

**Bypass Methods**:

- Enable audio passthrough
- Use audio fingerprint randomizers

**False Positives**:

- Same hardware/software combination
- Audio fingerprint protection

---

### 14. Font Enumeration

**How it works**: VMs may have different installed fonts.

**VM Indicators**:

- Limited font set (default Windows/Linux fonts only)
- Missing common fonts
- Unusual font combinations

**Implementation**:

```typescript
function detectFonts() {
  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const testFonts = [
    'Arial', 'Verdana', 'Times New Roman', 'Courier New',
    'Georgia', 'Palatino', 'Garamond', 'Bookman',
    'Comic Sans MS', 'Trebuchet MS', 'Impact'
  ];
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  const detectedFonts: string[] = [];
  
  testFonts.forEach(font => {
    let detected = false;
    baseFonts.forEach(baseFont => {
      context.font = `72px ${baseFont}`;
      const baseWidth = context.measureText('mmmmmmmmmmlli').width;
      
      context.font = `72px ${font}, ${baseFont}`;
      const testWidth = context.measureText('mmmmmmmmmmlli').width;
      
      if (baseWidth !== testWidth) {
        detected = true;
      }
    });
    if (detected) detectedFonts.push(font);
  });
  
  return detectedFonts;
}
```

**Bypass Methods**:

- Install common fonts in VM
- Use font randomizers

**False Positives**:

- Minimal OS installations
- Custom font configurations
- Privacy-focused setups

---

### 15. Webcam/Media Device Detection

**How it works**: VMs may not have webcam or show "VirtualBox" prefix.

**VM Indicators**:

- No webcam on "laptop"
- Device name contains "VirtualBox", "VMware"
- Unusual device IDs

**Implementation**:

```typescript
async function detectMediaDevices() {
  if (!navigator.mediaDevices?.enumerateDevices) return null;
  
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(d => d.kind === 'videoinput');
  
  const vmIndicators = videoDevices.filter(device => 
    device.label.includes('VirtualBox') ||
    device.label.includes('VMware') ||
    device.label.includes('Virtual')
  );
  
  return {
    hasCamera: videoDevices.length > 0,
    cameraCount: videoDevices.length,
    vmIndicators: vmIndicators.map(d => d.label)
  };
}
```

**Bypass Methods**:

- Pass through host webcam
- Rename device in VM settings

**False Positives**:

- Desktop computers without webcam
- Disabled camera
- Privacy settings

---

## Detection Confidence Matrix

| Method | Confidence | False Positive Rate | Bypass Difficulty |
|--------|-----------|-------------------|------------------|
| WebGL Renderer | High | Medium (15%) | Medium |
| Device Memory | Medium | High (25%) | Easy |
| CPU Cores | Medium | High (20%) | Easy |
| Screen Resolution | Low | Very High (30%) | Very Easy |
| Focus Detection | Low | High (25%) | Medium |
| WebRTC IP | Low | Very High (40%) | Easy |
| Canvas Fingerprint | Medium | Medium (15%) | Medium |
| Timing Attacks | Low | High (30%) | Easy |
| MAC Address | N/A | N/A (server-side) | Easy |
| Battery API | Low | Very High (50%) | Easy |
| Touch Events | Low | Very High (45%) | Easy |
| Sensor API | Low | Very High (50%) | Easy |
| Audio Fingerprint | Medium | Medium (20%) | Medium |
| Font Enumeration | Low | High (30%) | Easy |
| Media Devices | Medium | High (25%) | Medium |

---

## Recommended Scoring Weights

```typescript
const DETECTION_WEIGHTS = {
  // High confidence indicators
  webglRenderer: 40,           // VM-specific renderer names
  mediaDeviceVM: 35,           // "VirtualBox" in webcam name
  
  // Medium confidence indicators
  deviceMemory: 20,            // ≤2GB RAM
  cpuCores: 15,                // ≤2 cores
  canvasFingerprint: 15,       // Anomalous rendering
  audioFingerprint: 15,        // Different audio processing
  
  // Low confidence indicators
  screenResolution: 10,        // Common VM resolutions
  timingAttack: 10,            // Slower performance
  batteryMissing: 8,           // No battery on "laptop"
  fontCount: 7,                // Limited fonts
  noTouch: 5,                  // No touch on "mobile"
  noSensors: 5,                // No sensors on "mobile"
  focusDetection: 5,           // Focus never lost
  webrtcIP: 5                  // NAT IP range
};

// Total: 195 points possible
// Thresholds:
//   0-39: Low risk (allow)
//   40-79: Medium risk (warn)
//   80-119: High risk (review)
//   120+: Very high risk (block for high-stakes only)
```

---

## Browser Compatibility

| Method | Chrome | Firefox | Safari | Edge | Mobile |
|--------|--------|---------|--------|------|--------|
| WebGL | ✅ | ✅ | ✅ | ✅ | ✅ |
| Device Memory | ✅ | ❌ | ❌ | ✅ | ✅ |
| CPU Cores | ✅ | ✅ | ✅ | ✅ | ✅ |
| Screen Info | ✅ | ✅ | ✅ | ✅ | ✅ |
| Focus Events | ✅ | ✅ | ✅ | ✅ | ✅ |
| WebRTC | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Canvas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Performance | ✅ | ✅ | ✅ | ✅ | ✅ |
| Battery API | ✅ | ❌ | ❌ | ✅ | ✅ |
| Touch Events | ✅ | ✅ | ✅ | ✅ | ✅ |
| Sensor API | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ✅ |
| Audio Context | ✅ | ✅ | ✅ | ✅ | ✅ |
| Font Detection | ✅ | ✅ | ✅ | ✅ | ✅ |
| Media Devices | ✅ | ✅ | ✅ | ✅ | ✅ |

**Legend**: ✅ Full support | ⚠️ Partial support | ❌ Not supported

---

## Privacy Considerations

**Data Collected**:

- GPU vendor/renderer name
- RAM amount
- CPU core count
- Screen resolution
- Local IP addresses
- Canvas fingerprint
- Performance metrics

**Privacy Risks**:

- Device fingerprinting
- User tracking across sessions
- Hardware profiling

**Mitigation**:

- Only collect when proctoring enabled
- Hash fingerprints before storage
- Delete after exam completion
- Comply with GDPR/privacy laws
- Clear disclosure to users

---

## References

- [WebGL Specification](https://www.khronos.org/webgl/)
- [Device Memory API](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/deviceMemory)
- [Hardware Concurrency](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/hardwareConcurrency)
- [Browser Fingerprinting](https://browserleaks.com/)
