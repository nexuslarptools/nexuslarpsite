#!/bin/sh

# Generate host keys if they don't exist
# This is important for Alpine as it doesn't generate them on installation
ssh-keygen -A

# Ensure /var/run/sshd exists (required by sshd)
mkdir -p /var/run/sshd

# Start SSH daemon if not already running
# We check for the pid file or process to avoid double-starting
if ! pgrep -x sshd > /dev/null 2>&1; then
    echo "Starting SSH daemon..."
    /usr/sbin/sshd
else
    echo "SSH daemon is already running."
fi
