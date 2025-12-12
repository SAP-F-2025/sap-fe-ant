# Proctoring Review UI - Design Document

## Overview

This document outlines the design for a Proctoring Review UI that allows teachers/admins to monitor and review violations from student exam attempts. The design integrates with the existing group-based assessment system and the **protocring-service** (TimescaleDB-based violation storage).

---

## Current Architecture

### Backend Services

1. **protocring-service** (Port 8081/8889) - Violation Storage & Analytics
   - TimescaleDB for time-series violation data
   - Continuous aggregates for hourly/daily stats
   - Real-time violation ingestion
   - Dashboard analytics endpoints

2. **assessment-service** - Core Assessment Logic
   - Attempts, Questions, Grading
   - Group management

### Existing Frontend Components

1. **Violation Detection (Student Side)**
   - `ProctoringMonitor` - Real-time camera monitoring during exam
   - `useProctoring` hook - MediaPipe face detection violations
   - `useBrowserProctoring` hook - Tab switch, fullscreen, copy/paste detection
   - `violationService` - Submits violations to protocring-service

2. **Data Flow**

   ```
   Frontend (Exam)                    protocring-service
   ├── useProctoring      ────────▶  POST /api/v1/violations
   ├── useBrowserProctoring ───────▶  POST /api/v1/violations/batch
   └── violationService

   Frontend (Review)                  protocring-service
   ├── ProctoringDashboard ◀────────  GET /api/v1/dashboard/*
   └── GradingDetail       ◀────────  GET /api/v1/violations/attempt/{id}
   ```

3. **Violation Types** (from backend model)

   | ID | Type | Category |
   |----|------|----------|
   | 0 | `face_not_detected` | Camera |
   | 1 | `multiple_faces` | Camera |
   | 2 | `looking_away` | Camera |
   | 3 | `mouth_open` | Camera |
   | 4 | `hand_detected` | Camera |
   | 5 | `head_turned_away` | Camera |
   | 6 | `copy_paste` | Browser |
   | 7 | `switching_tab` | Browser |
   | 8 | `full_screen` | Browser |
   | 9 | `phone_detect` | Camera |
   | 10 | `voice` | Audio |
   | 11 | `browser_tamper` | Browser |
   | 12 | `voice_chat` | Audio |
   | 13 | `face_mismatch` | Identity |
   | 14 | `fail_liveness_challenge` | Identity |

4. **Severity Levels** (from backend model)

   | Level | Name | Description |
   |-------|------|-------------|
   | 0 | Low | Minor, informational |
   | 1 | Medium | Attention needed |
   | 2 | High | Suspicious behavior |
   | 3 | Critical | Likely cheating |

---

## Available API Endpoints (protocring-service)

### Violations APIs

```typescript
// 1. Ingest single violation (used by student during exam)
POST /api/v1/violations
Body: CreateViolationRequest

// 2. Batch ingest violations (max 50)
POST /api/v1/violations/batch
Body: { violations: CreateViolationRequest[] }

// 3. Get violations by attempt (with pagination)
GET /api/v1/violations/attempt/{attempt_id}?page=1&pageSize=10
Response: ViolationListResponse

// 4. Get latest violation for attempt
GET /api/v1/violations/attempt/{attempt_id}/latest
Response: ViolationLog

// 5. Get violation analytics for attempt (timeline)
GET /api/v1/violations/analytics/{attempt_id}?bucket_size=5m
Response: { timeline data with aggregated stats }
```

### Dashboard APIs

