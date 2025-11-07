# Deployment Guide for MediaPipe Integration

## Production Requirements

### Infrastructure Prerequisites

#### HTTPS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Required for MediaPipe CDN access
    add_header Content-Security-Policy "
        default-src 'self';
        script-src 'self' https://cdn.jsdelivr.net;
        connect-src 'self' https://cdn.jsdelivr.net wss:;
        media-src 'self' blob:;
        worker-src 'self' blob:;
    ";
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### CDN Configuration

```javascript
// vite.config.ts - Production build
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        '@mediapipe/face_detection',
        '@mediapipe/camera_utils'
      ]
    }
  },
  define: {
    'process.env.MEDIAPIPE_CDN': JSON.stringify('https://cdn.jsdelivr.net/npm')
  }
});
```

## Environment Configuration

### Production Environment Variables

```bash
# .env.production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_MEDIAPIPE_CDN=https://cdn.jsdelivr.net/npm
VITE_PROCTORING_ENABLED=true
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ANALYTICS_ID=your-analytics-id
```

### Feature Flags

```typescript
// src/config/features.ts
export const FEATURES = {
  PROCTORING: process.env.VITE_PROCTORING_ENABLED === 'true',
  FACE_DETECTION: true,
  ATTENTION_MONITORING: true,
  VIOLATION_ALERTS: true,
  AUTO_TERMINATION: true,
} as const;
```

## Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add SSL certificates (if using custom certs)
COPY certs/ /etc/nginx/certs/

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./certs:/etc/nginx/certs:ro
    restart: unless-stopped
    
  backend:
    image: your-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

## Kubernetes Deployment

### Deployment Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sap-frontend
  labels:
    app: sap-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sap-frontend
  template:
    metadata:
      labels:
        app: sap-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/sap-frontend:latest
        ports:
        - containerPort: 80
        - containerPort: 443
        env:
        - name: VITE_API_BASE_URL
          value: "https://api.your-domain.com"
        - name: VITE_PROCTORING_ENABLED
          value: "true"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
```

### Service and Ingress

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: sap-frontend-service
spec:
  selector:
    app: sap-frontend
  ports:
  - name: http
    port: 80
    targetPort: 80
  - name: https
    port: 443
    targetPort: 443
  type: ClusterIP

---
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sap-frontend-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - your-domain.com
    secretName: sap-frontend-tls
  rules:
  - host: your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sap-frontend-service
            port:
              number: 80
```

## Monitoring and Observability

### Error Tracking with Sentry

```typescript
// src/config/sentry.ts
import * as Sentry from '@sentry/react';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // Filter out MediaPipe-related noise
      if (event.exception?.values?.[0]?.value?.includes('MediaPipe')) {
        return null;
      }
      return event;
    }
  });
}

// Proctoring-specific error tracking
export const trackProctoringError = (error: Error, context: any) => {
  Sentry.withScope((scope) => {
    scope.setTag('component', 'proctoring');
    scope.setContext('proctoring', context);
    Sentry.captureException(error);
  });
};
```

### Performance Monitoring

```typescript
// src/utils/performance.ts
export const trackProctoringPerformance = () => {
  // Track MediaPipe initialization time
  const initStart = performance.now();
  
  return {
    markInitComplete: () => {
      const initTime = performance.now() - initStart;
      
      // Send to analytics
      if (window.gtag) {
        window.gtag('event', 'proctoring_init', {
          event_category: 'performance',
          value: Math.round(initTime)
        });
      }
    },
    
    trackViolationDetection: (type: string, confidence: number) => {
      if (window.gtag) {
        window.gtag('event', 'violation_detected', {
          event_category: 'proctoring',
          event_label: type,
          value: Math.round(confidence * 100)
        });
      }
    }
  };
};
```

### Health Checks

