/**
 * JWT Decode Utility
 * Decodes JWT tokens to extract user information
 */

export interface DecodedToken {
	owner?: string;
	name?: string;
	createdTime?: string;
	updatedTime?: string;
	id?: string;
	type?: string;
	displayName?: string;
	firstName?: string;
	lastName?: string;
	avatar?: string;
	email?: string;
	emailVerified?: boolean;
	phone?: string;
	countryCode?: string;
	region?: string;
	location?: string;
	affiliation?: string;
	title?: string;
	bio?: string;
	language?: string;
	gender?: string;
	birthday?: string;
	education?: string;
	score?: number;
	karma?: number;
	ranking?: number;
	isAdmin?: boolean;
	isForbidden?: boolean;
	tag?: string;
	scope?: string;
	lastSigninTime?: string;
	lastSigninIp?: string;
	permissions?: any[];
	roles?: any[];
	groups?: any[];
	// JWT standard fields
	iss?: string;
	sub?: string;
	aud?: string[];
	exp?: number;
	nbf?: number;
	iat?: number;
	jti?: string;
	[key: string]: any;
}

/**
 * Decode a JWT token (base64 decode the payload)
 * Note: This does NOT verify the signature, only decodes the payload
 */
export const decodeJWT = (token: string): DecodedToken | null => {
	try {
		// JWT format: header.payload.signature
		const parts = token.split(".");

		if (parts.length !== 3) {
			console.error("Invalid JWT format");
			return null;
		}

		// Decode the payload (second part)
		const payload = parts[1];

		// Replace URL-safe characters
		const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

		// Decode base64
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split("")
				.map(
					(c) =>
						"%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2),
				)
				.join(""),
		);

		return JSON.parse(jsonPayload);
	} catch (error) {
		console.error("Failed to decode JWT:", error);
		return null;
	}
};

/**
 * Check if a JWT token is expired
 */
export const isTokenExpired = (token: string): boolean => {
	const decoded = decodeJWT(token);

	if (!decoded || !decoded.exp) {
		return true;
	}

	// exp is in seconds, Date.now() is in milliseconds
	return decoded.exp * 1000 < Date.now();
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
	const decoded = decodeJWT(token);

	if (!decoded || !decoded.exp) {
		return null;
	}

	return new Date(decoded.exp * 1000);
};

/**
 * Extract essential user information from decoded JWT token
 * Returns only the necessary and friendly fields for the User interface
 */
export const extractUserInfo = (decodedToken: DecodedToken): any => {
	return {
		// Basic info
		id: decodedToken.id,
		name: decodedToken.name,
		displayName: decodedToken.displayName,
		avatar: decodedToken.avatar,
		type: decodedToken.type,

		// Contact
		email: decodedToken.email,
		emailVerified: decodedToken.emailVerified,
		phone: decodedToken.phone,
		countryCode: decodedToken.countryCode,

		// Organization
		owner: decodedToken.owner,
		affiliation: decodedToken.affiliation,
		education: decodedToken.education,

		// Permissions - CRITICAL: Ensure isAdmin defaults to false if undefined
		isAdmin: decodedToken.isAdmin ?? false,
		roles: decodedToken.roles ?? [],
		permissions: decodedToken.permissions ?? [],

		// Metadata
		createdTime: decodedToken.createdTime,
		lastSigninTime: decodedToken.lastSigninTime,
	};
};