```typescript
// 1. Get hourly statistics (last 24h default)
GET /api/v1/dashboard/stats/hourly?start_time=...&end_time=...
Response: { data: HourlyViolationStats[], count: number }

// 2. Get daily statistics (last 30d default)
GET /api/v1/dashboard/stats/daily?start_time=...&end_time=...
Response: { data: DailyViolationStats[], count: number }

// 3. Get attempt violation summary
GET /api/v1/dashboard/attempts/{attempt_id}/summary
Response: AttemptViolationSummary

// 4. Get summaries for multiple attempts (batch)
GET /api/v1/dashboard/attempts/summaries?attempt_ids=123,456,789
Response: { data: AttemptViolationSummary[], count: number }

// 5. Get user violation patterns (behavioral analysis)
GET /api/v1/dashboard/users/{user_id}/patterns?start_time=...&end_time=...
Response: { data: UserViolationPattern[], count: number }

// 6. Get dashboard overview (high-level metrics)
GET /api/v1/dashboard/overview?start_time=...&end_time=...
Response: { data: DashboardOverview }

// 7. Get real-time statistics
GET /api/v1/dashboard/realtime
Response: RealTimeStats
```

---

## Proposed UI Design

### 1. Proctoring Dashboard (New Page)

**Route**: `/proctoring` (admin/teacher only)

**Purpose**: Overview of all proctoring activity across assessments/groups

```
┌─────────────────────────────────────────────────────────────────┐
│  📊 Proctoring Dashboard                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │ Total   │  │ Pending │  │ High    │  │ Reviewed│            │
│  │ 156     │  │ 23      │  │ 8       │  │ 125     │            │
│  │ Events  │  │ Review  │  │ Severity│  │         │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Filters:                                                    ││
│  │ [Assessment ▼] [Group ▼] [Status ▼] [Severity ▼] [Search]  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Student        │ Assessment    │ Violations │ Severity │ ⚙️ ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ 👤 John Doe    │ Math Final    │ 5          │ 🔴 High  │ 👁 ││
│  │ 👤 Jane Smith  │ Physics Quiz  │ 2          │ 🟡 Med   │ 👁 ││
│  │ 👤 Bob Wilson  │ Math Final    │ 8          │ 🔴 High  │ 👁 ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 2. Attempt Proctoring Detail (Enhanced GradingDetail)

**Route**: `/grading/:attemptId` (existing, enhanced with proctoring tab)

**Purpose**: Review individual attempt with proctoring timeline

```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Grading: John Doe - Math Final Exam                         │
├─────────────────────────────────────────────────────────────────┤
│  [Answers] [Proctoring 🔴 5] [Timeline]                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Proctoring Summary                                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Total: 5 │ Camera: 3 │ Browser: 2 │ Severity: High          ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Timeline                                                       │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ ●──●─────●────●───────●─────────────────────────────────────││
│  │ 0  2     5    8      15                              60 min ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  Violations                                                     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 🔴 00:02:15 - Multiple Faces Detected (3.2s)    [📷] [✓][✗]││
│  │ 🟡 00:05:30 - Tab Switch (1.8s)                 [📷] [✓][✗]││
│  │ 🔴 00:08:45 - Face Not Detected (5.1s)          [📷] [✓][✗]││
│  │ 🟡 00:15:20 - Looking Away (2.3s)               [📷] [✓][✗]││
│  │ 🔴 00:15:22 - Fullscreen Exit                   [📷] [✓][✗]││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Mark All Reviewed] [Flag for Investigation] [Dismiss All]     │
└─────────────────────────────────────────────────────────────────┘
```

### 3. Violation Detail Modal

**Purpose**: Detailed view of a single violation with evidence

```
┌─────────────────────────────────────────────────────────────────┐
│  🔴 Multiple Faces Detected                           [X]       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐  Details                               │
│  │                     │  ─────────                             │
│  │  [Screenshot/       │  Type: multiple_faces                  │
│  │   Video Frame]      │  Time: 00:02:15                        │
│  │                     │  Duration: 3.2 seconds                 │
│  │                     │  Question: #5 - Calculus               │
│  │                     │  Severity: High                        │
│  └─────────────────────┘                                        │
│                                                                 │
│  Context                                                        │
│  ─────────                                                      │
│  IP Address: 192.168.1.100                                      │
│  Browser: Chrome 120.0                                          │
│  OS: Windows 11                                                 │
│                                                                 │
│  Review Notes                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Add notes about this violation...                           ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Dismiss - False Positive] [Mark as Reviewed] [Flag - Cheating]│
└─────────────────────────────────────────────────────────────────┘
```

### 4. Group Proctoring View (New Tab in GroupDetail)

**Route**: `/groups/:id` → Proctoring Tab

**Purpose**: View proctoring statistics for a specific group

```
┌─────────────────────────────────────────────────────────────────┐
│  👥 Math Class 12A                                              │
├─────────────────────────────────────────────────────────────────┤
│  [Members] [Assessments] [Proctoring 📊]                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Group Proctoring Overview                                      │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Assessment          │ Attempts │ Violations │ Flagged │ ⚙️  ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │ Math Final Exam     │ 25       │ 12         │ 3       │ 👁  ││
│  │ Physics Quiz        │ 25       │ 5          │ 0       │ 👁  ││
│  │ Chemistry Test      │ 20       │ 8          │ 2       │ 👁  ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  High Risk Students (This Group)                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 👤 John Doe    - 15 violations across 3 assessments         ││
│  │ 👤 Jane Smith  - 8 violations across 2 assessments          ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Structure

