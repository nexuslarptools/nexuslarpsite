# Auth0 Setup Guide

This document provides instructions for setting up Auth0 for the Nexus LARP site, including configuring the correct scopes, permissions, and roles.

## Auth0 Configuration

### 1. Create an Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to Applications > Applications
3. Click "Create Application"
4. Name it "Nexus LARP Site" and select "Single Page Application"
5. Click "Create"

### 2. Configure Application Settings

1. In your application settings, set the following:
   - **Allowed Callback URLs**: `http://localhost:3000, https://your-production-domain.com`
   - **Allowed Logout URLs**: `http://localhost:3000, https://your-production-domain.com`
   - **Allowed Web Origins**: `http://localhost:3000, https://your-production-domain.com`
   - **Allowed Origins (CORS)**: `http://localhost:3000, https://your-production-domain.com`

2. Scroll down to "Advanced Settings" > "OAuth" and ensure:
   - **JsonWebToken Signature Algorithm**: RS256
   - **OIDC Conformant**: Enabled

### 3. Create an API

1. Navigate to Applications > APIs
2. Click "Create API"
3. Set the following:
   - **Name**: Nexus LARP API
   - **Identifier**: `https://nexuslarp.com/api` (this will be your audience value)
   - **Signing Algorithm**: RS256
4. Click "Create"

### 4. Configure API Scopes

1. In your API settings, go to the "Permissions" tab
2. Add the following scopes:
   - `read:users`: Permission to read user data
   - `update:users`: Permission to update user data
   - `read:items`: Permission to read item data
   - `create:items`: Permission to create new items
   - `update:items`: Permission to update existing items
   - `delete:items`: Permission to delete items
   - `read:characters`: Permission to read character data
   - `create:characters`: Permission to create new characters
   - `update:characters`: Permission to update existing characters
   - `delete:characters`: Permission to delete characters
   - `approve:content`: Permission to approve content

### 5. Create Roles

1. Navigate to User Management > Roles
2. Create the following roles:
   - `admin`: Administrator with full access
   - `head_gm`: Head Game Master
   - `gm`: Game Master
   - `approver`: Content Approver
   - `writer`: Content Writer
   - `reader`: Basic User

### 6. Assign Permissions to Roles

1. Click on each role and go to the "Permissions" tab
2. Assign the appropriate permissions to each role:

   **admin**:
   - All permissions

   **head_gm**:
   - `read:users`
   - `update:users`
   - `read:items`
   - `create:items`
   - `update:items`
   - `delete:items`
   - `read:characters`
   - `create:characters`
   - `update:characters`
   - `delete:characters`
   - `approve:content`

   **gm**:
   - `read:users`
   - `read:items`
   - `create:items`
   - `update:items`
   - `read:characters`
   - `create:characters`
   - `update:characters`
   - `approve:content`

   **approver**:
   - `read:items`
   - `update:items`
   - `read:characters`
   - `update:characters`
   - `approve:content`

   **writer**:
   - `read:items`
   - `create:items`
   - `update:items`
   - `read:characters`
   - `create:characters`
   - `update:characters`

   **reader**:
   - `read:items`
   - `read:characters`

### 7. Configure Rules

Create a rule to add roles to the user's ID token and access token:

1. Navigate to Auth Pipeline > Rules
2. Click "Create Rule"
3. Select the "Empty Rule" template
4. Name it "Add Roles to Tokens"
5. Add the following code:

```javascript
function addRolesToTokens(user, context, callback) {
  // Get the user's roles
  const namespace = 'https://nexuslarp.com';
  const assignedRoles = (context.authorization || {}).roles || [];

  // Add roles to ID token and access token
  const idTokenClaims = context.idToken || {};
  const accessTokenClaims = context.accessToken || {};

  idTokenClaims[`${namespace}/roles`] = assignedRoles;
  accessTokenClaims[`${namespace}/roles`] = assignedRoles;

  context.idToken = idTokenClaims;
  context.accessToken = accessTokenClaims;

  callback(null, user, context);
}
```

6. Click "Save Changes"

## Environment Variables

After setting up Auth0, update your environment variables in the `.env` file:

```
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://nexuslarp.com/api
```

## Testing the Configuration

To test if your Auth0 configuration is working correctly:

1. Assign roles to a test user in the Auth0 dashboard
2. Log in to the application with that user
3. Open the browser console and check the user object:
   ```javascript
   const auth0 = document.querySelector('#root').__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__.queries.find(q => q.queryKey[0] === 'auth0').state.data;
   console.log(auth0.user);
   ```
4. Verify that the roles and permissions are present in the user object

## Troubleshooting

If roles or permissions are not appearing in the tokens:

1. Check that the rule is active and working
2. Verify that roles have been assigned to the user
3. Ensure that the namespace in the rule matches the one used in the application
4. Check that the audience is correctly set in the Auth0Provider configuration