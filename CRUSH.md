# CRUSH.md - HelixCode GitHub Pages Website

This document contains essential information for agents working with the HelixCode GitHub Pages website.

## Project Overview

This is a static website for HelixCode - a distributed AI development platform. The site is built with vanilla HTML, CSS, and JavaScript, deployed via GitHub Pages, and includes Docker for local development.

## Project Structure

```
docs/                           # Main website directory
├── index.html                  # Single-page application
├── package.json                # Node.js configuration and scripts
├── docker-compose.yml          # Docker development environment
├── Dockerfile                  # Multi-stage Docker build
├── nginx.conf                  # Nginx configuration
├── start-website.sh            # Startup script (Docker)
├── stop-website.sh             # Stop script (Docker)
├── test-website.sh             # Comprehensive test suite
├── test-local.sh               # Local functionality tests
├── test-performance.sh          # Performance benchmarks
├── assets/
│   └── logo.png                # HelixCode logo
├── styles/
│   ├── main.css                # Primary styles with CSS variables
│   ├── performance-fractal.css # Performance fractal animations
│   ├── fractal.css             # Fractal visualizations
│   └── wave-fractal.css        # Wave animations
└── js/
    ├── main.js                 # Core functionality and theme management
    ├── performance-fractal.js  # Performance fractal logic
    ├── fractal.js              # Fractal generation
    └── wave-fractal.js         # Wave animation logic

Upstreams/
└── GitHub.sh                   # Upstream repository configuration
```

## Essential Commands

### Development

```bash
# Start website with Docker (recommended)
cd docs && ./start-website.sh

# Stop website
cd docs && ./stop-website.sh

# Start with Python (alternative)
cd docs && python3 -m http.server 8000

# View Docker logs
cd docs && docker-compose logs -f

# Check container status
cd docs && docker-compose ps
```

### Testing

```bash
# Full website test suite
cd docs && ./test-website.sh

# Specific test categories
cd docs && ./test-website.sh html      # HTML validation
cd docs && ./test-website.sh css       # CSS validation
cd docs && ./test-website.sh js        # JavaScript linting
cd docs && ./test-website.sh docker    # Docker configuration
cd docs && ./test-website.sh functionality  # Functionality tests

# Performance testing
cd docs && ./test-performance.sh

# Local testing
cd docs && ./test-local.sh
```

### Package Scripts

```bash
cd docs

npm start          # Alias for ./start-website.sh
npm stop           # Alias for ./stop-website.sh
npm test           # Alias for ./test-website.sh
npm run test:html  # HTML validation only
npm run test:css   # CSS validation only
npm run test:js    # JavaScript validation only
npm run build      # Build Docker image (--no-cache)
npm run dev        # Python HTTP server on port 8000
npm run logs       # Docker compose logs -f
npm run status     # Docker compose ps
```

## Code Conventions & Patterns

### HTML Structure
- Single-page application with semantic HTML5
- Section-based navigation with smooth scrolling
- ARIA labels for accessibility
- Data attributes for theme management (`data-theme="auto|light|dark"`)

### CSS Architecture
- CSS custom properties (variables) for theming
- Mobile-first responsive design
- Component-based class naming
- Dark mode support with automatic system preference detection
- CSS animations and fractal visualizations

### JavaScript Patterns
- ES6+ class-based organization
- Modular file structure (theme manager, fractals, etc.)
- Event delegation for performance
- LocalStorage for user preferences
- Toast notification system

### Theme System
Three modes: auto, light, dark
- Auto: Follows system preference with manual override
- Light/Dark: Manual selection
- Persistent across sessions via localStorage

## Key Features

### Website Sections
1. **Hero** - Main landing with CTA
2. **Features** - 18 new features across 3 categories
3. **Integrations** - 14+ AI providers and communication tools
4. **Tools** - Development tools and workflows
5. **Advanced** - Advanced features (snapshots, autonomy modes)
6. **Specialized** - Aurora OS & Harmony OS platforms
7. **Testing** - E2E testing framework documentation
8. **Platforms** - Supported platforms and devices
9. **Download** - Get started section

### Interactive Elements
- Smooth scroll navigation
- Theme toggle with visual feedback
- Toast notifications for user actions
- Fractal animations (performance, wave, standard)
- Responsive mobile menu

## Development Workflow

### Local Development
1. Use Docker for production-like environment
2. Scripts handle port conflicts automatically
3. Health checks ensure service availability
4. Comprehensive test suite validates changes

### Testing Approach
- **HTML**: Structure validation with html5validator
- **CSS**: Linting with stylelint
- **JavaScript**: ESLint for code quality
- **Docker**: Configuration validation
- **Functionality**: Interactive behavior testing
- **Performance**: Load time and animation performance

### Deployment
- GitHub Pages automatic deployment from main branch
- No build process required (static files)
- Docker used only for local development

## Docker Configuration

### Services
- **helixcode-website**: Nginx-based container
- Port: 8000 (auto-detects conflicts)
- Health check: `/health` endpoint
- Volumes: Logs and health check files

### Build Process
- Multi-stage Dockerfile
- Node.js build stage (for future tooling)
- Nginx production stage with Alpine Linux
- Custom nginx configuration

## Important Gotchas

### Port Management
- Default port 8000, automatically finds alternative if occupied
- Scripts handle port conflicts gracefully
- Health checks ensure service is ready before exposing URLs

### Theme Persistence
- Theme preference stored in localStorage
- System preference changes trigger automatic updates in auto mode
- Manual theme changes override system preference

### Testing Dependencies
- Some tests require external tools (html5validator, stylelint, eslint)
- Install with: `npm install -g html5validator stylelint eslint`
- Tests continue without tools, just report warnings

### File Organization
- All website content lives in `docs/` directory
- Scripts must be run from `docs/` directory
- Relative paths used throughout for portability

## Performance Optimization

- CSS containment for rendering optimization
- Lazy loading considerations for images
- Efficient DOM manipulation with event delegation
- Optimized fonts loading with preconnect
- Minification handled by build process when needed

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions) 
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Tasks

### Adding New Features
1. Update `index.html` content sections
2. Add styles to appropriate CSS file in `styles/`
3. Implement JavaScript in `js/main.js` or separate module
4. Update navigation if adding major sections
5. Test with `./test-website.sh`

### Updating Statistics
1. Modify download section stats in `index.html`
2. Update package.json version if needed
3. Update README.md version history
4. Test all sections with comprehensive test suite

### Styling Changes
1. Use CSS custom properties for theming consistency
2. Maintain mobile-first responsive approach
3. Test in both light and dark themes
4. Validate with `./test-website.sh css`

### Docker Updates
1. Modify `docker-compose.yml` for service changes
2. Update `Dockerfile` for build process changes
3. Test with `./test-website.sh docker`
4. Rebuild with `npm run build` after changes

## Contact & Resources

- **Main Repository**: https://github.com/helixcode/helixcode
- **Documentation**: https://github.com/helixcode/helixcode/blob/main/docs/USER_GUIDE.md
- **Issues**: https://github.com/helixcode/helixcode/issues
- **Website**: https://helixcode.github.io/