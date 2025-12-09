import type { NotificationInstance } from "antd/es/notification/interface";
import { AxiosError } from "axios";
import i18n from "../i18n";

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
	private static getErrorMessage(
		statusCode: number,
		serverMessage?: string,
	): { title: string; description: string } {
		// Use server message if available and meaningful
		const description =
			serverMessage &&
			serverMessage !== "Error" &&
			serverMessage.length < 100
				? serverMessage
				: "";

		// Default messages based on status code
		switch (statusCode) {
			case 400:
				return {
					title: i18n.t("errorHandler.badRequest.title"),
					description:
						description ||
						i18n.t("errorHandler.badRequest.description"),
				};
			case 401:
				return {
					title: i18n.t("errorHandler.unauthorized.title"),
					description:
						description ||
						i18n.t("errorHandler.unauthorized.description"),
				};
			case 403:
				return {
					title: i18n.t("errorHandler.forbidden.title"),
					description:
						description ||
						i18n.t("errorHandler.forbidden.description"),
				};
			case 404:
				return {
					title: i18n.t("errorHandler.notFound.title"),
					description:
						description ||
						i18n.t("errorHandler.notFound.description"),
				};
			case 409:
				return {
					title: i18n.t("errorHandler.conflict.title"),
					description:
						description ||
						i18n.t("errorHandler.conflict.description"),
				};
			case 422:
				return {
					title: i18n.t("errorHandler.unprocessable.title"),
					description:
						description ||
						i18n.t("errorHandler.unprocessable.description"),
				};
			case 429:
				return {
					title: i18n.t("errorHandler.tooManyRequests.title"),
					description:
						description ||
						i18n.t("errorHandler.tooManyRequests.description"),
				};
			case 500:
				return {
					title: i18n.t("errorHandler.serverError.title"),
					description:
						description ||
						i18n.t("errorHandler.serverError.description"),
				};
			case 502:
				return {
					title: i18n.t("errorHandler.badGateway.title"),
					description:
						description ||
						i18n.t("errorHandler.badGateway.description"),
				};
			case 503:
				return {
					title: i18n.t("errorHandler.serviceUnavailable.title"),
					description:
						description ||
						i18n.t("errorHandler.serviceUnavailable.description"),
				};
			case 504:
				return {
					title: i18n.t("errorHandler.gatewayTimeout.title"),
					description:
						description ||
						i18n.t("errorHandler.gatewayTimeout.description"),
				};
			default:
				return {
					title: i18n.t("errorHandler.default.title"),
					description:
						description ||
						i18n.t("errorHandler.default.description"),
				};
		}
	}

	/**
	 * Handle Axios errors and show notifications
	 */
	static handle(error: unknown, customMessage?: string): void {
		const notification = NotificationManager.getInstance();
		if (!notification) {
			console.error("Notification instance not available");
			return;
		}

		if (!error) {
			notification.error({
				message: i18n.t("errorHandler.default.title"),
				description: i18n.t("errorHandler.unknownError"),
				placement: "topRight",
			});
			return;
		}

		// If it's an Axios error
		if (this.isAxiosError(error)) {
			const axiosError = error as AxiosError<ErrorResponse>;

			// Network error (no response from server)
			if (!axiosError.response) {
				if (axiosError.code === "ECONNABORTED") {
					notification.error({
						message: i18n.t("errorHandler.timeout.title"),
						description:
							customMessage ||
							i18n.t("errorHandler.timeout.description"),
						placement: "topRight",
					});
				} else if (axiosError.message === "Network Error") {
					notification.error({
						message: i18n.t("errorHandler.networkError.title"),
						description:
							customMessage ||
							i18n.t("errorHandler.networkError.description"),
						placement: "topRight",
					});
				} else {
					notification.error({
						message: i18n.t("errorHandler.networkError.title"),
						description:
							customMessage ||
							i18n.t("errorHandler.connectionError"),
						placement: "topRight",
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
				description: customMessage
					? errorMsg.description
					: errorMsg.description,
				placement: "topRight",
				duration: 4.5,
			});
		} else if (error instanceof Error) {
			// Regular JavaScript error
			notification.error({
				message: customMessage || i18n.t("errorHandler.default.title"),
				description: error.message,
				placement: "topRight",
			});
		} else {
			// Unknown error type
			notification.error({
				message: i18n.t("errorHandler.default.title"),
				description:
					customMessage || i18n.t("errorHandler.unknownError"),
				placement: "topRight",
			});
		}
	}

	/**
	 * Handle errors silently (log only, no notification)
	 */
	static handleSilently(error: unknown): void {
		console.error("Silent Error:", error);
	}

	/**
	 * Show success notification
	 */
	static success(msg: string, description?: string): void {
		const notification = NotificationManager.getInstance();
		if (!notification) {
			console.error("❌ Notification instance not available");
			return;
		}

		notification.success({
			message: msg,
			description: description,
			placement: "topRight",
			duration: 3,
		});
	}

	/**
	 * Show info notification
	 */
	static info(msg: string, description?: string): void {
		const notification = NotificationManager.getInstance();
		if (!notification) {
			console.error("❌ Notification instance not available");
			return;
		}

		notification.info({
			message: msg,
			description: description,
			placement: "topRight",
			duration: 3,
		});
	}

	/**
	 * Show warning notification
	 */
	static warning(msg: string, description?: string): void {
		const notification = NotificationManager.getInstance();
		if (!notification) {
			console.error("❌ Notification instance not available");
			return;
		}

		notification.warning({
			message: msg,
			description: description,
			placement: "topRight",
			duration: 3,
		});
	}

	/**
	 * Show error notification
	 */
	static error(msg: string, description?: string): void {
		const notification = NotificationManager.getInstance();
		if (!notification) {
			console.error("❌ Notification instance not available");
			return;
		}

		notification.error({
			message: msg,
			description: description,
			placement: "topRight",
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
export const showError = (message: string, description?: string) =>
	ErrorHandler.error(message, description);
