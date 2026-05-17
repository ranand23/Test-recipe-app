#!/bin/bash

set -e

# ============================================
# CONFIGURATION - UPDATE THESE VALUES
# ============================================
AWS_ACCOUNT_ID="YOUR_AWS_ACCOUNT_ID"        # Replace with your AWS account ID
AWS_REGION="us-east-1"                       # Replace with your AWS region
ECR_REPO_NAME="recipe-app"                   # ECR repository name

# ECR full URL
ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🐳 Recipe App - Multi-Architecture Docker Build & Push${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Get commit SHA
COMMIT_SHA=$(git rev-parse --short HEAD)
echo -e "${YELLOW}📦 Commit SHA: ${COMMIT_SHA}${NC}"
echo -e "${YELLOW}🖥️  Architectures: linux/amd64, linux/arm64${NC}"
echo -e "${YELLOW}📤 ECR Destination: ${ECR_URL}${NC}"
echo ""

# Check if Docker Buildx is available
if ! docker buildx version &> /dev/null; then
    echo "❌ Docker Buildx not found. Installing..."
    mkdir -p ~/.docker/cli-plugins
    curl -sL https://github.com/docker/buildx/releases/download/v0.12.0/buildx-v0.12.0.linux-amd64 -o ~/.docker/cli-plugins/docker-buildx
    chmod +x ~/.docker/cli-plugins/docker-buildx
fi

# Create or use existing buildx builder
echo -e "${YELLOW}🔧 Setting up Docker Buildx builder...${NC}"
if docker buildx inspect multi-arch-builder &> /dev/null; then
    docker buildx use multi-arch-builder
else
    docker buildx create --name multi-arch-builder --use --platform linux/amd64,linux/arm64
fi
docker buildx inspect --bootstrap
echo ""

# Login to ECR
echo -e "${YELLOW}🔐 Logging into Amazon ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
echo ""

# Build and push multi-architecture image with commit SHA tag
echo -e "${YELLOW}🏗️  Building and pushing multi-architecture image...${NC}"
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag ${ECR_URL}:${COMMIT_SHA} \
    --tag ${ECR_URL}:latest \
    --provenance=true \
    --push \
    .

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Successfully built and pushed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📦 Images pushed:${NC}"
echo -e "   • ${ECR_URL}:${COMMIT_SHA}"
echo -e "   • ${ECR_URL}:latest"
echo ""
echo -e "${YELLOW}🔍 Verify with:${NC}"
echo -e "   docker buildx imagetools inspect ${ECR_URL}:latest"
echo ""
echo -e "${YELLOW}🚀 Pull and run:${NC}"
echo -e "   docker pull ${ECR_URL}:${COMMIT_SHA}"
echo -e "   docker run -p 3000:3000 ${ECR_URL}:${COMMIT_SHA}"
