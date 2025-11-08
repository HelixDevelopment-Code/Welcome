#!/bin/bash

# HelixCode Website Stop Script
# This script stops the website and cleans up resources

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
        exit 1
    fi
}

# Function to check if website is running
is_website_running() {
    if podman ps --format "{{.Names}}" | grep -q "^${CONTAINER_NAME}$"; then
        return 0
    else
        return 1
    fi
}

# Function to get current port
get_current_port() {
    if [ -f .website-port ]; then
        cat .website-port 2>/dev/null || echo "8000"
    else
        echo "8000"
    fi
}

# Function to stop container
stop_container() {
    log "Stopping container..."
    if podman stop $CONTAINER_NAME 2>/dev/null; then
        log "Container stopped successfully"
    else
        warn "Container may have already been stopped"
    fi
}

# Function to remove container
remove_container() {
    log "Removing container..."
    if podman rm $CONTAINER_NAME 2>/dev/null; then
        log "Container removed successfully"
    else
        warn "Container may have already been removed"
    fi
}

# Function to cleanup resources
cleanup_resources() {
    log "Cleaning up resources..."

    # Remove dangling containers with the same name
    local dangling_containers=$(podman ps -aq --filter name=$CONTAINER_NAME 2>/dev/null)
    if [ -n "$dangling_containers" ]; then
        info "Removing dangling containers..."
        podman rm -f $dangling_containers 2>/dev/null || true
    fi

    # Optionally remove the image (commented out by default to speed up next start)
    # Uncomment if you want to remove the image as well
    # if podman images --format "{{.Repository}}" | grep -q "^${IMAGE_NAME}$"; then
    #     info "Removing image..."
    #     podman rmi $IMAGE_NAME 2>/dev/null || true
    # fi

    # Remove port file
    if [ -f .website-port ]; then
        rm .website-port
    fi

    # Remove temporary files
    if [ -f .website-port.tmp ]; then
        rm -f .website-port.tmp
    fi
}

# Function to prune unused resources
prune_resources() {
    info "Pruning unused Podman resources..."

    # Remove unused containers
    podman container prune -f 2>/dev/null || true

    # Remove unused images (optional - commented out)
    # podman image prune -f 2>/dev/null || true
}

# Main script
main() {
    log "Stopping HelixCode Website..."
    echo

    # Check if Podman is installed
    check_podman

    # Check if website is running
    if ! is_website_running; then
        warn "Website is not currently running"
        cleanup_resources
        echo
        info "To start the website, run: ./start-website.sh"
        echo
        exit 0
    fi

    # Get current port for display
    local current_port=$(get_current_port)

    # Stop the container
    stop_container

    # Remove the container
    remove_container

    # Clean up resources
    cleanup_resources

    # Prune unused resources
    prune_resources

    # Display success message
    echo
    log "========================================"
    log "🛑 HelixCode Website Stopped Successfully!"
    log "========================================"
    info "Website was running on port: $current_port"
    info "All resources have been cleaned up"
    log "========================================"
    echo
    info "To start the website again, run: ./start-website.sh"
    echo
}

# Handle cleanup on script exit
cleanup_on_exit() {
    # Remove any temporary files
    if [ -f .website-port.tmp ]; then
        rm -f .website-port.tmp
    fi
}

trap cleanup_on_exit EXIT

# Run main function
main "$@"
