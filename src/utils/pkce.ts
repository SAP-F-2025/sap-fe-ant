/**
 * PKCE (Proof Key for Code Exchange) Utilities
 * RFC 7636: https://tools.ietf.org/html/rfc7636
 */

/**
 * Generate a random code verifier
 * @param length Length of the code verifier (43-128 characters)
 * @returns A cryptographically random string
 */
export function generateCodeVerifier(length: number = 128): string {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
	const randomValues = new Uint8Array(length);
	crypto.getRandomValues(randomValues);

	return Array.from(randomValues)
		.map((value) => charset[value % charset.length])
		.join('');
}

/**
 * Generate a code challenge from code verifier using SHA-256
 * @param codeVerifier The code verifier string
 * @returns A base64url-encoded SHA-256 hash of the code verifier
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
	// Encode the code verifier as UTF-8
	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);

	// Hash with SHA-256
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);

	// Convert to base64url
	return base64UrlEncode(hashBuffer);
}

/**
 * Base64URL encode an ArrayBuffer
 * @param buffer ArrayBuffer to encode
 * @returns Base64URL-encoded string
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';

	for (let i = 0; i < bytes.length; i++) {
		binary += String.fromCharCode(bytes[i]);
	}

	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Store PKCE code verifier in session storage
 * @param codeVerifier The code verifier to store
 */
export function storePKCEVerifier(codeVerifier: string): void {
	sessionStorage.setItem('pkce_code_verifier', codeVerifier);
}

/**
 * Retrieve PKCE code verifier from session storage
 * @returns The stored code verifier or null if not found
 */
export function retrievePKCEVerifier(): string | null {
	return sessionStorage.getItem('pkce_code_verifier');
}

/**
 * Clear PKCE code verifier from session storage
 */
export function clearPKCEVerifier(): void {
	sessionStorage.removeItem('pkce_code_verifier');
}
