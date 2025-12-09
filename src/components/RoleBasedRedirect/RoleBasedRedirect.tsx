import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spin } from "antd";
import { hasAnyRole, type UserRole } from "../../utils/roleChecker";

interface RoleBasedRedirectProps {
	allowedRoles?: UserRole[];
	redirectTo?: string;
	children: React.ReactNode;
}

/**
 * Component to redirect users based on their role
 * If user's role is not in allowedRoles, redirect to specified path
 */
const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({
	allowedRoles = [],
	redirectTo = "/student/dashboard",
	children,
}) => {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<Spin size="large" />
			</div>
		);
	}

	// If no allowed roles specified, allow all
	if (allowedRoles.length === 0) {
		return <>{children}</>;
	}

	// Check if user has any of the allowed roles
	const hasAllowedRole = hasAnyRole(user, allowedRoles);

	// If user doesn't have allowed role, redirect
	if (!hasAllowedRole) {
		return <Navigate to={redirectTo} replace />;
	}

	return <>{children}</>;
};

export default RoleBasedRedirect;
