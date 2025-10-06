import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, message } from 'antd';
import { CasdoorSdk } from '../../config/casdoor';
import axios from 'axios';

const Callback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code and state from URL params
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');

        if (!code || !state) {
          setError('Missing authorization code or state');
          message.error('Authentication failed: Missing parameters');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Exchange code for token via Casdoor server
        const response = CasdoorSdk.signin("/login")
        console.log(response)
        if (response.data && response.data.access_token) {
          // Store token
          localStorage.setItem('casdoor_token', response.data.access_token);


          message.success('Login successful!');

          // Redirect to dashboard
          navigate('/dashboard');
        } else {
          throw new Error('No access token received');
        }
      } catch (error: any) {
        console.error('Callback error:', error);
        setError(error.message || 'Authentication failed');
        message.error('Authentication failed. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      gap: '16px'
    }}>
      <Spin size="large" tip={error ? 'Redirecting...' : 'Authenticating...'} />
      {error && <div style={{ color: '#ff4d4f' }}>{error}</div>}
    </div>
  );
};

export default Callback;
