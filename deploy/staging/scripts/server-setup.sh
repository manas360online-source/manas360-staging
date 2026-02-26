#!/usr/bin/env bash
set -euo pipefail

# Ubuntu/Debian-based VPS setup script (Lightsail compatible)

sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release git

# Docker Engine
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker "$USER"

# App directory
sudo mkdir -p /opt/manas360
sudo chown -R "$USER":"$USER" /opt/manas360

echo "Re-login required for docker group membership."
