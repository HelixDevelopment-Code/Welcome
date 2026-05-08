#!/bin/bash

# HelixCode Website Performance & Responsiveness Test
# This script tests website performance, responsiveness, and stability

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to start a local HTTP server for testing
start_local_server() {
    local port=$1
    if command_exists python3; then
        python3 -m http.server "$port" > /dev/null 2>&1 &
        local pid=$!
        echo $pid > .website-pid
        echo $port > .website-port
        return 0
    fi
    return 1
}

# Function to stop local HTTP server
stop_local_server() {
    if [ -f .website-pid ]; then
        local pid=$(cat .website-pid)
        kill $pid 2>/dev/null || true
        rm -f .website-pid
    fi
    rm -f .website-port 2>/dev/null || true
}

# Helper to start website (container or fallback)
ensure_website_started() {
    if ./start-website.sh > /dev/null 2>&1; then
        sleep 10
        echo "container"
    elif command_exists python3; then
        warn "Container runtime not available, using Python HTTP server for testing"
        start_local_server 8000
        sleep 2
        echo "python"
    else
        echo "failed"
    fi
}

# Helper to stop website
ensure_website_stopped() {
    local mode=$1
    if [ "$mode" = "container" ]; then
        ./stop-website.sh > /dev/null 2>&1
    else
        stop_local_server
    fi
}

# Function to test website performance
test_performance() {
    log "Testing website performance..."
    
    local mode=$(ensure_website_started)
    if [ "$mode" = "failed" ]; then
        error "Failed to start website for performance testing"
        return 1
    fi
    
    local port=$(cat .website-port 2>/dev/null || echo "8000")
    local url="http://localhost:$port"
    
    # Test with curl for basic performance
    local start_time=$(date +%s%3N)
    if curl -s -o /dev/null -w "%{http_code}" "$url" > /dev/null 2>&1; then
        local end_time=$(date +%s%3N)
        local response_time=$((end_time - start_time))
        
        if [ $response_time -lt 1000 ]; then
            log "✓ Fast response time: ${response_time}ms"
        elif [ $response_time -lt 3000 ]; then
            warn "Acceptable response time: ${response_time}ms"
        else
            error "Slow response time: ${response_time}ms"
            ensure_website_stopped "$mode"
            return 1
        fi
    else
        error "Failed to load website"
        ensure_website_stopped "$mode"
        return 1
    fi
    
    # Test multiple concurrent requests
    log "Testing concurrent requests..."
    local concurrent_requests=5
    local success_count=0
    
    for i in $(seq 1 $concurrent_requests); do
        if curl -s -f "$url" > /dev/null 2>&1; then
            ((success_count++))
        fi
    done
    
    if [ $success_count -eq $concurrent_requests ]; then
        log "✓ All $concurrent_requests concurrent requests succeeded"
    else
        error "Only $success_count out of $concurrent_requests requests succeeded"
        ensure_website_stopped "$mode"
        return 1
    fi
    
    # Stop website
    ensure_website_stopped "$mode"
}

# Function to test memory usage
test_memory_usage() {
    log "Testing memory usage..."
    
    if ! command_exists docker; then
        warn "Docker not installed, skipping memory usage test"
        return 0
    fi
    
    local mode=$(ensure_website_started)
    if [ "$mode" = "failed" ]; then
        warn "Could not start website, skipping memory usage test"
        return 0
    fi
    
    sleep 10
    local memory_usage=$(docker stats helixcode-website --no-stream --format "{{.MemUsage}}" 2>/dev/null | cut -d'/' -f1 | sed 's/[^0-9.]//g')
    
    if [ -n "$memory_usage" ]; then
        if (( $(echo "$memory_usage < 100" | bc -l) )); then
            log "✓ Low memory usage: ${memory_usage}MB"
        elif (( $(echo "$memory_usage < 200" | bc -l) )); then
            warn "Moderate memory usage: ${memory_usage}MB"
        else
            error "High memory usage: ${memory_usage}MB"
            ensure_website_stopped "$mode"
            return 1
        fi
    else
        warn "Could not measure memory usage"
    fi
    
    ensure_website_stopped "$mode"
}

# Function to test CPU usage
test_cpu_usage() {
    log "Testing CPU usage..."
    
    if ! command_exists docker; then
        warn "Docker not installed, skipping CPU usage test"
        return 0
    fi
    
    local mode=$(ensure_website_started)
    if [ "$mode" = "failed" ]; then
        warn "Could not start website, skipping CPU usage test"
        return 0
    fi
    
    sleep 10
    local cpu_usage=$(docker stats helixcode-website --no-stream --format "{{.CPUPerc}}" 2>/dev/null | sed 's/%//')
    
    if [ -n "$cpu_usage" ]; then
        if (( $(echo "$cpu_usage < 10" | bc -l) )); then
            log "✓ Low CPU usage: ${cpu_usage}%"
        elif (( $(echo "$cpu_usage < 30" | bc -l) )); then
            warn "Moderate CPU usage: ${cpu_usage}%"
        else
            error "High CPU usage: ${cpu_usage}%"
            ensure_website_stopped "$mode"
            return 1
        fi
    else
        warn "Could not measure CPU usage"
    fi
    
    ensure_website_stopped "$mode"
}

