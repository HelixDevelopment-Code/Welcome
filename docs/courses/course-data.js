/**
 * Course Data Management
 * Loads and manages course metadata
 */

class CourseDataManager {
    constructor() {
        this.courses = {};
        this.currentCourse = null;
        this.initializeSampleData();
    }

    initializeSampleData() {
        // Sample course data - in production, this would come from an API
        this.courses = {
            'intro-to-helixcode': {
                id: 'intro-to-helixcode',
                title: 'Introduction to HelixCode',
                description: 'Get started with HelixCode and learn the fundamentals of distributed AI development',
                instructor: 'HelixCode Team',
                duration: '2h 30m',
                level: 'beginner',
                chapters: [
                    {
                        id: 'ch1-welcome',
                        number: 1,
                        title: 'Welcome to HelixCode',
                        description: 'Learn what HelixCode is and what you can build with it',
                        duration: '15:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        transcript: [
                            { time: 0, text: 'Welcome to HelixCode! In this course, we\'ll explore the fundamentals of distributed AI development.' },
                            { time: 15, text: 'HelixCode is an enterprise-grade platform that enables intelligent task division and work preservation.' },
                            { time: 30, text: 'With support for 14+ AI providers, you can choose the best model for your specific task.' },
                            { time: 45, text: 'Let\'s dive into the key features that make HelixCode powerful.' }
                        ],
                        resources: [
                            { name: 'Course Overview (PDF)', url: '#' },
                            { name: 'Setup Checklist', url: '#' }
                        ]
                    },
                    {
                        id: 'ch2-installation',
                        number: 2,
                        title: 'Installation and Setup',
                        description: 'Set up your development environment and install HelixCode',
                        duration: '20:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        transcript: [
                            { time: 0, text: 'Let\'s get HelixCode installed on your system. We\'ll cover all major platforms.' },
                            { time: 20, text: 'First, make sure you have Go 1.24 or later installed on your system.' },
                            { time: 40, text: 'You can download HelixCode from the GitHub releases page or build from source.' },
                            { time: 60, text: 'After installation, we\'ll configure your first AI provider connection.' }
                        ],
                        resources: [
                            { name: 'Installation Guide (PDF)', url: '#' },
                            { name: 'Configuration Template', url: '#' }
                        ]
                    },
                    {
                        id: 'ch3-first-project',
                        number: 3,
                        title: 'Your First Project',
                        description: 'Create and run your first HelixCode project',
                        duration: '25:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        transcript: [
                            { time: 0, text: 'Now that we have HelixCode installed, let\'s create our first project.' },
                            { time: 18, text: 'We\'ll start with a simple code generation task using the CLI interface.' },
                            { time: 35, text: 'HelixCode makes it easy to interact with multiple AI providers through a unified interface.' },
                            { time: 52, text: 'Watch as we generate a complete REST API in just a few commands.' }
                        ],
                        resources: [
                            { name: 'Project Template', url: '#' },
                            { name: 'Code Examples', url: '#' }
                        ]
                    },
                    {
                        id: 'ch4-providers',
                        number: 4,
                        title: 'Understanding AI Providers',
                        description: 'Learn about different AI providers and when to use each',
                        duration: '30:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        transcript: [
                            { time: 0, text: 'HelixCode supports 14+ AI providers, each with unique strengths.' },
                            { time: 22, text: 'Claude excels at extended thinking and complex reasoning tasks.' },
                            { time: 44, text: 'Gemini offers massive 2M token context windows for entire codebases.' },
                            { time: 66, text: 'Groq provides ultra-fast inference with 500+ tokens per second.' }
                        ],
                        resources: [
                            { name: 'Provider Comparison Guide', url: '#' },
                            { name: 'API Key Setup Instructions', url: '#' }
                        ]
                    },
                    {
                        id: 'ch5-distributed',
                        number: 5,
                        title: 'Distributed Computing',
                        description: 'Set up and manage distributed worker pools',
                        duration: '35:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        transcript: [
                            { time: 0, text: 'One of HelixCode\'s most powerful features is its distributed computing capability.' },
                            { time: 25, text: 'You can easily add SSH workers to scale your development workflow.' },
                            { time: 50, text: 'HelixCode automatically installs the necessary binaries on remote workers.' },
                            { time: 75, text: 'Let\'s see how to configure a worker pool and distribute tasks.' }
                        ],
                        resources: [
                            { name: 'SSH Worker Setup Guide', url: '#' },
                            { name: 'Security Best Practices', url: '#' }
                        ]
                    },
                    {
                        id: 'ch6-workflows',
                        number: 6,
                        title: 'Automated Workflows',
                        description: 'Create intelligent workflows for planning, building, and testing',
                        duration: '40:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        transcript: [
                            { time: 0, text: 'Workflows in HelixCode automate complex development tasks.' },
                            { time: 28, text: 'Planning mode analyzes requirements and creates technical specifications.' },
                            { time: 56, text: 'Building mode generates code with proper dependency management.' },
                            { time: 84, text: 'Testing mode creates and runs comprehensive test suites.' }
                        ],
                        resources: [
                            { name: 'Workflow Examples', url: '#' },
                            { name: 'Custom Workflow Guide', url: '#' }
                        ]
                    }
                ]
            },
            'advanced-features': {
                id: 'advanced-features',
                title: 'Advanced HelixCode Features',
                description: 'Deep dive into advanced features like MCP protocol, mobile clients, and custom integrations',
                instructor: 'HelixCode Team',
                duration: '3h 15m',
                level: 'advanced',
                chapters: [
                    {
                        id: 'ch1-mcp-protocol',
                        number: 1,
                        title: 'Model Context Protocol (MCP)',
                        description: 'Understanding and implementing MCP in your applications',
                        duration: '45:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        transcript: [
                            { time: 0, text: 'The Model Context Protocol enables powerful integration with AI models.' },
                            { time: 30, text: 'HelixCode provides full MCP implementation with multiple transport options.' },
                            { time: 60, text: 'Let\'s explore stdio and SSE transports for different use cases.' }
                        ],
                        resources: [
                            { name: 'MCP Specification', url: '#' },
                            { name: 'Integration Examples', url: '#' }
                        ]
                    },
                    {
                        id: 'ch2-mobile-clients',
                        number: 2,
                        title: 'Building Mobile Clients',
                        description: 'Create iOS and Android apps with HelixCode',
                        duration: '50:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        transcript: [
                            { time: 0, text: 'HelixCode supports mobile development through gomobile bindings.' },
                            { time: 35, text: 'We\'ll build a simple iOS app that uses HelixCode for AI-powered features.' },
                            { time: 70, text: 'The same code can be compiled for Android with minimal changes.' }
                        ],
                        resources: [
                            { name: 'Mobile SDK Documentation', url: '#' },
                            { name: 'Sample App Source Code', url: '#' }
                        ]
                    },
                    {
                        id: 'ch3-custom-tools',
                        number: 3,
                        title: 'Creating Custom Tools',
                        description: 'Extend HelixCode with your own tools and integrations',
                        duration: '55:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        transcript: [
                            { time: 0, text: 'HelixCode\'s tool system is extensible and powerful.' },
                            { time: 40, text: 'You can create custom tools for domain-specific tasks.' },
                            { time: 80, text: 'Let\'s build a custom database migration tool from scratch.' }
                        ],
                        resources: [
                            { name: 'Tool Development Guide', url: '#' },
                            { name: 'API Reference', url: '#' }
                        ]
                    },
                    {
                        id: 'ch4-performance',
                        number: 4,
                        title: 'Performance Optimization',
                        description: 'Optimize your HelixCode deployment for maximum performance',
                        duration: '45:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        transcript: [
                            { time: 0, text: 'Performance tuning is critical for production deployments.' },
                            { time: 32, text: 'We\'ll cover caching strategies, connection pooling, and resource management.' },
                            { time: 64, text: 'Learn how to monitor and troubleshoot performance issues.' }
                        ],
                        resources: [
                            { name: 'Performance Tuning Guide', url: '#' },
                            { name: 'Monitoring Tools', url: '#' }
                        ]
                    }
                ]
            },
            'production-deployment': {
                id: 'production-deployment',
                title: 'Production Deployment',
                description: 'Deploy HelixCode to production environments with confidence',
                instructor: 'HelixCode Team',
                duration: '2h 45m',
                level: 'intermediate',
                chapters: [
                    {
                        id: 'ch1-architecture',
                        number: 1,
                        title: 'Production Architecture',
                        description: 'Design scalable and reliable production architectures',
                        duration: '40:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        transcript: [
                            { time: 0, text: 'Planning your production architecture is the first step to success.' },
                            { time: 28, text: 'We\'ll cover load balancing, high availability, and disaster recovery.' },
                            { time: 56, text: 'Learn about database replication and caching strategies.' }
                        ],
                        resources: [
                            { name: 'Architecture Diagrams', url: '#' },
                            { name: 'Infrastructure Templates', url: '#' }
                        ]
                    },
                    {
                        id: 'ch2-docker-kubernetes',
                        number: 2,
                        title: 'Docker and Kubernetes',
                        description: 'Containerize and orchestrate HelixCode with Kubernetes',
                        duration: '50:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        transcript: [
                            { time: 0, text: 'Containerization makes deployment consistent and reliable.' },
                            { time: 35, text: 'We\'ll create Docker images optimized for production.' },
                            { time: 70, text: 'Then deploy to Kubernetes with proper scaling and monitoring.' }
                        ],
                        resources: [
                            { name: 'Dockerfile Examples', url: '#' },
                            { name: 'Kubernetes Manifests', url: '#' }
                        ]
                    },
                    {
                        id: 'ch3-security',
                        number: 3,
                        title: 'Security Best Practices',
                        description: 'Secure your HelixCode deployment against common threats',
                        duration: '45:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        transcript: [
                            { time: 0, text: 'Security should never be an afterthought.' },
                            { time: 30, text: 'We\'ll implement authentication, authorization, and encryption.' },
                            { time: 60, text: 'Learn about rate limiting, input validation, and secure API keys.' }
                        ],
                        resources: [
                            { name: 'Security Checklist', url: '#' },
                            { name: 'Compliance Guide', url: '#' }
                        ]
                    },
                    {
                        id: 'ch4-monitoring',
                        number: 4,
                        title: 'Monitoring and Observability',
                        description: 'Set up comprehensive monitoring and alerting',
                        duration: '30:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        transcript: [
                            { time: 0, text: 'Monitoring gives you visibility into your system\'s health.' },
                            { time: 22, text: 'We\'ll integrate Prometheus, Grafana, and custom metrics.' },
                            { time: 44, text: 'Set up alerts for critical issues and track key performance indicators.' }
                        ],
                        resources: [
                            { name: 'Monitoring Setup Guide', url: '#' },
                            { name: 'Dashboard Templates', url: '#' }
                        ]
                    }
                ]
            },
            'phase3-advanced-features': {
                id: 'phase3-advanced-features',
                title: 'HelixCode Phase 3 - Advanced AI Development Features',
                description: 'Master advanced session management, memory systems, persistence, and template workflows',
                instructor: 'HelixCode Team',
                duration: '2h 00m',
                level: 'advanced',
                chapters: [
                    {
                        id: 'p3-ch1-overview',
                        number: 1,
                        title: 'Phase 3 Overview',
                        description: 'Introduction to Phase 3 features and architecture',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        transcript: [
                            { time: 0, text: 'Welcome to HelixCode Phase 3! In this course, we\'ll explore the advanced AI development features.' },
                            { time: 15, text: 'Phase 3 introduces four major systems: Session Management, Memory, Persistence, and Templates.' },
                            { time: 30, text: 'These systems work together to create a seamless AI development experience.' },
                            { time: 45, text: 'Let\'s dive into each system and see how they can transform your workflow.' }
                        ],
                        resources: [
                            { name: 'Phase 3 Architecture Overview', url: '#' },
                            { name: 'Feature Comparison Chart', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch2-getting-started',
                        number: 2,
                        title: 'Getting Started with Phase 3',
                        description: 'Installation, configuration, and first steps',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        transcript: [
                            { time: 0, text: 'Let\'s get started with HelixCode Phase 3 features.' },
                            { time: 15, text: 'First, we\'ll clone the repository and build the project.' },
                            { time: 30, text: 'Then we\'ll configure the basic settings for sessions, memory, and persistence.' },
                            { time: 45, text: 'By the end of this video, you\'ll have a working Phase 3 environment.' }
                        ],
                        resources: [
                            { name: 'Quick Start Guide', url: '#' },
                            { name: 'Configuration Template', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch3-session-fundamentals',
                        number: 3,
                        title: 'Session Fundamentals',
                        description: 'Creating and managing development sessions',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        transcript: [
                            { time: 0, text: 'Sessions are the foundation of HelixCode\'s workflow management.' },
                            { time: 20, text: 'Each session has a mode: planning, building, testing, refactoring, debugging, or deployment.' },
                            { time: 40, text: 'Sessions track progress, preserve context, and enable seamless transitions.' }
                        ],
                        resources: [
                            { name: 'Session Modes Reference', url: '#' },
                            { name: 'Code Examples', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch4-advanced-sessions',
                        number: 4,
                        title: 'Advanced Session Management',
                        description: 'Multi-project sessions, export/import, and statistics',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        transcript: [
                            { time: 0, text: 'Now let\'s explore advanced session management features.' },
                            { time: 20, text: 'You can manage sessions across multiple projects with callbacks and events.' },
                            { time: 40, text: 'Export sessions to JSON for backup and import them on any machine.' }
                        ],
                        resources: [
                            { name: 'Advanced Sessions Guide', url: '#' },
                            { name: 'Export/Import Examples', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch5-memory-basics',
                        number: 5,
                        title: 'Memory System Basics',
                        description: 'Conversation tracking and context management',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        transcript: [
                            { time: 0, text: 'The memory system powers conversation tracking in HelixCode.' },
                            { time: 20, text: 'It supports multiple message types: system, user, assistant, and tool messages.' },
                            { time: 40, text: 'Each conversation can be linked to a session for complete context.' }
                        ],
                        resources: [
                            { name: 'Memory System Overview', url: '#' },
                            { name: 'Message Types Reference', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch6-advanced-memory',
                        number: 6,
                        title: 'Advanced Memory Features',
                        description: 'Token management, search, and optimization',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        transcript: [
                            { time: 0, text: 'Let\'s explore advanced memory features for production use.' },
                            { time: 20, text: 'Token limits prevent context overflow automatically.' },
                            { time: 40, text: 'Search across conversations to find specific discussions quickly.' }
                        ],
                        resources: [
                            { name: 'Token Management Guide', url: '#' },
                            { name: 'Search API Reference', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch7-persistence-basics',
                        number: 7,
                        title: 'Persistence Fundamentals',
                        description: 'Saving and loading state across sessions',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                        transcript: [
                            { time: 0, text: 'Persistence ensures your work is never lost.' },
                            { time: 20, text: 'HelixCode supports multiple formats: JSON, Compact, and GZIP.' },
                            { time: 40, text: 'Auto-save can be configured to protect against unexpected issues.' }
                        ],
                        resources: [
                            { name: 'Persistence Formats', url: '#' },
                            { name: 'Configuration Guide', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch8-advanced-persistence',
                        number: 8,
                        title: 'Advanced Persistence',
                        description: 'Backup strategies, migration, and recovery',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                        transcript: [
                            { time: 0, text: 'Advanced persistence features for enterprise reliability.' },
                            { time: 20, text: 'Create timestamped backups and implement rotation policies.' },
                            { time: 40, text: 'Migrate between formats and recover from any backup point.' }
                        ],
                        resources: [
                            { name: 'Backup Best Practices', url: '#' },
                            { name: 'Recovery Procedures', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch9-template-basics',
                        number: 9,
                        title: 'Template System Basics',
                        description: 'Creating and using code templates',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        transcript: [
                            { time: 0, text: 'Templates accelerate code generation with reusable patterns.' },
                            { time: 20, text: 'Create templates for HTTP handlers, database models, and tests.' },
                            { time: 40, text: 'Variables make templates dynamic and configurable.' }
                        ],
                        resources: [
                            { name: 'Template Syntax Guide', url: '#' },
                            { name: 'Built-in Templates', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch10-advanced-templates',
                        number: 10,
                        title: 'Advanced Templates',
                        description: 'Template composition, inheritance, and library management',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                        transcript: [
                            { time: 0, text: 'Advanced template features for complex code generation.' },
                            { time: 20, text: 'Compose templates and use inheritance for DRY principles.' },
                            { time: 40, text: 'Build and share template libraries across teams.' }
                        ],
                        resources: [
                            { name: 'Template Composition', url: '#' },
                            { name: 'Library Management', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch11-integration-patterns',
                        number: 11,
                        title: 'Integration Patterns',
                        description: 'Combining sessions, memory, persistence, and templates',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
                        transcript: [
                            { time: 0, text: 'Now let\'s see how all Phase 3 systems work together.' },
                            { time: 20, text: 'Sessions coordinate memory and templates for complete workflows.' },
                            { time: 40, text: 'Persistence ensures everything is saved and recoverable.' }
                        ],
                        resources: [
                            { name: 'Integration Guide', url: '#' },
                            { name: 'Pattern Examples', url: '#' }
                        ]
                    },
                    {
                        id: 'p3-ch12-advanced-workflows',
                        number: 12,
                        title: 'Advanced Workflows',
                        description: 'Building complete AI development pipelines',
                        duration: '10:00',
                        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
                        transcript: [
                            { time: 0, text: 'Let\'s build a complete AI development workflow.' },
                            { time: 20, text: 'From planning to deployment, we\'ll use all Phase 3 features.' },
                            { time: 40, text: 'This integrated approach maximizes productivity and code quality.' }
                        ],
                        resources: [
                            { name: 'Workflow Examples', url: '#' },
                            { name: 'Best Practices', url: '#' }
                        ]
                    }
                ]
            }
        };
    }

    async loadCourse(courseId) {
        // In production, this would fetch from an API
        // For now, just load from local data
        this.currentCourse = this.courses[courseId];
        return this.currentCourse;
    }

    getCurrentCourse() {
        return this.currentCourse;
    }

    getChapter(chapterId) {
        if (!this.currentCourse) return null;
        return this.currentCourse.chapters.find(ch => ch.id === chapterId);
    }

    getAllCourses() {
        return Object.values(this.courses);
    }

    getCourseById(courseId) {
        return this.courses[courseId];
    }

    searchCourses(query) {
        const lowerQuery = query.toLowerCase();
        return Object.values(this.courses).filter(course =>
            course.title.toLowerCase().includes(lowerQuery) ||
            course.description.toLowerCase().includes(lowerQuery)
        );
    }

    filterCoursesByLevel(level) {
        return Object.values(this.courses).filter(course => course.level === level);
    }

    getCourseStats(courseId) {
        const course = this.courses[courseId];
        if (!course) return null;

        return {
            totalChapters: course.chapters.length,
            totalDuration: course.duration,
            level: course.level,
            completedChapters: course.chapters.filter(ch =>
                ProgressTracker.isChapterComplete(ch.id)
            ).length
        };
    }
}

// Initialize global instance
const CourseData = new CourseDataManager();
