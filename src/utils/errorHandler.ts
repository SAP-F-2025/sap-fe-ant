import type { NotificationInstance } from 'antd/es/notification/interface';
import { AxiosError } from 'axios';

export interface ErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// Notification instance manager
class NotificationManager {
  private static instance: NotificationInstance | null = null;

  static setInstance(instance: NotificationInstance) {
    this.instance = instance;
  }

  static getInstance(): NotificationInstance | null {
    return this.instance;
  }
}

export { NotificationManager };

/**
 * Error Handler Utility
 * Handles API errors and displays appropriate notifications
 */
export class ErrorHandler {
  /**
   * Get user-friendly error message based on status code
   */
  private static getErrorMessage(statusCode: number, serverMessage?: string): { title: string; description: string } {
    // Use server message if available and meaningful
    const description = serverMessage && serverMessage !== 'Error' && serverMessage.length < 100
      ? serverMessage
      : '';

    // Default messages based on status code
    switch (statusCode) {
      case 400:
        return {
          title: 'Yêu cầu không hợp lệ',
          description: description || 'Vui lòng kiểm tra lại thông tin.'
        };
      case 401:
        return {
          title: 'Phiên đăng nhập hết hạn',
          description: description || 'Vui lòng đăng nhập lại.'
        };
      case 403:
        return {
          title: 'Không có quyền truy cập',
          description: description || 'Bạn không có quyền thực hiện thao tác này.'
        };
      case 404:
        return {
          title: 'Không tìm thấy',
          description: description || 'Tài nguyên yêu cầu không tồn tại.'
        };
      case 409:
        return {
          title: 'Xung đột dữ liệu',
          description: description || 'Dữ liệu bị xung đột. Vui lòng thử lại.'
        };
      case 422:
        return {
          title: 'Dữ liệu không hợp lệ',
          description: description || 'Vui lòng kiểm tra lại thông tin đã nhập.'
        };
      case 429:
        return {
          title: 'Quá nhiều yêu cầu',
          description: description || 'Vui lòng thử lại sau ít phút.'
        };
      case 500:
        return {
          title: 'Lỗi máy chủ',
          description: description || 'Đã xảy ra lỗi trên máy chủ. Vui lòng thử lại.'
        };
      case 502:
        return {
          title: 'Máy chủ không phản hồi',
          description: description || 'Không thể kết nối đến máy chủ.'
        };
      case 503:
        return {
          title: 'Dịch vụ không khả dụng',
          description: description || 'Hệ thống đang bảo trì. Vui lòng thử lại sau.'
        };
      case 504:
        return {
          title: 'Máy chủ quá tải',
          description: description || 'Yêu cầu quá thời gian chờ.'
        };
      default:
        return {
          title: 'Đã xảy ra lỗi',
          description: description || 'Vui lòng thử lại sau.'
        };
    }
  }

  /**
   * Handle Axios errors and show notifications
   */
  static handle(error: unknown, customMessage?: string): void {
    const notification = NotificationManager.getInstance();
    if (!notification) {
      console.error('Notification instance not available');
      return;
    }

    if (!error) {
      notification.error({
        message: 'Đã xảy ra lỗi',
        description: 'Lỗi không xác định.',
        placement: 'topRight',
      });
      return;
    }

    // If it's an Axios error
    if (this.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Network error (no response from server)
      if (!axiosError.response) {
        if (axiosError.code === 'ECONNABORTED') {
          notification.error({
            message: 'Yêu cầu quá thời gian chờ',
            description: customMessage || 'Vui lòng kiểm tra kết nối mạng và thử lại.',
            placement: 'topRight',
          });
        } else if (axiosError.message === 'Network Error') {
          notification.error({
            message: 'Lỗi kết nối',
            description: customMessage || 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.',
            placement: 'topRight',
          });
        } else {
          notification.error({
            message: 'Lỗi kết nối',
            description: customMessage || 'Lỗi kết nối. Vui lòng thử lại.',
            placement: 'topRight',
          });
        }
        return;
      }

      const statusCode = axiosError.response.status;
      const errorData = axiosError.response.data;

      // Skip showing notification for 401 (handled by interceptor redirect)
      if (statusCode === 401) {
        return;
      }

      // Get error message from response or use default
      const serverMessage = errorData?.message || errorData?.error;
      const errorMsg = this.getErrorMessage(statusCode, serverMessage);

      // Show error notification
      notification.error({
        message: customMessage || errorMsg.title,
        description: customMessage ? errorMsg.description : errorMsg.description,
        placement: 'topRight',
        duration: 4.5,
      });
    } else if (error instanceof Error) {
      // Regular JavaScript error
      notification.error({
        message: customMessage || 'Đã xảy ra lỗi',
        description: error.message,
        placement: 'topRight',
      });
    } else {
      // Unknown error type
      notification.error({
        message: 'Đã xảy ra lỗi',
        description: customMessage || 'Lỗi không xác định.',
        placement: 'topRight',
      });
    }
  }

  /**
   * Handle errors silently (log only, no notification)
   */
  static handleSilently(error: unknown): void {
    console.error('Silent Error:', error);
  }

  /**
   * Show success notification
   */
  static success(msg: string, description?: string): void {
    const notification = NotificationManager.getInstance();
    if (!notification) {
      console.error('❌ Notification instance not available');
      return;
    }

    notification.success({
      message: msg,
      description: description,
      placement: 'topRight',
      duration: 3,
    });
  }

  /**
   * Show info notification
   */
  static info(msg: string, description?: string): void {
    const notification = NotificationManager.getInstance();
    if (!notification) {
      console.error('❌ Notification instance not available');
      return;
    }

    notification.info({
      message: msg,
      description: description,
      placement: 'topRight',
      duration: 3,
    });
  }

  /**
   * Show warning notification
   */
  static warning(msg: string, description?: string): void {
    const notification = NotificationManager.getInstance();
    if (!notification) {
      console.error('❌ Notification instance not available');
      return;
    }

    notification.warning({
      message: msg,
      description: description,
      placement: 'topRight',
      duration: 3,
    });
  }

  /**
   * Show error notification
   */
  static error(msg: string, description?: string): void {
    const notification = NotificationManager.getInstance();
    if (!notification) {
      console.error('❌ Notification instance not available');
      return;
    }

    notification.error({
      message: msg,
      description: description,
      placement: 'topRight',
      duration: 4.5,
    });
  }

  /**
   * Type guard to check if error is AxiosError
   */
  private static isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError;
  }
}

// Export convenience functions
export const handleError = (error: unknown, customMessage?: string) =>
  ErrorHandler.handle(error, customMessage);

export const handleErrorSilently = (error: unknown) =>
  ErrorHandler.handleSilently(error);

export const showSuccess = (message: string) => ErrorHandler.success(message);
export const showInfo = (message: string) => ErrorHandler.info(message);
export const showWarning = (message: string) => ErrorHandler.warning(message);
export const showError = (message: string, description?: string) => ErrorHandler.error(message, description);