```
src/pages/Proctoring/
├── index.ts
├── ProctoringDashboard.tsx       # Main dashboard page
├── ProctoringAttemptList.tsx     # List of attempts with violations
├── ProctoringTimeline.tsx        # Visual timeline component
├── ViolationCard.tsx             # Individual violation display
├── ViolationDetailModal.tsx      # Detailed violation modal
└── ProctoringStats.tsx           # Statistics cards

src/components/Proctoring/
├── ProctoringMonitor.tsx         # (Existing) Student-side monitor
├── ProctoringTab.tsx             # (New) Tab for GradingDetail
├── ViolationBadge.tsx            # Severity indicator
└── ViolationTimeline.tsx         # Reusable timeline

src/pages/Groups/
├── GroupDetail.tsx               # (Enhanced) Add Proctoring tab
└── GroupProctoringTab.tsx        # (New) Group proctoring view
```

---

## API Integration

### Already Available APIs (protocring-service)

| Feature | Endpoint | Status |
|---------|----------|--------|
| Get violations for attempt | `GET /violations/attempt/{id}` | ✅ Ready |
| Get attempt summary | `GET /dashboard/attempts/{id}/summary` | ✅ Ready |
| Get batch summaries | `GET /dashboard/attempts/summaries` | ✅ Ready |
| Get hourly stats | `GET /dashboard/stats/hourly` | ✅ Ready |
| Get daily stats | `GET /dashboard/stats/daily` | ✅ Ready |
| Get user patterns | `GET /dashboard/users/{id}/patterns` | ✅ Ready |
| Get dashboard overview | `GET /dashboard/overview` | ✅ Ready |
| Get real-time stats | `GET /dashboard/realtime` | ✅ Ready |

### Endpoints to Add (assessment-service or protocring-service)

```typescript
// 1. Get proctoring summary for a group (needs group context)
// Option A: Add to assessment-service (has group data)
GET /api/v1/groups/:groupId/proctoring-summary
// Option B: Pass attempt_ids to protocring-service batch endpoint

// 2. Review status management (not in current API)
// Could be added to protocring-service
PATCH /api/v1/violations/{id}/review
Body: { review_status: string, review_notes?: string }

// 3. Bulk review update
PATCH /api/v1/violations/review/bulk
Body: { violation_ids: number[], review_status: string }
```

---

## TypeScript Types (Aligned with protocring-service)

