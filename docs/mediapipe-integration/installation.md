# MediaPipe Installation Guide

## Dependencies

### NPM Packages

```bash
npm install @mediapipe/camera_utils @mediapipe/control_utils @mediapipe/drawing_utils @mediapipe/face_detection @mediapipe/face_mesh @mediapipe/hands @mediapipe/pose
```

### Package.json Additions

```json
{
  "dependencies": {
    "@mediapipe/camera_utils": "^0.3.1675466862",
    "@mediapipe/control_utils": "^0.6.1675466862", 
    "@mediapipe/drawing_utils": "^0.3.1675466862",
    "@mediapipe/face_detection": "^0.4.1675466862",
    "@mediapipe/face_mesh": "^0.4.1675466862",
    "@mediapipe/hands": "^0.4.1675466862",
    "@mediapipe/pose": "^0.5.1675466862"
  }
}
```

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
https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/
https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/
https://cdn.jsdelivr.net/npm/@mediapipe/hands/
https://cdn.jsdelivr.net/npm/@mediapipe/pose/
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
