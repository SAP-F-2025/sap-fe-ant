import { API_ENDPOINTS } from '../config/api';
import apiService from './api';

// Import result types
export interface ImportValidationError {
    row: number;
    column: string;
    message: string;
    value: string;
    code: string;
}

export interface ImportResult {
    job_id: string;
    total_rows: number;
    processed_rows: number;
    success_count: number;
    error_count: number;
    errors: ImportValidationError[];
    question_ids: number[];
    status: string;
}

export interface ImportResponse {
    message: string;
    data: ImportResult;
}

class ImportExportService {
    /**
     * Import questions from Excel or CSV file
     */
    async importQuestions(file: File): Promise<ImportResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const axiosInstance = apiService.getAxiosInstance();
        const response = await axiosInstance.post<ImportResponse>(
            API_ENDPOINTS.QUESTIONS_IMPORT,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    /**
     * Export questions to Excel or CSV
     */
    async exportQuestions(questionIds: number[], format: 'xlsx' | 'csv' = 'xlsx'): Promise<Blob> {
        const axiosInstance = apiService.getAxiosInstance();
        const response = await axiosInstance.get(API_ENDPOINTS.QUESTIONS_EXPORT, {
            params: {
                question_ids: questionIds.join(','),
                format,
            },
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Download import template
     */
    async downloadTemplate(): Promise<Blob> {
        const axiosInstance = apiService.getAxiosInstance();
        const response = await axiosInstance.get(API_ENDPOINTS.QUESTIONS_TEMPLATE, {
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Export assessment results to Excel
     */
    async exportAssessmentResults(assessmentId: number): Promise<Blob> {
        const axiosInstance = apiService.getAxiosInstance();
        const response = await axiosInstance.get(
            API_ENDPOINTS.ASSESSMENT_RESULTS_EXPORT(assessmentId),
            {
                responseType: 'blob',
            }
        );
        return response.data;
    }

    /**
     * Helper to trigger file download
     */
    downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
}

export const importExportService = new ImportExportService();
export default importExportService;