```typescript
// Add to src/types/proctoring.ts or src/types/index.ts

// ============ Request Types ============

export interface BrowserInfo {
  user_agent: string;
  platform: string;
  language: string;
  screen_resolution: string;
  timezone: string;
}

export interface CreateViolationRequest {
  attempt_id: number;
  user_id: string;
  assessment_id: number;
  violation_type: number;  // 0-14 (see violation type enum)
  severity: number;        // 0-3 (Low/Medium/High/Critical)
  confidence_score: number; // 0.0-1.0
  snapshot_url?: string;
  browser_info: BrowserInfo;
  device_fingerprint: string;
  created_at: string;      // ISO 8601 - violation start
  ended_at: string;        // ISO 8601 - violation end
  is_prolonged: boolean;
}

// ============ Response Types ============

export interface ViolationLog {
  id: number;
  attempt_id: number;
  user_id: string;
  assessment_id: number;
  violation_type: number;
  severity: number;
  confidence_score: number;
  snapshot_url?: string;
  browser_info: BrowserInfo;
  device_fingerprint: string;
  created_at: string;
  ended_at: string;
  is_prolonged: boolean;
}

export interface ViolationResponse {
  id: number;
  attempt_id: number;
  user_id: string;
  assessment_id: number;
  violation_type: number;
  violation_name: string;    // Human-readable name
  severity: number;
  severity_name: string;     // Human-readable severity
  confidence_score: number;
  created_at: string;
  status: 'processed' | 'failed';
}

export interface ViolationListResponse {
  data: ViolationLog[];
  count: number;
  limit: number;
  offset: number;
}

// ============ Dashboard Types ============

export interface AttemptViolationSummary {
  attempt_id: number;
  user_id: string;
  assessment_id: number;
  first_violation_at: string;
  last_violation_at: string;
  duration_seconds: number;
  total_violations: number;
  unique_violation_types: number;
  prolonged_violations_count: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  max_severity_level: number;
  violation_types: number[];
  avg_confidence: number;
  max_confidence: number;
  min_confidence: number;
}

export interface HourlyViolationStats {
  bucket: string;
  total_violations: number;
  unique_attempts: number;
  unique_users: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  face_not_detected_count: number;
  multiple_faces_count: number;
  looking_away_count: number;
  hand_detected_count: number;
  switching_tab_count: number;
  fullscreen_count: number;
  prolonged_count: number;
  avg_confidence: number;
}

export interface DailyViolationStats extends HourlyViolationStats {
  unique_assessments: number;
  mouth_open_count: number;
  copy_paste_count: number;
  phone_detect_count: number;
  avg_duration_seconds: number;
}

export interface UserViolationPattern {
  bucket: string;
  user_id: string;
  total_violations: number;
  attempts_count: number;
  assessments_count: number;
  critical_count: number;
  high_count: number;
  prolonged_count: number;
  most_common_violation: number;
  unique_violation_types: number;
  has_multiple_faces: boolean;
  has_hand_detected: boolean;
  has_switching_tab: boolean;
  has_fullscreen_exit: boolean;
  avg_confidence: number;
}

export interface ViolationTypeCount {
  violation_type: number;
  type_name: string;
  count: number;
  percentage: number;
}

export interface DashboardOverview {
  total_violations: number;
  total_attempts: number;
  total_users: number;
  total_assessments: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  violations_change: number;  // % change from previous period
  attempts_change: number;
  users_change: number;
  top_violation_types: ViolationTypeCount[];
}

export interface RealTimeStats {
  last_updated: string;
  active_attempts: number;
  violations_last_5min: number;
  violations_last_hour: number;
  critical_violations: number;
  recent_violations: ViolationLog[];
}

// ============ Enums ============

export const ViolationType = {
  FACE_NOT_DETECTED: 0,
  MULTIPLE_FACES: 1,
  LOOKING_AWAY: 2,
  MOUTH_OPEN: 3,
  HAND_DETECTED: 4,
  HEAD_TURNED_AWAY: 5,
  COPY_PASTE: 6,
  SWITCHING_TAB: 7,
  FULL_SCREEN: 8,
  PHONE_DETECT: 9,
  VOICE: 10,
  BROWSER_TAMPER: 11,
  VOICE_CHAT: 12,
  FACE_MISMATCH: 13,
  FAIL_LIVENESS_CHALLENGE: 14,
} as const;

export const ViolationTypeName: Record<number, string> = {
  0: 'Face Not Detected',
  1: 'Multiple Faces',
  2: 'Looking Away',
  3: 'Mouth Open',
  4: 'Hand Detected',
  5: 'Head Turned Away',
  6: 'Copy/Paste',
  7: 'Tab Switch',
  8: 'Fullscreen Exit',
  9: 'Phone Detected',
  10: 'Voice Detected',
  11: 'Browser Tampered',
  12: 'Voice Chat',
  13: 'Face Mismatch',
  14: 'Failed Liveness',
};

export const Severity = {
  LOW: 0,
  MEDIUM: 1,
  HIGH: 2,
  CRITICAL: 3,
} as const;

export const SeverityName: Record<number, string> = {
  0: 'Low',
  1: 'Medium',
  2: 'High',
  3: 'Critical',
};

export const SeverityColor: Record<number, string> = {
  0: '#52c41a',  // green
  1: '#faad14',  // gold
  2: '#fa8c16',  // orange
  3: '#f5222d',  // red
};
```

