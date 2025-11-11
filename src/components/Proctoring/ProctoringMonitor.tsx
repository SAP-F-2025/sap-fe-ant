import React, { useRef, useEffect, useState } from 'react';
import { Alert, Badge, Card, Tag, Button } from 'antd';
import { EyeOutlined, DragOutlined, MinusOutlined, PlusOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { useMediaPipeFaceDetection, ProctoringEvent } from '../../hooks/useProctoring';
import { useBrowserProctoring } from '../../hooks/useBrowserProctoring';

interface ProctoringMonitorProps {
	onViolation?: (event: ProctoringEvent) => void;
	onFaceCountChange?: (count: number) => void;
	showLandmarks?: boolean;
	compact?: boolean;
	violationCount?: number;
	requireFullscreen?: boolean;
	preventTabSwitching?: boolean;
	preventCopyPaste?: boolean;
	detectTampering?: boolean;
}

export const ProctoringMonitor: React.FC<ProctoringMonitorProps> = ({
	onViolation,
	onFaceCountChange,
	showLandmarks = false,
	compact = false,
	violationCount = 0,
	requireFullscreen = false,
	preventTabSwitching = true,
	preventCopyPaste = true,
	detectTampering = false
}) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState(() => {
		const saved = localStorage.getItem('proctoring-position');
		return saved ? JSON.parse(saved) : { x: 20, y: 20 };
	});
	const [isDragging, setIsDragging] = useState(false);
	const [isResizing, setIsResizing] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });
	const [scale, setScale] = useState(() => {
		const saved = localStorage.getItem('proctoring-scale');
		return saved ? parseFloat(saved) : 1;
	});
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [error, setError] = useState<string | null>(null);
	const [videoReady, setVideoReady] = useState(false);
	const [activeViolations, setActiveViolations] = useState<Map<string, ProctoringEvent>>(new Map());
	const streamRef = useRef<MediaStream | null>(null);
	const violationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const isMobile = windowWidth < 768;
	const isTablet = windowWidth >= 768 && windowWidth < 1200;
	const isDesktop = windowWidth >= 1200;
	
	const [isExpanded, setIsExpanded] = useState(!isMobile);
	const startXRef = useRef(0);
	const startScaleRef = useRef(scale);

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (isMobile && isExpanded) setIsExpanded(false);
	}, [isMobile]);

	const handleViolation = (event: ProctoringEvent) => {
		const key = event.type;

		if (event.duration === 0) {
			setActiveViolations(prev => new Map(prev).set(key, event));
			onViolation?.(event);
		} else {
			setActiveViolations(prev => new Map(prev).set(key, event));

			const existingTimeout = violationTimeoutsRef.current.get(key);
			if (existingTimeout) clearTimeout(existingTimeout);

			const timeout = setTimeout(() => {
				setActiveViolations(prev => {
					const next = new Map(prev);
					next.delete(key);
					return next;
				});
					violationTimeoutsRef.current.delete(key);
			}, 3000);

			violationTimeoutsRef.current.set(key, timeout);
		}
	};

	const { isProcessing, faceCount } = useMediaPipeFaceDetection(
		videoRef.current,
		canvasRef.current,
		videoReady,
		showLandmarks,
		handleViolation
	);

	useEffect(() => {
		if (faceCount !== undefined) {
			onFaceCountChange?.(faceCount);
		}
	}, [faceCount, onFaceCountChange]);

	useBrowserProctoring({
		enabled: true,
		requireFullscreen,
		preventTabSwitching,
		preventCopyPaste,
		detectTampering,
		onViolation: handleViolation
	});

	useEffect(() => {
		let mounted = true;

		const startCamera = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: { width: 640, height: 480 }
				});

				if (mounted) {
					streamRef.current = stream;
					setError(null);
				}
			} catch (err: any) {
				if (mounted) {
					setError(err.message || 'Failed to access camera');
				}
			}
		};

		startCamera();

		return () => {
			mounted = false;
			if (streamRef.current) {
				streamRef.current.getTracks().forEach(track => track.stop());
				streamRef.current = null;
			}
			violationTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
			violationTimeoutsRef.current.clear();
		};
	}, []);

	useEffect(() => {
		if (videoRef.current && streamRef.current && !videoRef.current.srcObject) {
			videoRef.current.srcObject = streamRef.current;
			videoRef.current.onloadedmetadata = () => {
				setVideoReady(true);
			};
			videoRef.current.play().catch(err => console.error('Video play failed:', err));
		}
	}, [streamRef.current, isExpanded, isMobile]);

	const getSize = () => {
		const baseWidth = isMobile ? 240 : isTablet ? 320 : compact ? 320 : 640;
		const baseHeight = isMobile ? 180 : isTablet ? 240 : compact ? 240 : 480;
		return { 
			width: Math.round(baseWidth * scale), 
			height: Math.round(baseHeight * scale) 
		};
	};
	const size = getSize();

	const handleMouseDown = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		if (target.classList.contains('resize-handle')) {
			setIsResizing(true);
			e.stopPropagation();
		} else if (target.closest('.ant-card-head')) {
			setIsDragging(true);
			dragOffset.current = {
				x: e.clientX - position.x,
				y: e.clientY - position.y
			};
		}
	};

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (isDragging && cardRef.current) {
				const cardRect = cardRef.current.getBoundingClientRect();
				let newX = e.clientX - dragOffset.current.x;
				let newY = e.clientY - dragOffset.current.y;

				newX = Math.max(0, Math.min(newX, window.innerWidth - cardRect.width));
				newY = Math.max(0, Math.min(newY, window.innerHeight - cardRect.height));

				setPosition({ x: newX, y: newY });
			} else if (isResizing) {
				if (startXRef.current === 0) {
					startXRef.current = e.clientX;
					startScaleRef.current = scale;
				}
				const deltaX = e.clientX - startXRef.current;
				const baseWidth = isMobile ? 240 : isTablet ? 320 : compact ? 320 : 640;
				const newScale = Math.max(0.5, Math.min(2, startScaleRef.current + deltaX / baseWidth));
				setScale(newScale);
			}
		};

		const handleMouseUp = () => {
			if (isDragging) {
				setIsDragging(false);
				localStorage.setItem('proctoring-position', JSON.stringify(position));
			}
			if (isResizing) {
				setIsResizing(false);
				startXRef.current = 0;
				localStorage.setItem('proctoring-scale', scale.toString());
			}
		};

		if (isDragging || isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, isResizing, position, scale, isMobile, isTablet, compact]);

	// Adjust position on window resize
	useEffect(() => {
		const handleResize = () => {
			if (!cardRef.current) return;

			const cardRect = cardRef.current.getBoundingClientRect();
			let newX = position.x;
			let newY = position.y;

			// Adjust if card is outside viewport
			if (newX + cardRect.width > window.innerWidth) {
				newX = window.innerWidth - cardRect.width;
			}
			if (newY + cardRect.height > window.innerHeight) {
				newY = window.innerHeight - cardRect.height;
			}
			if (newX < 0) newX = 0;
			if (newY < 0) newY = 0;

			if (newX !== position.x || newY !== position.y) {
				setPosition({ x: newX, y: newY });
				localStorage.setItem('proctoring-position', JSON.stringify({ x: newX, y: newY }));
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize(); // Check on mount

		return () => window.removeEventListener('resize', handleResize);
	}, [position]);

	return (
		<>
			{!isExpanded && isMobile && (
				<div
					style={{
						position: 'fixed',
						bottom: 20,
						right: 20,
						zIndex: 1000
					}}
				>
					<Badge count={violationCount} offset={[-5, 5]}>
						<Button
							type="primary"
							shape="circle"
							size="large"
							icon={<VideoCameraOutlined />}
							onClick={() => setIsExpanded(true)}
							style={{ width: 56, height: 56 }}
						/>
					</Badge>
				</div>
			)}
			<div
				ref={cardRef}
				style={{
					position: 'fixed',
					left: isMobile ? 10 : position.x,
					top: isMobile ? 10 : position.y,
					zIndex: 1000,
					cursor: isDragging ? 'grabbing' : isResizing ? 'ew-resize' : 'default',
					maxWidth: isMobile ? 'calc(100vw - 20px)' : 'none',
					display: (!isExpanded && isMobile) ? 'none' : 'block'
				}}
				onMouseDown={handleMouseDown}
			>
			{isExpanded && !isMobile && (
				<div
					className="resize-handle"
					style={{
						position: 'absolute',
						right: -4,
						top: 0,
						width: 8,
						height: '100%',
						cursor: 'ew-resize',
						zIndex: 10
					}}
				/>
			)}
			<Card
				title={
					<span style={{ cursor: isMobile ? 'default' : 'grab', userSelect: 'none', fontSize: Math.round((isMobile ? 12 : 14) * scale) }}>
						{!isMobile && <DragOutlined />} {isMobile ? '📹' : 'Camera giám sát'}
					</span>
				}
				size="small"
				extra={
					<div style={{ display: 'flex', gap: 8 * scale, alignItems: 'center' }}>
						{violationCount > 0 && (
							<Tag color="error" style={{ margin: 0, fontSize: Math.round((isMobile ? 10 : 12) * scale) }}>
								{isMobile ? violationCount : `Vi phạm: ${violationCount}`}
							</Tag>
						)}
						<Button
							type="text"
							size="small"
							icon={isExpanded ? <MinusOutlined /> : <PlusOutlined />}
							onClick={() => setIsExpanded(!isExpanded)}
							style={{ fontSize: Math.round(14 * scale) }}
						/>
					</div>
				}
			>
				{error && isExpanded && (
					<Alert type="error" message={error} showIcon style={{ marginBottom: 16 * scale, fontSize: Math.round(14 * scale) }} />
				)}

				<div style={{ position: 'relative', width: size.width, height: size.height, display: isExpanded ? 'block' : 'none' }}>
					<video
						ref={videoRef}
						autoPlay
						playsInline
						muted
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: '#000',
							borderRadius: 8,
							transform: 'scaleX(-1)'
						}}
					/>
					<canvas
						ref={canvasRef}
						width={size.width}
						height={size.height}
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							transform: 'scaleX(-1)'
						}}
					/>

								{isProcessing && (
									<div style={{
										position: 'absolute',
										top: 8 * scale,
										right: 8 * scale,
										background: 'rgba(82, 196, 26, 0.8)',
										padding: `${4 * scale}px ${8 * scale}px`,
										borderRadius: 4 * scale,
										color: 'white',
										fontSize: Math.round(12 * scale)
									}}>
										Monitoring
									</div>
								)}
					</div>

				{Array.from(activeViolations.values()).map((violation, index) => {
							const getMessage = (type: string, metadata?: any) => {
								switch (type) {
									case 'face_not_detected': return 'Không phát hiện khuôn mặt';
									case 'multiple_faces': return 'Phát hiện nhiều khuôn mặt';
									case 'mouth_open': return 'Phát hiện mở miệng';
									case 'head_turned': return 'Đầu quay đi';
									case 'eyes_closed': return 'Nhắm mắt';
									case 'looking_away': return 'Đang nhìn ra ngoài màn hình';
									case 'tab_switch': return metadata?.hidden ? 'Chuyển tab/cửa sổ' : 'Quay lại tab';
									case 'fullscreen_exit': return 'Thoát chế độ toàn màn hình';
									case 'copy_paste': return `Phát hiện ${metadata?.action === 'copy' ? 'sao chép' : metadata?.action === 'paste' ? 'dán' : 'cắt'}`;
									case 'browser_tamper': return 'Phát hiện DevTools';
									default: return 'Vi phạm';
								}
							};

							return (
								<Alert
									key={violation.type}
									type={violation.duration === 0 ? 'error' : 'warning'}
									message={getMessage(violation.type, violation.metadata)}
									showIcon
									style={{ marginTop: (index === 0 ? 12 : 8) * scale, fontSize: Math.round((isMobile ? 11 : 14) * scale) }}
								/>
						);
					})}
			</Card>
			</div>
		</>
	);
};
