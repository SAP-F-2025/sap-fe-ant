import { useEffect } from "react";
import { App } from "antd";
import { NotificationManager } from "../../utils/errorHandler";

/**
 * NotificationProvider Component
 * Initializes the notification instance from Ant Design's App context
 * and sets it in the NotificationManager for global access
 */
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { notification } = App.useApp();

	useEffect(() => {
		// Set the notification instance in the manager
		NotificationManager.setInstance(notification);
	}, [notification]);

	return <>{children}</>;
};

export default NotificationProvider;
