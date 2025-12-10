import { API_ENDPOINTS } from '../config/api';
import {
	CreateInviteLinkRequest,
	GroupInviteLinkResponse,
	UseInviteLinkResponse,
	ValidateInviteLinkResponse,
} from '../types';
import apiService from './api';

/**
 * Service for managing group invite links
 * Note: Backend API is not yet implemented. These are prepared endpoints.
 */
class InviteLinkService {
	/**
	 * Generate a new invite link for a group
	 * POST /api/v1/groups/:groupId/invite-links
	 */
	async createInviteLink(
		groupId: number,
		data: CreateInviteLinkRequest
	): Promise<GroupInviteLinkResponse> {
		return apiService.post<GroupInviteLinkResponse>(
			API_ENDPOINTS.GROUP_INVITE_LINKS(groupId),
			data
		);
	}

	/**
	 * Get all invite links for a group
	 * GET /api/v1/groups/:groupId/invite-links
	 */
	async getInviteLinks(groupId: number): Promise<GroupInviteLinkResponse[]> {
		return apiService.get<GroupInviteLinkResponse[]>(API_ENDPOINTS.GROUP_INVITE_LINKS(groupId));
	}

	/**
	 * Delete/deactivate an invite link
	 * DELETE /api/v1/groups/:groupId/invite-links/:linkId
	 */
	async deleteInviteLink(groupId: number, linkId: number): Promise<void> {
		return apiService.delete(API_ENDPOINTS.GROUP_INVITE_LINK(groupId, linkId));
	}

	/**
	 * Validate an invite link token (check if valid, not expired, not over limit)
	 * GET /api/v1/invite/:token/validate
	 */
	async validateInviteLink(token: string): Promise<ValidateInviteLinkResponse> {
		return apiService.get<ValidateInviteLinkResponse>(
			API_ENDPOINTS.INVITE_LINK_VALIDATE(token)
		);
	}

	/**
	 * Use an invite link to join a group
	 * POST /api/v1/invite/:token/use
	 */
	async useInviteLink(token: string): Promise<UseInviteLinkResponse> {
		return apiService.post<UseInviteLinkResponse>(API_ENDPOINTS.INVITE_LINK_USE(token));
	}

	/**
	 * Generate the full invite URL for a token
	 */
	getInviteUrl(token: string): string {
		const baseUrl = window.location.origin;
		return `${baseUrl}/invite/${token}`;
	}
}

export const inviteLinkService = new InviteLinkService();
export default inviteLinkService;
