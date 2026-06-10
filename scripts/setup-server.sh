#!/bin/bash
# =============================================================
# Server Setup Script for annam.id.vn
# Run this on your DigitalOcean Droplet (Ubuntu 22.04/24.04)
# Usage: chmod +x setup-server.sh && sudo ./setup-server.sh
# =============================================================

set -euo pipefail

echo "🚀 Setting up server for annam.id.vn..."

# Update system
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose (v2 plugin)
echo "🐳 Checking Docker Compose..."
if docker compose version &> /dev/null; then
    echo "✅ Docker Compose already available"
else
    apt-get install -y docker-compose-plugin
    echo "✅ Docker Compose installed"
fi

# Create project directory
echo "📁 Creating project directory..."
mkdir -p /opt/annam-id-vn/docker/nginx/conf.d
mkdir -p /opt/annam-id-vn/docker/certbot/conf
mkdir -p /opt/annam-id-vn/docker/certbot/www

# Setup firewall
echo "🔥 Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Setup swap (for low-memory droplets)
echo "💾 Setting up swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "✅ 1GB swap created"
else
    echo "✅ Swap already exists"
fi

# Setup SSL certificate (initial)
echo "🔒 Setting up SSL certificate..."
echo "Run the following command after DNS is pointed to this server:"
echo ""
echo "  docker run -it --rm \\"
echo "    -v /opt/annam-id-vn/docker/certbot/conf:/etc/letsencrypt \\"
echo "    -v /opt/annam-id-vn/docker/certbot/www:/var/www/certbot \\"
echo "    certbot/certbot certonly --standalone \\"
echo "    -d annam.id.vn -d www.annam.id.vn \\"
echo "    --email annamnguyen204@gmail.com \\"
echo "    --agree-tos --non-interactive"
echo ""

# Setup auto-renewal cron
echo "⏰ Setting up SSL auto-renewal..."
cat > /etc/cron.d/certbot-renew << 'EOF'
0 3 * * * root docker run --rm -v /opt/annam-id-vn/docker/certbot/conf:/etc/letsencrypt -v /opt/annam-id-vn/docker/certbot/www:/var/www/certbot certbot/certbot renew --quiet && docker exec annam-nginx nginx -s reload
EOF

echo ""
echo "============================================="
echo "✅ Server setup complete!"
echo "============================================="
echo ""
echo "Next steps:"
echo "1. Point DNS (annam.id.vn) to this server IP"
echo "2. Run the SSL certificate command above"
echo "3. Clone/copy project to /opt/annam-id-vn"
echo "4. cd /opt/annam-id-vn && docker compose -f docker/docker-compose.yml up -d"
echo ""
echo "GitHub Secrets needed:"
echo "  SSH_HOST     = $(curl -s ifconfig.me)"
echo "  SSH_USER     = root"
echo "  SSH_PRIVATE_KEY = (your private key)"
echo ""
