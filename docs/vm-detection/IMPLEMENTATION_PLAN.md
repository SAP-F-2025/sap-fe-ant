# Virtual Machine Detection - Implementation Plan

## Executive Summary

**Recommendation: DEFER IMPLEMENTATION**

While technically viable, VM detection should be implemented only for high-stakes assessments (certifications, professional exams) and NOT for general educational use.

**Current Status**: Research complete, implementation deferred
**Priority**: Low (P3)
**Estimated Effort**: 2-3 weeks
**Risk Level**: High (false positives)

---

## Why Defer?

### 1. **High False Positive Rate (10-20%)**

- Students using school/company computers (often VMs)
- Budget laptops with low RAM (≤4GB)
- Linux users with Mesa/software renderers
- Remote desktop users (Citrix, AWS WorkSpaces)
- Docker Desktop users (creates VM layer)

### 2. **Easy to Bypass**

- Configure VM with realistic specs (8GB RAM, 4+ cores, 1920x1080)
- Enable 3D acceleration (shows real GPU)
- Use bare-metal hypervisors (KVM, Xen)
- Spoof browser APIs with extensions

### 3. **Current Stack is Sufficient**

```
✅ Camera proctoring (face detection, multiple faces)
✅ Browser monitoring (tab switch, fullscreen, DevTools)
✅ Copy/paste prevention
✅ Behavioral analytics (answer timing, patterns)
```

### 4. **Support Burden**

- Legitimate students blocked → complaints
- Manual review required → operational cost
- Accessibility issues → legal risk

---

## When to Implement

Consider VM detection ONLY if:

1. **High-stakes exams** (professional certifications, licensing)
2. **Proven fraud pattern** (analytics show VM-based cheating)
3. **Warn-only mode** (flag for review, don't block)
4. **Clear communication** (students informed upfront)
5. **Manual review process** (appeals handled quickly)

---

## Technical Approach

### Detection Methods (Browser-Based)

#### 1. WebGL Renderer Detection

**Confidence: High | False Positive: Medium**

```typescript
const detectVMRenderer = (): { isVM: boolean; renderer: string } => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl');
  
  if (!gl) return { isVM: false, renderer: 'unknown' };
  
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (!debugInfo) return { isVM: false, renderer: 'unknown' };
  
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  
  // VM indicators
  const vmSignatures = [
    'SwiftShader',
    'llvmpipe',
    'VMware',
    'VirtualBox',
    'Microsoft Basic Render Driver'
  ];
  
  const isVM = vmSignatures.some(sig => renderer.includes(sig));
  return { isVM, renderer };
};
```

**Pros**: Direct VM signature detection
**Cons**:

- Disabled hardware acceleration triggers false positive
- Old integrated GPUs use software renderers
- Privacy extensions block WebGL info

---

#### 2. Device Memory Detection

**Confidence: Medium | False Positive: High**

```typescript
const detectLowMemory = (): { isLowMemory: boolean; memory: number } => {
  const memory = (navigator as any).deviceMemory || 8;
  const isLowMemory = memory <= 2;
  return { isLowMemory, memory };
};
```

**Pros**: Simple to implement
**Cons**:

- Only works in Chrome/Edge (not Firefox/Safari)
- Many legitimate devices have ≤4GB RAM
- Capped at 8GB

---

#### 3. Screen Resolution Heuristics

**Confidence: Low | False Positive: Very High**

```typescript
const detectSuspiciousResolution = (): boolean => {
  const { width, height } = screen;
  const vmResolutions = [[1024, 768], [800, 600], [1280, 1024]];
  return vmResolutions.some(([w, h]) => width === w && height === h);
};
```

---

#### 4. CPU Core Count

**Confidence: Medium | False Positive: Medium**

```typescript
const detectLowCoreCount = (): { cores: number; isLow: boolean } => {
  const cores = navigator.hardwareConcurrency || 4;
  const isLow = cores <= 2;
  return { cores, isLow };
};
```

---

### Scoring System

```typescript
interface VMDetectionResult {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  indicators: string[];
  recommendation: 'allow' | 'warn' | 'review' | 'block';
}

const detectVM = (): VMDetectionResult => {
  let score = 0;
  const indicators: string[] = [];
  
  const { isVM: vmRenderer, renderer } = detectVMRenderer();
  if (vmRenderer) {
    score += 40;
    indicators.push(`VM renderer: ${renderer}`);
  }
  
  const { isLowMemory, memory } = detectLowMemory();
  if (isLowMemory) {
    score += 20;
    indicators.push(`Low memory: ${memory}GB`);
  }
  
  const { cores, isLow } = detectLowCoreCount();
  if (isLow) {
    score += 15;
    indicators.push(`Low cores: ${cores}`);
  }
  
  if (detectSuspiciousResolution()) {
    score += 10;
    indicators.push(`Suspicious resolution`);
  }
  
  let confidence: 'low' | 'medium' | 'high';
  let recommendation: 'allow' | 'warn' | 'review' | 'block';
  
  if (score >= 60) {
    confidence = 'high';
    recommendation = 'review';
  } else if (score >= 40) {
    confidence = 'medium';
    recommendation = 'warn';
  } else if (score >= 20) {
    confidence = 'low';
    recommendation = 'warn';
  } else {
    confidence = 'low';
    recommendation = 'allow';
  }
  
  return { score, confidence, indicators, recommendation };
};
```

---

## File Structure

```
src/
├── hooks/
│   └── useVMDetection.ts
├── services/
│   └── vmDetectionService.ts
├── types/
│   └── vmDetection.ts
└── docs/vm-detection/
    ├── IMPLEMENTATION_PLAN.md
    ├── DETECTION_METHODS.md
    ├── BYPASS_TECHNIQUES.md
    └── TESTING_GUIDE.md
```

---

## Alternatives (Better ROI)

### 1. **Question Randomization**

- Different students get different questions
- No false positives

### 2. **Question Pools**

- Large bank of questions
- Random selection per attempt

### 3. **Behavioral Analytics**

- Answer timing patterns
- Copy/paste frequency
- Tab switch correlation

### 4. **Post-Test Analysis**

- Statistical anomaly detection
- Answer similarity detection

---

## Cost-Benefit Analysis

| Aspect | VM Detection | Alternatives |
|--------|-------------|--------------|
| Development | 2-3 weeks | 1-2 weeks |
| False Positives | 10-20% | <1% |
| Bypass Difficulty | Easy | Hard |
| Student Impact | High friction | Low friction |
| Support Burden | High | Low |
| Effectiveness | <5% | 20-30% |

**Verdict**: Alternatives provide better ROI

---

## Recommendation

**DO NOT IMPLEMENT** for general educational assessments.

**CONSIDER** only for:

- High-stakes professional certification
- Proven VM-based fraud pattern
- Warn-only mode (no blocking)

**INSTEAD, FOCUS ON**:

1. Question randomization
2. Behavioral analytics
3. Post-test statistical analysis
4. Question quality improvement
