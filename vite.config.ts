import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		open: false,
		allowedHosts: ['sap.m3xd.dev', 'sapx.me', 'sap.sapx.me'],
		hmr: false,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
							return 'react-vendor';
						}
						if (id.includes('antd') || id.includes('@ant-design/icons')) {
							return 'antd-vendor';
						}
						if (id.includes('@mediapipe')) {
							return 'mediapipe-vendor';
						}
						if (id.includes('three')) {
							return 'three-vendor';
						}
					}
				},
			},
		},
	},
	optimizeDeps: {
		exclude: ['@mediapipe/camera_utils', '@mediapipe/face_detection', '@mediapipe/tasks-vision'],
	},
	worker: {
		format: 'es',
	},
});
