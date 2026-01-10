#!/bin/sh

# Generate host keys if they don't exist
ssh-keygen -A

# Ensure /var/run/sshd exists (required by some versions of sshd)
mkdir -p /var/run/sshd

# Start SSH daemon
# By default, it runs in the background
/usr/sbin/sshd
