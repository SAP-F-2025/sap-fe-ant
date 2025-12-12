import { API_ENDPOINTS } from '../config/api';
import apiService from './api';
import {
	GroupResponse,
	GroupMemberResponse,
	GroupListResponse,
	GroupCreateRequest,
	GroupUpdateRequest,
	AddGroupMemberRequest,
	UpdateMemberRoleRequest,
	PaginationParams,
	GroupAssessmentListResponse,
	AssignToGroupsRequest,
	UnassignFromGroupsRequest,
	AssessmentGroupAssignmentResponse,
	GroupInviteResponse,
	CreateInviteLinkRequest,
	CreateInviteCodeRequest,
	JoinViaCodeRequest,
} from '../types';

class GroupService {
	/**
	 * Get paginated list of groups
	 */
	async getGroups(
		params?: PaginationParams & { type?: string; search?: string }
	): Promise<GroupListResponse> {
		return apiService.get<GroupListResponse>(API_ENDPOINTS.GROUPS, params);
	}

	/**
	 * Get groups created by current user
	 */
	async getMyGroups(): Promise<GroupListResponse> {
		return apiService.get<GroupListResponse>(API_ENDPOINTS.GROUPS_MY);
	}

	/**
	 * Get groups where current user is a member
	 */
	async getMyMemberships(): Promise<GroupListResponse> {
		return apiService.get<GroupListResponse>(API_ENDPOINTS.GROUPS_MEMBERSHIPS);
	}

	/**
	 * Get group by ID
	 */
	async getGroup(id: number): Promise<GroupResponse> {
		return apiService.get<GroupResponse>(API_ENDPOINTS.GROUP_DETAIL(id));
	}

	/**
	 * Create a new group
	 */
	async createGroup(data: GroupCreateRequest): Promise<GroupResponse> {
		return apiService.post<GroupResponse>(API_ENDPOINTS.GROUPS, data);
	}

	/**
	 * Update a group
	 */
	async updateGroup(id: number, data: GroupUpdateRequest): Promise<GroupResponse> {
		return apiService.put<GroupResponse>(API_ENDPOINTS.GROUP_DETAIL(id), data);
	}

	/**
	 * Delete a group
	 */
	async deleteGroup(id: number): Promise<void> {
		return apiService.delete(API_ENDPOINTS.GROUP_DETAIL(id));
	}

	/**
	 * Get group members
	 */
	async getMembers(groupId: number): Promise<GroupMemberResponse[]> {
		return apiService.get<GroupMemberResponse[]>(API_ENDPOINTS.GROUP_MEMBERS(groupId));
	}

	/**
	 * Add member to group
	 */
	async addMember(groupId: number, data: AddGroupMemberRequest): Promise<void> {
		return apiService.post(API_ENDPOINTS.GROUP_MEMBERS(groupId), data);
	}

	/**
	 * Remove member from group
	 */
	async removeMember(groupId: number, userId: string): Promise<void> {
		return apiService.delete(API_ENDPOINTS.GROUP_MEMBER(groupId, userId));
	}

	/**
	 * Update member role
	 */
	async updateMemberRole(
		groupId: number,
		userId: string,
		data: UpdateMemberRoleRequest
	): Promise<void> {
		return apiService.put(API_ENDPOINTS.GROUP_MEMBER_ROLE(groupId, userId), data);
	}

	// ============ Assessment-Group Management ============

	/**
	 * Get assessments assigned to a group
	 * GET /groups/:id/assessments
	 */
	async getGroupAssessments(groupId: number): Promise<GroupAssessmentListResponse> {
		return apiService.get<GroupAssessmentListResponse>(
			API_ENDPOINTS.GROUP_ASSESSMENTS(groupId)
		);
	}

	/**
	 * Get groups assigned to an assessment
	 * GET /assessments/:id/groups
	 */
	async getAssessmentGroups(assessmentId: number): Promise<AssessmentGroupAssignmentResponse> {
		return apiService.get<AssessmentGroupAssignmentResponse>(
			API_ENDPOINTS.ASSESSMENT_GROUPS(assessmentId)
		);
	}

	/**
	 * Assign assessment to multiple groups
	 * POST /assessments/:id/groups
	 */
	async assignAssessmentToGroups(assessmentId: number, groupIds: number[]): Promise<void> {
		const data: AssignToGroupsRequest = { group_ids: groupIds };
		return apiService.post(API_ENDPOINTS.ASSESSMENT_GROUPS(assessmentId), data);
	}

	/**
	 * Unassign assessment from multiple groups
	 * DELETE /assessments/:id/groups
	 */
	async unassignAssessmentFromGroups(assessmentId: number, groupIds: number[]): Promise<void> {
		const data: UnassignFromGroupsRequest = { group_ids: groupIds };
		return apiService.delete(API_ENDPOINTS.ASSESSMENT_GROUPS(assessmentId), data);
	}

	// ============ Invite Management ============

	/**
	 * Get all invites for a group
	 */
	async getInvites(groupId: number): Promise<GroupInviteResponse[]> {
		return apiService.get<GroupInviteResponse[]>(API_ENDPOINTS.GROUP_INVITES(groupId));
	}

	/**
	 * Create an invite link
	 */
	async createInviteLink(
		groupId: number,
		data?: CreateInviteLinkRequest
	): Promise<GroupInviteResponse> {
		return apiService.post<GroupInviteResponse>(API_ENDPOINTS.GROUP_INVITE_LINK(groupId), data || {});
	}

	/**
	 * Create an invite code
	 */
	async createInviteCode(
		groupId: number,
		data?: CreateInviteCodeRequest
	): Promise<GroupInviteResponse> {
		return apiService.post<GroupInviteResponse>(API_ENDPOINTS.GROUP_INVITE_CODE(groupId), data || {});
	}

	/**
	 * Delete an invite
	 */
	async deleteInvite(groupId: number, inviteId: number): Promise<void> {
		return apiService.delete(API_ENDPOINTS.GROUP_INVITE_DELETE(groupId, inviteId));
	}

	/**
	 * Regenerate an invite (reset token/code, expiry, and uses count)
	 */
	async regenerateInvite(groupId: number, inviteId: number): Promise<GroupInviteResponse> {
		return apiService.post<GroupInviteResponse>(
			API_ENDPOINTS.GROUP_INVITE_REGENERATE(groupId, inviteId)
		);
	}

	/**
	 * Join a group via invite link token
	 */
	async joinViaLink(token: string): Promise<GroupResponse> {
		return apiService.post<GroupResponse>(API_ENDPOINTS.GROUP_JOIN_LINK(token));
	}

	/**
	 * Join a group via invite code
	 */
	async joinViaCode(code: string): Promise<GroupResponse> {
		const data: JoinViaCodeRequest = { code };
		return apiService.post<GroupResponse>(API_ENDPOINTS.GROUP_JOIN_CODE, data);
	}

	/**
	 * Leave a group (self-removal)
	 */
	async leaveGroup(groupId: number): Promise<void> {
		return apiService.delete(API_ENDPOINTS.GROUP_LEAVE(groupId));
	}
}

export const groupService = new GroupService();
export default groupService;