---

## Severity Levels (Backend Definition)

| Level | Name | Color | Description | Typical Violations |
|-------|------|-------|-------------|-------------------|
| 0 | Low | 🟢 Green | Minor, informational | `mouth_open`, brief `eyes_closed` |
| 1 | Medium | 🟡 Yellow | Attention needed | `fullscreen_exit`, `head_turned` |
| 2 | High | 🟠 Orange | Suspicious behavior | `looking_away`, `copy_paste` |
| 3 | Critical | 🔴 Red | Likely cheating | `tab_switch`, `multiple_faces`, `face_not_detected`, `phone_detect` |

> **Note**: Severity is calculated client-side in `violationService.ts` based on violation type. See `SEVERITY_MAP` constant.

---

## Implementation Priority

### Phase 1: Core Proctoring Review

1. `ProctoringTab` in GradingDetail - View violations for single attempt
2. `ViolationDetailModal` - Review individual violations
3. API: Get proctoring events for attempt

### Phase 2: Dashboard & Group View

1. `ProctoringDashboard` - Overview page
2. `GroupProctoringTab` - Group-level proctoring view
3. API: Dashboard and group summary endpoints

### Phase 3: Advanced Features

1. Screenshot/video evidence display
2. Bulk review actions
3. Export proctoring reports
4. Real-time monitoring (WebSocket)

---

## Routes to Add

```tsx
// In App.tsx

// Admin/Teacher routes
<Route path="proctoring" element={
  <RoleBasedRedirect allowedRoles={['admin', 'teacher']}>
    <ProctoringDashboard />
  </RoleBasedRedirect>
} />

// Proctoring events for specific attempt (via GradingDetail tab)
// Already covered by /grading/:attemptId
```

---

## UI Libraries to Use

- **Ant Design**: Cards, Tables, Modal, Timeline, Badge, Tag
- **Recharts**: Timeline visualization, severity charts
- **dayjs**: Time formatting
- **react-player** (optional): Video evidence playback

---

## Implementation Notes

### API Configuration

Add proctoring dashboard endpoints to `src/config/api.ts`:

```typescript
// Proctoring Dashboard (uses PROCTORING_BASE_URL)
PROCTORING_VIOLATIONS_BY_ATTEMPT: (attemptId: number) => `/api/v1/violations/attempt/${attemptId}`,
PROCTORING_VIOLATIONS_LATEST: (attemptId: number) => `/api/v1/violations/attempt/${attemptId}/latest`,
PROCTORING_ANALYTICS: (attemptId: number) => `/api/v1/violations/analytics/${attemptId}`,
PROCTORING_ATTEMPT_SUMMARY: (attemptId: number) => `/api/v1/dashboard/attempts/${attemptId}/summary`,
PROCTORING_ATTEMPT_SUMMARIES: '/api/v1/dashboard/attempts/summaries',
PROCTORING_STATS_HOURLY: '/api/v1/dashboard/stats/hourly',
PROCTORING_STATS_DAILY: '/api/v1/dashboard/stats/daily',
PROCTORING_USER_PATTERNS: (userId: string) => `/api/v1/dashboard/users/${userId}/patterns`,
PROCTORING_OVERVIEW: '/api/v1/dashboard/overview',
PROCTORING_REALTIME: '/api/v1/dashboard/realtime',
```

### Service Integration

Create `src/services/proctoringDashboardService.ts`:

