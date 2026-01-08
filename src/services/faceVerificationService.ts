import axios, { AxiosInstance } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import { TokenService } from './tokenService';

export interface VerifyResponse {
	verified: boolean;
	similarity: number;
	liveness_score: number;
	det_score: number;
	threshold_used: number;
	reason: string | null;
	timestamp: string;
}

export interface RegistrationStatusResponse {
	registered: boolean;
	user_id: string;
}

class FaceVerificationService {
	private instance: AxiosInstance;

	constructor() {
		this.instance = axios.create({
			baseURL: API_CONFIG.VERIFICATION_BASE_URL,
			timeout: API_CONFIG.TIMEOUT,
		});

		this.instance.interceptors.request.use(async (config) => {
			const token = await TokenService.getValidAccessToken();
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		});
	}

	async checkRegistrationStatus(): Promise<RegistrationStatusResponse> {
		const response = await this.instance.get<RegistrationStatusResponse>(
			API_ENDPOINTS.FACE_REGISTRATION_STATUS
		);
		return response.data;
	}

	async registerFace(imageBlob: Blob): Promise<void> {
		const formData = new FormData();
		formData.append('image', imageBlob, 'face.jpg');

		await this.instance.post(API_ENDPOINTS.FACE_REGISTER, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	}

	async verifyFace(imageBlob: Blob): Promise<VerifyResponse> {
		const formData = new FormData();
		formData.append('image', imageBlob, 'face.jpg');

		try {
			const response = await this.instance.post<VerifyResponse>(
				API_ENDPOINTS.FACE_VERIFY,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			return response.data;
		} catch (error: any) {
			if (error.response?.data?.detail) {
				throw new Error(error.response.data.detail);
			}
			if (error.response?.data?.message) {
				throw new Error(error.response.data.message);
			}
			throw error;
		}
	}

	async deleteFace(): Promise<void> {
		await this.instance.delete(API_ENDPOINTS.FACE_DELETE);
	}
}

export const faceVerificationService = new FaceVerificationService();

export default faceVerificationService;
