import { FrownOutlined, HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Result, Space, Typography } from 'antd';
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';

const { Paragraph, Text } = Typography;

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
	const { t } = useTranslation();

	const handleGoHome = () => {
		window.location.href = '/';
	};

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
				title={t('errorBoundary.title', 'Something went wrong')}
				subTitle={t('errorBoundary.subtitle', 'We apologize for the inconvenience.')}
				extra={
					<Space size="middle">
						<Button type="primary" icon={<ReloadOutlined />} onClick={resetErrorBoundary}>
							{t('errorBoundary.retry', 'Try Again')}
						</Button>
						<Button icon={<HomeOutlined />} onClick={handleGoHome}>
							{t('errorBoundary.backToHome', 'Back to Home')}
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
								{error.stack}
							</Text>
						</Paragraph>
					</div>
				)}
			</Result>
		</div>
	);
};

interface ErrorBoundaryProps {
	children: React.ReactNode;
	onReset?: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, onReset }) => {
	return (
		<ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
			{children}
		</ReactErrorBoundary>
	);
};

export default ErrorBoundary;
