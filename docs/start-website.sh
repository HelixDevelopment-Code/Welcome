#!/bin/bash

# HelixCode Website Startup Script
# This script starts the website using Podman

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Container configuration
CONTAINER_NAME="helixcode-website"
IMAGE_NAME="helixcode-website"
DEFAULT_PORT=8000

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1"
}

# Function to check if Podman is installed
check_podman() {
    if ! command -v podman >/dev/null 2>&1; then
        error "Podman is not installed!"
        error "Please run the installation script first:"
        error "  cd .. && ./install-podman.sh"
        exit 1
    fi
    log "Podman is installed: $(podman --version)"
}

# Function to check if Podman machine is running
check_podman_machine() {
    if ! podman machine list 2>/dev/null | grep -q "Running"; then
        warn "Podman machine is not running. Starting it now..."
        podman machine start
        sleep 5
        if ! podman machine list | grep -q "Running"; then
            error "Failed to start Podman machine"
            error "Please run: podman machine start"
            exit 1
        fi
        log "Podman machine started successfully"
    else
        log "Podman machine is running"
    fi
}

# Function to check if port is available
check_port() {
    local port=$1
    if lsof -i :$port >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

# Function to find next available port
find_available_port() {
    local start_port=${1:-8000}
    local port=$start_port

    while ! check_port $port; do
        warn "Port $port is already in use"
        port=$((port + 1))
        if [ $port -gt 65535 ]; then
            error "No available ports found in range $start_port-65535"
            exit 1
        fi
    done

    echo $port
}

# Function to stop existing container
stop_existing_container() {
    if podman ps -a --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        warn "Stopping existing container..."
        podman stop $CONTAINER_NAME >/dev/null 2>&1 || true
        podman rm $CONTAINER_NAME >/dev/null 2>&1 || true
        log "Existing container removed"
    fi
}

# Function to remove old image
remove_old_image() {
    if podman images --format "{{.Repository}}" | grep -q "^${IMAGE_NAME}$"; then
        info "Removing old image to ensure fresh build..."
        podman rmi $IMAGE_NAME >/dev/null 2>&1 || true
    fi
}

# Function to build latest version
build_latest_version() {
    log "Building latest version of HelixCode website..."

    # Build the Podman image (always fresh, no cache)
    log "Building container image (this may take a few minutes)..."
    if podman build --no-cache -t $IMAGE_NAME -f Containerfile .; then
        log "Container image built successfully"
    else
        error "Failed to build container image"
        exit 1
    fi
}

# Function to get local IP address
get_local_ip() {
    local ip
    if command -v ifconfig >/dev/null 2>&1; then
        ip=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -n1)
    else
        ip="localhost"
    fi

    if [ -z "$ip" ] || [ "$ip" = "127.0.0.1" ]; then
        ip="localhost"
    fi

    echo "$ip"
}

# Function to wait for container health
wait_for_health() {
    log "Waiting for website to become healthy..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if podman healthcheck run $CONTAINER_NAME >/dev/null 2>&1; then
            log "Website is healthy!"
            return 0
        fi

        if [ $attempt -eq $max_attempts ]; then
            warn "Website is taking longer than expected to start."
            info "Checking container status..."
            podman ps -a --filter name=$CONTAINER_NAME
            return 1
        fi

        sleep 2
        attempt=$((attempt + 1))
    done
}

# Main script
main() {
    log "Starting HelixCode Website with Podman..."
    echo

    # Check prerequisites
    check_podman
    check_podman_machine

    # Stop existing container
    stop_existing_container

    # Remove old image to ensure fresh build
    remove_old_image

    # Build latest version (always fresh)
    build_latest_version

    # Find available port
    WEBSITE_PORT=$(find_available_port $DEFAULT_PORT)

    if [ "$WEBSITE_PORT" != "$DEFAULT_PORT" ]; then
        warn "Default port $DEFAULT_PORT is occupied, using port $WEBSITE_PORT instead"
    fi

    # Create nginx-logs directory if it doesn't exist
    mkdir -p nginx-logs

    # Start the container
    log "Starting website on port $WEBSITE_PORT..."
    podman run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $WEBSITE_PORT:80 \
        -v "$(pwd)/nginx-logs:/var/log/nginx:z" \
        $IMAGE_NAME

    if [ $? -eq 0 ]; then
        # Wait for container to be healthy
        wait_for_health

        # Get local IP
        local ip=$(get_local_ip)

        # Save port to file for stop script
        echo $WEBSITE_PORT > .website-port

        # Display success message
        echo
        log "=========================================="
        log "🚀 HelixCode Website Started Successfully!"
        log "=========================================="
        info "Local URL:    http://localhost:$WEBSITE_PORT"
        info "Network URL:  http://$ip:$WEBSITE_PORT"
        info "Health Check: http://localhost:$WEBSITE_PORT/health"
        log "=========================================="
        echo
        info "Container Details:"
        podman ps --filter name=$CONTAINER_NAME
        echo
        info "To stop the website, run: ./stop-website.sh"
        info "To view logs, run: podman logs -f $CONTAINER_NAME"
        echo

        # Open browser if requested
        if [ "$1" = "--open" ] || [ "$2" = "--open" ]; then
            if command -v open >/dev/null 2>&1; then
                open "http://localhost:$WEBSITE_PORT"
            else
                warn "Could not automatically open browser. Please visit the URL above."
            fi
        fi

    else
        error "Failed to start website"
        podman logs $CONTAINER_NAME
        exit 1
    fi
}

# Handle signals
trap 'error "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
