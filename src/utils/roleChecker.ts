/**
 * Utility functions to check user roles
 */

export type UserRole = 'admin' | 'teacher' | 'student';

export interface RoleCheckUser {
	isAdmin?: boolean;
	roles?: Array<{ name?: string; [key: string]: any }>;
}

/**
 * Kiểm tra xem user có phải là Admin không
 * Admin: isAdmin = true HOẶC roles chứa "Admin"
 */
export const isAdmin = (user: RoleCheckUser | null): boolean => {
	if (!user) return false;

	// Check isAdmin flag
	if (user.isAdmin === true) return true;

	// Check roles array for "Admin"
	if (user.roles && Array.isArray(user.roles)) {
		return user.roles.some((role) => role.name === 'Admin');
	}

	return false;
};

/**
 * Kiểm tra xem user có phải là Teacher không
 * Teacher: roles chứa name là "Teacher"
 */
export const isTeacher = (user: RoleCheckUser | null): boolean => {
	if (!user) return false;

	if (user.roles && Array.isArray(user.roles)) {
		return user.roles.some((role) => role.name === 'Teacher');
	}

	return false;
};

/**
 * Kiểm tra xem user có phải là Student không
 * Student: roles rỗng VÀ isAdmin = false
 */
export const isStudent = (user: RoleCheckUser | null): boolean => {
	if (!user) return false;

	const rolesEmpty = !user.roles || user.roles.length === 0;
	const notAdmin = user.isAdmin !== true;

	return rolesEmpty && notAdmin;
};

/**
 * Lấy role chính của user
 */
export const getUserRole = (user: RoleCheckUser | null): UserRole => {
	if (isAdmin(user)) return 'admin';
	if (isTeacher(user)) return 'teacher';
	return 'student';
};

/**
 * Kiểm tra xem user có một trong các roles được phép không
 */
export const hasAnyRole = (user: RoleCheckUser | null, allowedRoles: UserRole[]): boolean => {
	if (!user || allowedRoles.length === 0) return false;

	const userRole = getUserRole(user);
	console.log(userRole);
	return allowedRoles.includes(userRole);
};
