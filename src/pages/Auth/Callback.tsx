import { Spin } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CasdoorConfig, CasdoorSdk } from '../../config/casdoor';
import { useAuth } from '../../hooks/useAuth';
import { TokenService } from '../../services/tokenService';
import { handleError, showSuccess } from '../../utils/errorHandler';
import { decodeJWT, extractUserInfo } from '../../utils/jwt';
import { clearPKCEVerifier, retrievePKCEVerifier } from '../../utils/pkce';

const Callback: React.FC = () => {
	const navigate = useNavigate();
	const { setUser } = useAuth();
	const { t } = useTranslation();
	const [error, setError] = useState<string | null>(null);
	const hasRun = useRef(false);

	useEffect(() => {
		// Prevent double execution in React StrictMode (development)
		if (hasRun.current) return;
		hasRun.current = true;

		const handleCallback = async () => {
			try {
				// Get the code and state from URL params
				const params = new URLSearchParams(window.location.search);
				const code = params.get('code');
				const state = params.get('state');

				if (!code || !state) {
					setError('Missing authorization code or state');
					handleError(new Error('Missing parameters'), t('auth.missingParams'));
					setTimeout(() => navigate('/login'), 2000);
					return;
				}

				// Retrieve PKCE code verifier
				const codeVerifier = retrievePKCEVerifier();
				if (!codeVerifier) {
					setError('Missing PKCE code verifier');
					handleError(new Error('Invalid session'), t('auth.invalidSession'));
					setTimeout(() => navigate('/login'), 2000);
					return;
				}

				// Exchange code for token with PKCE code_verifier
				const tokenUrl = `${CasdoorConfig.serverUrl}/api/login/oauth/access_token`;
				const tokenParams = new URLSearchParams({
					grant_type: 'authorization_code',
					client_id: CasdoorConfig.clientId,
					code: code,
					state: state,
					redirect_uri: `${window.location.origin}${CasdoorConfig.redirectPath}`,
					code_verifier: codeVerifier,
				});

				const response = await fetch(tokenUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: tokenParams.toString(),
				});

				if (!response.ok) {
					throw new Error(
						`Token exchange failed: ${response.status} ${response.statusText}`
					);
				}

				const data = await response.json();
				console.log('Token response:', data);

				if (data && data.access_token) {
					// Store tokens using TokenService
					TokenService.setTokens(data);

					// Decode JWT to get full user info
					const decodedToken = decodeJWT(data.access_token);

					if (decodedToken) {
						// Extract only essential user info
						const userInfo = extractUserInfo(decodedToken);
						setUser(userInfo);
					} else {
						// Fallback to SDK getUserInfo if decode fails
						const userInfo = await CasdoorSdk.getUserInfo(data.access_token);
						setUser(userInfo);
					}

					// Clear PKCE verifier after successful exchange
					clearPKCEVerifier();

					showSuccess(t('auth.loginSuccess'));

					// Navigate to dashboard (no reload needed, user is already set)
					navigate('/dashboard');
				} else {
					throw new Error('No access token received');
				}
			} catch (error: any) {
				console.error('Callback error:', error);
				setError(error.message || 'Authentication failed');
				handleError(error, t('auth.authFailedRedirecting'));
				clearPKCEVerifier();
				setTimeout(() => navigate('/login'), 2000);
			}
		};

		handleCallback();
	}, [navigate, setUser]);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				gap: '16px',
			}}
		>
			<Spin size="large" tip={error ? 'Redirecting...' : 'Authenticating...'} />
			{error && <div style={{ color: '#ff4d4f' }}>{error}</div>}
		</div>
	);
};

export default Callback;