```typescript
// public/health.json
{
  "status": "healthy",
  "version": "1.0.0",
  "features": {
    "proctoring": true,
    "mediapipe": true
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Security Considerations

### Content Security Policy

```typescript
// src/config/csp.ts
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for MediaPipe
    'https://cdn.jsdelivr.net'
  ],
  'connect-src': [
    "'self'",
    'https://cdn.jsdelivr.net',
    'wss:', // WebSocket connections
    'https://api.your-domain.com'
  ],
  'media-src': [
    "'self'",
    'blob:', // Required for camera stream
    'mediastream:' // Required for getUserMedia
  ],
  'worker-src': [
    "'self'",
    'blob:' // Required for MediaPipe workers
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:'
  ]
};
```

### Privacy Compliance

```typescript
// src/utils/privacy.ts
export const PrivacyManager = {
  // Ensure no video data is stored
  validateNoRecording: () => {
    const mediaRecorders = document.querySelectorAll('video[recording]');
    if (mediaRecorders.length > 0) {
      throw new Error('Video recording detected - privacy violation');
    }
  },
  
  // Clear any cached video data
  clearVideoCache: () => {
    // Clear blob URLs
    URL.revokeObjectURL.bind(URL);
    
    // Clear MediaStream tracks
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
      });
  },
  
  // GDPR compliance check
  checkGDPRCompliance: () => {
    return {
      dataProcessing: 'client-side-only',
      dataStorage: 'events-only',
      dataRetention: '30-days',
      userConsent: 'required'
    };
  }
};
```

## Performance Optimization

### CDN Configuration

```typescript
// src/config/cdn.ts
export const CDN_CONFIG = {
  mediapipe: {
    baseUrl: 'https://cdn.jsdelivr.net/npm',
    models: {
      faceDetection: '@mediapipe/face_detection@0.4.1675466862',
      faceMesh: '@mediapipe/face_mesh@0.4.1675466862'
    },
    preload: true, // Preload models on app start
    cache: true    // Enable browser caching
  }
};

// Preload critical models
export const preloadModels = async () => {
  const models = [
    `${CDN_CONFIG.mediapipe.baseUrl}/${CDN_CONFIG.mediapipe.models.faceDetection}/face_detection.binarypb`,
    `${CDN_CONFIG.mediapipe.baseUrl}/${CDN_CONFIG.mediapipe.models.faceDetection}/face_detection_short_range.tflite`
  ];
  
  await Promise.all(
    models.map(url => 
      fetch(url, { mode: 'cors' }).then(response => response.blob())
    )
  );
};
```

### Resource Management

```typescript
// src/utils/resource-manager.ts
export class ResourceManager {
  private static instance: ResourceManager;
  private activeStreams: MediaStream[] = [];
  private mediaPipeInstances: any[] = [];
  
  static getInstance() {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }
  
  addStream(stream: MediaStream) {
    this.activeStreams.push(stream);
  }
  
  addMediaPipeInstance(instance: any) {
    this.mediaPipeInstances.push(instance);
  }
  
  cleanup() {
    // Stop all active streams
    this.activeStreams.forEach(stream => {
      stream.getTracks().forEach(track => track.stop());
    });
    this.activeStreams = [];
    
    // Close MediaPipe instances
    this.mediaPipeInstances.forEach(instance => {
      if (instance.close) instance.close();
    });
    this.mediaPipeInstances = [];
  }
}
```

## Rollback Strategy

### Feature Flags for Rollback

```typescript
// src/config/rollback.ts
export const ROLLBACK_CONFIG = {
  proctoring: {
    enabled: process.env.VITE_PROCTORING_ENABLED === 'true',
    fallbackMode: 'disabled', // 'disabled' | 'basic' | 'full'
    gracefulDegradation: true
  }
};

export const handleProctoringFailure = (error: Error) => {
  console.error('Proctoring failed:', error);
  
  // Track error
  trackProctoringError(error, { rollback: true });
  
  // Graceful degradation
  if (ROLLBACK_CONFIG.proctoring.gracefulDegradation) {
    return {
      mode: 'assessment-only',
      message: 'Proctoring temporarily unavailable. Assessment can continue without monitoring.'
    };
  }
  
  throw error;
};
```

### Deployment Checklist

#### Pre-deployment

- [ ] SSL certificates configured
- [ ] CDN access verified
- [ ] Environment variables set
- [ ] Feature flags configured
- [ ] Monitoring setup complete

#### Deployment

- [ ] Build and test in staging
- [ ] Database migrations (if any)
- [ ] Deploy with zero downtime
- [ ] Verify health checks
- [ ] Test proctoring functionality

#### Post-deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify user experience
- [ ] Monitor resource usage
- [ ] Validate privacy compliance

#### Rollback Triggers

- Error rate > 5%
- Performance degradation > 50%
- Privacy compliance issues
- Critical security vulnerabilities
- User experience severely impacted