```typescript
import axios from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';
import type {
  ViolationListResponse,
  AttemptViolationSummary,
  DashboardOverview,
  RealTimeStats,
  HourlyViolationStats,
  DailyViolationStats,
  UserViolationPattern,
} from '../types/proctoring';

class ProctoringDashboardService {
  private instance = axios.create({
    baseURL: API_CONFIG.PROCTORING_BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
  });

  constructor() {
    this.instance.interceptors.request.use(async (config) => {
      const token = await TokenService.getValidAccessToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  async getViolationsByAttempt(attemptId: number, page = 1, pageSize = 10): Promise<ViolationListResponse> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_VIOLATIONS_BY_ATTEMPT(attemptId),
      { params: { page, pageSize } }
    );
    return data;
  }

  async getAttemptSummary(attemptId: number): Promise<AttemptViolationSummary> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_ATTEMPT_SUMMARY(attemptId)
    );
    return data;
  }

  async getAttemptSummaries(attemptIds: number[]): Promise<{ data: AttemptViolationSummary[]; count: number }> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_ATTEMPT_SUMMARIES,
      { params: { attempt_ids: attemptIds.join(',') } }
    );
    return data;
  }

  async getDashboardOverview(startTime?: string, endTime?: string): Promise<{ data: DashboardOverview }> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_OVERVIEW,
      { params: { start_time: startTime, end_time: endTime } }
    );
    return data;
  }

  async getRealTimeStats(): Promise<RealTimeStats> {
    const { data } = await this.instance.get(API_ENDPOINTS.PROCTORING_REALTIME);
    return data;
  }

  async getHourlyStats(startTime?: string, endTime?: string): Promise<{ data: HourlyViolationStats[] }> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_STATS_HOURLY,
      { params: { start_time: startTime, end_time: endTime } }
    );
    return data;
  }

  async getDailyStats(startTime?: string, endTime?: string): Promise<{ data: DailyViolationStats[] }> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_STATS_DAILY,
      { params: { start_time: startTime, end_time: endTime } }
    );
    return data;
  }

  async getUserPatterns(userId: string, startTime?: string, endTime?: string): Promise<{ data: UserViolationPattern[] }> {
    const { data } = await this.instance.get(
      API_ENDPOINTS.PROCTORING_USER_PATTERNS(userId),
      { params: { start_time: startTime, end_time: endTime } }
    );
    return data;
  }
}

export const proctoringDashboardService = new ProctoringDashboardService();
```

### Data Joining Strategy

Since protocring-service only stores violation data without user/assessment details:

1. **Attempt Summary → Assessment Service**: Get attempt details (student name, assessment title) from assessment-service
2. **Batch Summaries**: Call `GET /dashboard/attempts/summaries` with attempt_ids from grading list
3. **Group View**: Get attempt_ids from assessment-service group endpoint, then fetch summaries from protocring-service

### Screenshot Storage

The `snapshot_url` field currently supports any URL. Options:

- Cloud storage (S3/GCS) - recommended for production
- Base64 data URI - works but not scalable
- Local server storage - for development

---

## Backend Team Notes

### Current State

- ✅ protocring-service has all core APIs ready
- ✅ TimescaleDB with continuous aggregates for performance
- ✅ Violation ingestion working (tested with violationService.ts)

### Gaps to Address

1. **Review Status**: No review/audit trail in current model. Consider adding:

   ```sql
   ALTER TABLE violation_logs ADD COLUMN review_status VARCHAR(20) DEFAULT 'pending';
   ALTER TABLE violation_logs ADD COLUMN reviewed_by VARCHAR(255);
   ALTER TABLE violation_logs ADD COLUMN reviewed_at TIMESTAMPTZ;
   ALTER TABLE violation_logs ADD COLUMN review_notes TEXT;
   ```

2. **Group-Level Aggregation**: Need to support filtering by assessment_id or providing group-scoped summaries

3. **User Info**: Frontend needs user name/email for display. Options:
   - Join with assessment-service user data on frontend
   - Add user info to violation logs (denormalization)
   - Create a user lookup endpoint

4. **WebSocket for Real-Time**: Consider adding WebSocket support for live monitoring during exams
