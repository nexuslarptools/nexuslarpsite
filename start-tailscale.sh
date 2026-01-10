#!/bin/sh

# Ensure Tailscale is up to date before starting
echo "Checking for Tailscale updates..."
apk add --no-cache --upgrade tailscale || echo "Warning: Failed to update Tailscale. Proceeding with the currently installed version."

# Start tailscaled in the background
# --tun=userspace-networking is used to avoid needing /dev/net/tun or special capabilities
echo "Starting tailscaled..."
tailscaled --state=mem: --tun=userspace-networking --statedir=/var/lib/tailscale &

# Wait for tailscaled to be ready
echo "Waiting for tailscaled to be ready..."
MAX_ATTEMPTS=15
COUNT=0
until tailscale status --json >/dev/null 2>&1 || [ $COUNT -eq $MAX_ATTEMPTS ]; do
  sleep 1
  COUNT=$((COUNT + 1))
done

# Try to get auth key and tags from environment variable or secret file
# Supporting /run/secrets/ matches the pattern used for build secrets and Docker/K8s runtime secrets
if [ -n "$TAILSCALE_AUTHKEY" ]; then
    AUTH_KEY="$TAILSCALE_AUTHKEY"
elif [ -f "/run/secrets/TAILSCALE_AUTHKEY" ]; then
    AUTH_KEY=$(cat /run/secrets/TAILSCALE_AUTHKEY)
elif [ -n "$TAILSCALE_OAUTH_CLIENT_ID" ] && [ -n "$TAILSCALE_OAUTH_CLIENT_SECRET" ]; then
    AUTH_KEY="tskey-client-${TAILSCALE_OAUTH_CLIENT_ID}-${TAILSCALE_OAUTH_CLIENT_SECRET}"
elif [ -f "/run/secrets/TAILSCALE_OAUTH_CLIENT_ID" ] && [ -f "/run/secrets/TAILSCALE_OAUTH_CLIENT_SECRET" ]; then
    CLIENT_ID=$(cat /run/secrets/TAILSCALE_OAUTH_CLIENT_ID)
    CLIENT_SECRET=$(cat /run/secrets/TAILSCALE_OAUTH_CLIENT_SECRET)
    AUTH_KEY="tskey-client-${CLIENT_ID}-${CLIENT_SECRET}"
fi

if [ -n "$TAILSCALE_TAGS" ]; then
    TAGS="$TAILSCALE_TAGS"
elif [ -f "/run/secrets/TAILSCALE_TAGS" ]; then
    TAGS=$(cat /run/secrets/TAILSCALE_TAGS)
fi

TAGS_ARG=""
if [ -n "$TAGS" ]; then
    TAGS_ARG="--advertise-tags=$TAGS"
fi

tailscale set --auto-update

# Authenticate and bring Tailscale up
if [ -n "$AUTH_KEY" ]; then
    echo "Authenticating with Tailscale and enabling SSH..."
    # --ssh enables Tailscale SSH, replacing the previous SSH setup
    # --accept-dns=false prevents Tailscale from overriding the container's DNS settings
    # --hostname can be customized if needed, using a default here
    # --advertise-tags is required when using OAuth client auth keys
    tailscale up --authkey="$AUTH_KEY" --hostname="nexus-frontend" --ssh --accept-dns=false $TAGS_ARG
else
    echo "Warning: TAILSCALE_AUTHKEY or TAILSCALE_OAUTH credentials not found. Checking if already authenticated..."
    if tailscale status >/dev/null 2>&1; then
        echo "Tailscale is already authenticated. Ensuring SSH and tags are applied..."
        tailscale up --ssh --accept-dns=false $TAGS_ARG
    else
        echo "Tailscale is not authenticated. You may need to manually authenticate."
    fi
fi

# Show status to confirm it's working
echo "Current Tailscale status:"
tailscale status

echo "Tailscale setup script finished."
