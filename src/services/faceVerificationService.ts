import api from './api';

export interface VerifyResponse {
  match: boolean;
  confidence: number;
  message?: string;
}

export interface RegistrationStatusResponse {
  registered: boolean;
  user_id: string;
}

const faceVerificationService = {
  // Check if user has registered their face
  checkRegistrationStatus: async (): Promise<RegistrationStatusResponse> => {
    const response = await api.get('/api/v1/face/registration-status');
    return response.data;
  },

  // Verify face against registered face (1:1)
  verifyFace: async (imageBlob: Blob): Promise<VerifyResponse> => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'face.jpg');
    
    const response = await api.post('/api/v1/face/verify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default faceVerificationService;
