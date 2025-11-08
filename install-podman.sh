#!/bin/bash

# Podman Installation Script
# This script installs Podman and its dependencies on macOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running on macOS
check_os() {
    if [[ "$OSTYPE" != "darwin"* ]]; then
        error "This script is designed for macOS. For Linux, please use your package manager."
        error "For example: sudo apt install podman (Debian/Ubuntu) or sudo dnf install podman (Fedora/RHEL)"
        exit 1
    fi
    log "Running on macOS - proceeding with installation"
}

# Check if Homebrew is installed
check_homebrew() {
    if ! command -v brew &> /dev/null; then
        warn "Homebrew is not installed. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

        # Add Homebrew to PATH for the current session
        if [[ -f /opt/homebrew/bin/brew ]]; then
            eval "$(/opt/homebrew/bin/brew shellenv)"
        elif [[ -f /usr/local/bin/brew ]]; then
            eval "$(/usr/local/bin/brew shellenv)"
        fi

        if ! command -v brew &> /dev/null; then
            error "Failed to install Homebrew. Please install it manually from https://brew.sh"
            exit 1
        fi
        log "Homebrew installed successfully"
    else
        log "Homebrew is already installed"
    fi
}

# Check if Podman is already installed
check_podman() {
    if command -v podman &> /dev/null; then
        local version=$(podman --version)
        warn "Podman is already installed: $version"
        read -p "Do you want to reinstall/update Podman? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "Skipping Podman installation"
            return 1
        fi
    fi
    return 0
}

# Install Podman
install_podman() {
    log "Installing Podman via Homebrew..."

    # Update Homebrew
    info "Updating Homebrew..."
    brew update

    # Install Podman
    info "Installing Podman..."
    brew install podman

    # Verify installation
    if ! command -v podman &> /dev/null; then
        error "Podman installation failed"
        exit 1
    fi

    local version=$(podman --version)
    log "Podman installed successfully: $version"
}

# Initialize Podman machine
initialize_podman_machine() {
    log "Initializing Podman machine..."

    # Check if machine already exists
    if podman machine list 2>/dev/null | grep -q "podman-machine-default"; then
        warn "Podman machine already exists"

        # Check if it's running
        if podman machine list | grep "podman-machine-default" | grep -q "Running"; then
            log "Podman machine is already running"
            return 0
        else
            warn "Podman machine exists but is not running. Starting it..."
            podman machine start
            log "Podman machine started successfully"
            return 0
        fi
    fi

    # Initialize new machine
    info "Creating new Podman machine..."
    podman machine init

    log "Podman machine initialized successfully"
}

# Start Podman machine
start_podman_machine() {
    log "Starting Podman machine..."

    # Check if already running
    if podman machine list 2>/dev/null | grep "podman-machine-default" | grep -q "Running"; then
        log "Podman machine is already running"
        return 0
    fi

    # Start the machine
    podman machine start

    # Wait for machine to be ready
    sleep 5

    # Verify machine is running
    if podman machine list | grep "podman-machine-default" | grep -q "Running"; then
        log "Podman machine started successfully"
    else
        error "Failed to start Podman machine"
        exit 1
    fi
}

# Test Podman installation
test_podman() {
    log "Testing Podman installation..."

    info "Running test container..."
    if podman run --rm hello-world >/dev/null 2>&1; then
        log "Podman is working correctly!"
    else
        warn "Podman test failed, but installation is complete. You may need to restart your terminal."
    fi
}

# Display completion message
display_completion() {
    echo
    log "================================================"
    log "✅ Podman Installation Complete!"
    log "================================================"
    info "Podman version: $(podman --version)"
    info "Podman machine status:"
    podman machine list
    log "================================================"
    echo
    info "You can now use Podman to run containers!"
    info "To start the website, run: cd docs && ./start-website.sh"
    echo
    info "Useful Podman commands:"
    info "  podman machine start    - Start Podman machine"
    info "  podman machine stop     - Stop Podman machine"
    info "  podman machine list     - List Podman machines"
    info "  podman ps               - List running containers"
    info "  podman images           - List images"
    echo
}

# Main installation flow
main() {
    echo
    log "================================================"
    log "🚀 Podman Installation Script for macOS"
    log "================================================"
    echo

    check_os
    check_homebrew

    if check_podman; then
        install_podman
    fi

    initialize_podman_machine
    start_podman_machine
    test_podman
    display_completion
}

# Handle script interruption
trap 'error "Installation interrupted"; exit 1' INT TERM

# Run main function
main "$@"