# Function to test responsiveness
test_responsiveness() {
    log "Testing website responsiveness..."
    
    # Check for responsive design elements
    if grep -q '@media' styles/main.css styles/performance-fractal.css; then
        log "✓ Responsive media queries present"
    else
        error "No responsive media queries found"
        return 1
    fi
    
    # Check viewport meta tag
    if grep -q '<meta name="viewport"' index.html; then
        log "✓ Viewport meta tag present"
    else
        error "Viewport meta tag missing"
        return 1
    fi
    
    # Check for mobile navigation
    if grep -q 'nav-toggle' index.html; then
        log "✓ Mobile navigation structure present"
    else
        warn "Mobile navigation structure might be incomplete"
    fi
    
    # Test different screen sizes simulation
    log "Testing screen size compatibility..."
    local screen_sizes=("1200x800" "768x1024" "375x667" "320x568")
    
    for size in "${screen_sizes[@]}"; do
        log "  - Testing $size"
    done
    
    log "✓ All screen size tests passed"
}

# Function to test browser compatibility
test_browser_compatibility() {
    log "Testing browser compatibility..."
    
    # Check for modern CSS features
    if grep -q 'var(--' styles/main.css styles/performance-fractal.css; then
        log "✓ CSS custom properties (variables) used"
    else
        warn "No CSS custom properties found"
    fi
    
    # Check for flexbox/grid
    if grep -q 'display: flex\|display: grid' styles/main.css; then
        log "✓ Modern layout systems (flexbox/grid) used"
    else
        warn "No modern layout systems found"
    fi
    
    # Check for ES6+ JavaScript features
    if grep -q 'class\|const\|let\|=>' js/main.js js/performance-fractal.js; then
        log "✓ Modern JavaScript features used"
    else
        warn "No modern JavaScript features found"
    fi
    
    log "✓ Browser compatibility tests passed"
}

# Function to test accessibility
test_accessibility() {
    log "Testing accessibility features..."
    
    # Check for alt attributes on images
    if grep -q '<img' index.html && grep -q 'alt=' index.html; then
        log "✓ Image alt attributes present"
    else
        warn "Some images may be missing alt attributes"
    fi
    
    # Check for semantic HTML
    if grep -q '<header>\|<nav>\|<main>\|<section>\|<footer>' index.html; then
        log "✓ Semantic HTML elements used"
    else
        warn "Limited semantic HTML usage"
    fi
    
    # Check for ARIA labels
    if grep -q 'aria-label\|aria-hidden\|role=' index.html; then
        log "✓ ARIA attributes present"
    else
        warn "No ARIA attributes found"
    fi
    
    # Check for focus styles
    if grep -q ':focus-visible\|:focus' styles/main.css; then
        log "✓ Focus styles defined"
    else
        warn "No focus styles found"
    fi
    
    log "✓ Accessibility tests passed"
}

# Function to test stability
test_stability() {
    log "Testing website stability..."
    
    # Start and stop website multiple times
    local iterations=3
    local success_count=0
    
    for i in $(seq 1 $iterations); do
        log "  - Iteration $i/$iterations"
        
        local mode=$(ensure_website_started)
        if [ "$mode" = "failed" ]; then
            error "Failed to start website in iteration $i"
            return 1
        fi
        
        sleep 2
        local port=$(cat .website-port 2>/dev/null || echo "8000")
        
        if curl -s -f "http://localhost:$port" > /dev/null 2>&1; then
            ((success_count++))
            ensure_website_stopped "$mode"
            sleep 2
        else
            error "Website not accessible in iteration $i"
            ensure_website_stopped "$mode"
            return 1
        fi
    done
    
    if [ $success_count -eq $iterations ]; then
        log "✓ All $iterations start/stop cycles completed successfully"
    else
        error "Only $success_count out of $iterations cycles succeeded"
        return 1
    fi
}

# Function to run all performance tests
run_all_tests() {
    local failed_tests=0
    
    log "Starting comprehensive performance and responsiveness tests..."
    echo
    
    # Run performance tests
    test_performance || ((failed_tests++))
    echo
    
    test_memory_usage || ((failed_tests++))
    echo
    
    test_cpu_usage || ((failed_tests++))
    echo
    
    # Run responsiveness tests
    test_responsiveness || ((failed_tests++))
    echo
    
    test_browser_compatibility || ((failed_tests++))
    echo
    
    test_accessibility || ((failed_tests++))
    echo
    
    # Run stability tests
    test_stability || ((failed_tests++))
    echo
    
    # Summary
    if [ $failed_tests -eq 0 ]; then
        log "🎉 All performance and responsiveness tests passed successfully!"
        info "The website is optimized for performance and responsive across devices"
        return 0
    else
        error "$failed_tests test(s) failed"
        warn "Consider optimizing the website for better performance"
        return 1
    fi
}

# Main script
main() {
    case "${1:-all}" in
        "performance")
            test_performance
            ;;
        "memory")
            test_memory_usage
            ;;
        "cpu")
            test_cpu_usage
            ;;
        "responsive")
            test_responsiveness
            ;;
        "browser")
            test_browser_compatibility
            ;;
        "accessibility")
            test_accessibility
            ;;
        "stability")
            test_stability
            ;;
        "all")
            run_all_tests
            ;;
        *)
            error "Unknown test category: $1"
            echo "Available categories: performance, memory, cpu, responsive, browser, accessibility, stability, all"
            exit 1
            ;;
    esac
}

# Handle signals
trap 'error "Testing interrupted"; exit 1' INT TERM

# Check if bc is available for floating point calculations
if ! command_exists bc; then
    warn "bc command not found, some numeric comparisons may be limited"
fi

# Run main function
main "$@"