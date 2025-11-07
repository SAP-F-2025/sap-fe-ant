# MediaPipe Installation Guide

## Dependencies

### NPM Packages

```bash
npm install @mediapipe/tasks-vision
```

### Package.json Additions

```json
{
  "dependencies": {
    "@mediapipe/tasks-vision": "^0.10.20"
  }
}
```

**Note**: Migrated from deprecated packages (@mediapipe/face_detection, @mediapipe/camera_utils) to the new @mediapipe/tasks-vision package.

## Browser Requirements

### Supported Browsers

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

### Required Permissions

- Camera access (`navigator.mediaDevices.getUserMedia`)
- Microphone access (optional, for audio proctoring)

## Environment Setup

### Development

```bash
# Install dependencies
npm install

# Start development server with HTTPS (required for camera access)
npm run dev -- --https

# Or configure vite.config.ts for HTTPS
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true, // Required for camera access in development
  },
  optimizeDeps: {
    exclude: ['@mediapipe/camera_utils', '@mediapipe/face_detection']
  }
});
```

## CDN Assets

MediaPipe models are loaded from CDN:

```
https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm
https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
```

## Security Considerations

### HTTPS Requirement

- Camera access requires HTTPS in production
- Use SSL certificates for deployment
- Configure reverse proxy (nginx) for HTTPS

### Content Security Policy

```
script-src 'self' https://cdn.jsdelivr.net;
connect-src 'self' https://cdn.jsdelivr.net;
media-src 'self' blob:;
```

## Troubleshooting

### Common Issues

1. **Camera not working**: Check HTTPS and permissions
2. **Models not loading**: Verify CDN access and CSP
3. **Performance issues**: Consider model optimization
4. **Memory leaks**: Ensure proper cleanup in useEffect
