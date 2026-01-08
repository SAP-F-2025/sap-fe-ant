import { FrownOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result, Space, Typography } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';

const { Paragraph, Text } = Typography;

// Fallback texts when translation is not available
const fallbackTexts = {
	title: 'Something went wrong',
	subtitle: 'An unexpected error occurred. Please try again.',
	retry: 'Try Again',
	backToHome: 'Back to Home',
};

interface Props extends Partial<WithTranslation> {
	children: ReactNode;
	fallback?: ReactNode;
	onReset?: () => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays a fallback UI
 * Includes error details in development mode
 */
class ErrorBoundaryClass extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error: Error): Pick<State, 'hasError' | 'error'> {
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log error to console in development
		if (import.meta.env.DEV) {
			console.error('Error caught by ErrorBoundary:', error, errorInfo);
		}

		// In production, you would send this to an error tracking service
		// Example: Sentry.captureException(error, { extra: errorInfo });

		this.setState({
			errorInfo,
		});
	}

	// Safe translation function that falls back to default texts
	translate = (key: string): string => {
		const { t } = this.props;
		if (typeof t === 'function') {
			return t(key);
		}
		// Fallback when t is not available
		const shortKey = key.split('.').pop() as keyof typeof fallbackTexts;
		return fallbackTexts[shortKey] || key;
	};

	handleReset = (): void => {
		const { onReset } = this.props;

		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});

		onReset?.();
	};

	handleGoHome = (): void => {
		window.location.href = '/';
	};

	render(): ReactNode {
		const { hasError, error, errorInfo } = this.state;
		const { children, fallback } = this.props;

		if (hasError) {
			// Use custom fallback if provided
			if (fallback) {
				return fallback;
			}

			// Default error UI
			return (
				<div
					style={{
						minHeight: '100vh',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						padding: '24px',
					}}
				>
					<Result
						status="error"
						icon={<FrownOutlined />}
						title={this.translate('errorBoundary.title')}
						subTitle={this.translate('errorBoundary.subtitle')}
						extra={
							<Space size="middle">
								<Button
									type="primary"
									icon={<ReloadOutlined />}
									onClick={this.handleReset}
								>
									{this.translate('errorBoundary.retry')}
								</Button>
								<Button icon={<HomeOutlined />} onClick={this.handleGoHome}>
									{this.translate('errorBoundary.backToHome')}
								</Button>
							</Space>
						}
					>
						{/* Show error details in development */}
						{import.meta.env.DEV && error && (
							<div style={{ textAlign: 'left', marginTop: '24px' }}>
								<Paragraph>
									<Text strong>Error:</Text>
								</Paragraph>
								<Paragraph>
									<Text code>{error.toString()}</Text>
								</Paragraph>
								{errorInfo && (
									<>
										<Paragraph>
											<Text strong>Stack Trace:</Text>
										</Paragraph>
										<Paragraph>
											<Text
												code
												style={{
													whiteSpace: 'pre-wrap',
												}}
											>
												{errorInfo.componentStack}
											</Text>
										</Paragraph>
									</>
								)}
							</div>
						)}
					</Result>
				</div>
			);
		}

		return children;
	}
}

// Export the class directly for use without HOC (handles missing t function)
export const ErrorBoundary = ErrorBoundaryClass;

// Export with translation HOC for components that need translated error messages
export default withTranslation()(ErrorBoundaryClass);
