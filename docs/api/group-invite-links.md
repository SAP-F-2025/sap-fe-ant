# Group Invite Links API Documentation

## Overview

This document describes the API endpoints required for the Group Invite Links feature. This feature allows group managers to generate shareable links that others can use to join their groups.

## Feature Flow

1. **Group manager** opens a group they manage → clicks "Generate Link"
2. **Configure options**: use limit (optional), expiration time (optional)
3. **Share link** with others (copy URL or QR code)
4. **Recipient clicks link** → validates → shows group info → joins group (or redirects if already member)

---

## Data Models

### GroupInviteLink

```json
{
  "id": 1,
  "group_id": 123,
  "token": "abc123xyz789...",
  "use_limit": 10,
  "used_count": 3,
  "expires_at": "2025-12-17T10:00:00Z",
  "created_by": "user-uuid-123",
  "created_at": "2025-12-10T10:00:00Z",
  "is_active": true
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier |
| `group_id` | integer | ID of the group this link belongs to |
| `token` | string | Unique token for the invite link (URL-safe, ~32 chars recommended) |
| `use_limit` | integer \| null | Maximum number of times this link can be used. `null` = unlimited |
| `used_count` | integer | Number of times this link has been used |
| `expires_at` | string \| null | ISO 8601 datetime when link expires. `null` = never expires |
| `created_by` | string | User ID who created this link |
| `created_at` | string | ISO 8601 datetime when link was created |
| `is_active` | boolean | Whether the link is active (can be deactivated by owner) |

---

## API Endpoints

### 1. Create Invite Link

Generate a new invite link for a group.

**Endpoint:** `POST /api/v1/groups/:groupId/invite-links`

**Authorization:** User must have `can_manage` permission on the group (owner or co-owner)

**Request Body:**

```json
{
  "use_limit": 10,
  "expires_in_hours": 168
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `use_limit` | integer \| null | No | Max uses. `null` or `0` = unlimited |
| `expires_in_hours` | integer \| null | No | Hours until expiration. `null` = never expires |

**Response:** `201 Created`

```json
{
  "id": 1,
  "group_id": 123,
  "token": "aB3xY9kLmN2pQ5rS8tU1vW4zC7eF0gH",
  "use_limit": 10,
  "used_count": 0,
  "expires_at": "2025-12-17T10:00:00Z",
  "created_by": "user-uuid-123",
  "created_at": "2025-12-10T10:00:00Z",
  "is_active": true,
  "invite_url": "https://app.example.com/invite/aB3xY9kLmN2pQ5rS8tU1vW4zC7eF0gH"
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400` | Invalid request body |
| `401` | Unauthorized |
| `403` | User does not have permission to manage this group |
| `404` | Group not found |

---

### 2. List Invite Links

Get all invite links for a group.

**Endpoint:** `GET /api/v1/groups/:groupId/invite-links`

**Authorization:** User must have `can_manage` permission on the group

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "group_id": 123,
    "token": "aB3xY9kLmN2pQ5rS8tU1vW4zC7eF0gH",
    "use_limit": 10,
    "used_count": 3,
    "expires_at": "2025-12-17T10:00:00Z",
    "created_by": "user-uuid-123",
    "created_at": "2025-12-10T10:00:00Z",
    "is_active": true,
    "invite_url": "https://app.example.com/invite/aB3xY9kLmN2pQ5rS8tU1vW4zC7eF0gH"
  }
]
```

**Query Parameters (optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| `active_only` | boolean | If `true`, only return active links (default: `false`) |

---

### 3. Delete/Deactivate Invite Link

Deactivate an invite link so it can no longer be used.

**Endpoint:** `DELETE /api/v1/groups/:groupId/invite-links/:linkId`

**Authorization:** User must have `can_manage` permission on the group

**Response:** `204 No Content`

**Error Responses:**

| Status | Description |
|--------|-------------|
| `401` | Unauthorized |
| `403` | User does not have permission |
| `404` | Link or group not found |

---

### 4. Validate Invite Link

Check if an invite link token is valid. This is called when a user clicks an invite link.

**Endpoint:** `GET /api/v1/invite/:token/validate`

**Authorization:** User must be authenticated

**Response:** `200 OK`

**Success (valid link):**

```json
{
  "valid": true,
  "group": {
    "id": 123,
    "name": "math-class-12a",
    "display_name": "Math Class 12A",
    "description": "Advanced mathematics study group",
    "type": "class",
    "member_count": 25,
    "created_at": "2025-01-15T08:00:00Z"
  },
  "is_member": false
}
```

**Success (user already a member):**

```json
{
  "valid": true,
  "group": {
    "id": 123,
    "name": "math-class-12a",
    "display_name": "Math Class 12A",
    "description": "Advanced mathematics study group",
    "type": "class",
    "member_count": 25,
    "created_at": "2025-01-15T08:00:00Z"
  },
  "is_member": true
}
```

**Failed validation:**

```json
{
  "valid": false,
  "error": "expired"
}
```

| Error Code | Description |
|------------|-------------|
| `expired` | Link has passed its expiration date |
| `limit_reached` | Link has reached its maximum use count |
| `not_found` | Token does not exist |
| `inactive` | Link has been deactivated by owner |

---

### 5. Use Invite Link (Join Group)

Use an invite link to join a group.

**Endpoint:** `POST /api/v1/invite/:token/use`

**Authorization:** User must be authenticated

**Request Body:** None required

**Response:** `200 OK`

**Success (joined group):**

```json
{
  "success": true,
  "group_id": 123,
  "already_member": false,
  "message": "Successfully joined the group"
}
```

**Success (already a member - does NOT count against limit):**

```json
{
  "success": true,
  "group_id": 123,
  "already_member": true,
  "message": "You are already a member of this group"
}
```

**Error Responses:**

| Status | Code | Description |
|--------|------|-------------|
| `400` | `expired` | Link has expired |
| `400` | `limit_reached` | Link has reached maximum uses |
| `404` | `not_found` | Token does not exist |
| `400` | `inactive` | Link has been deactivated |

```json
{
  "success": false,
  "error": "expired",
  "message": "This invite link has expired"
}
```

---

## Business Logic

### Token Generation

- Generate URL-safe random token (recommended: 32 characters, alphanumeric)
- Ensure uniqueness across all invite links

### Use Limit Tracking

- Increment `used_count` only when a NEW member joins via the link
- Do NOT increment if user is already a member (they just get redirected)
- Check `used_count < use_limit` before allowing join (if `use_limit` is set)

### Expiration Check

- Compare `expires_at` with current server time
- Links with `expires_at = null` never expire

### Permission Check

- Only users with `can_manage = true` on the group can create/view/delete invite links
- Any authenticated user can validate and use a link

### Member Addition

- When a user successfully uses an invite link, add them to the group with role `member`
- If user is already a member, return success but don't modify anything

---

## Database Schema Suggestion

```sql
CREATE TABLE group_invite_links (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    token VARCHAR(64) NOT NULL UNIQUE,
    use_limit INTEGER DEFAULT NULL,
    used_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    
    INDEX idx_group_invite_links_token (token),
    INDEX idx_group_invite_links_group_id (group_id)
);
```

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/invite/:token` | Public invite link page (requires auth) |

The frontend will:

1. Extract token from URL
2. Call `GET /api/v1/invite/:token/validate`
3. Show group info and "Join" button (or redirect if already member)
4. On click "Join", call `POST /api/v1/invite/:token/use`
5. Redirect to group page on success

---

## Example Invite URL

```
https://your-app-domain.com/invite/aB3xY9kLmN2pQ5rS8tU1vW4zC7eF0gH
```
