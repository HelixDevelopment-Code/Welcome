## INHERITED FROM Helix Constitution

This module is a submodule of a Helix-family project (e.g.
HelixCode, HelixAgent, ATMOSphere) that includes the Helix
Constitution submodule at the parent's `constitution/` path. All
rules in `constitution/CLAUDE.md` and the
`constitution/Constitution.md` it references (universal anti-bluff
covenant §11.4, no-guessing mandate §11.4.6, credentials-handling
mandate §11.4.10, host-session safety §12, data safety §9, mutation-
paired gates §1.1) apply unconditionally to every change landed here.
The module-specific rules below extend them — they never weaken any
universal clause.

When this file disagrees with the constitution submodule, the
constitution wins. Locate the constitution submodule from any
arbitrary nested depth using its `find_constitution.sh` helper.

Canonical reference: <https://github.com/HelixDevelopment/HelixConstitution>

---

# CLAUDE.md - HelixCode AI Agent Manual

## HelixCode - AI Agent Operating Manual

**Version**: 1.0.0
**Date**: 2026-04-30
**Scope**: This document guides AI agents working on the HelixCode codebase
**Authority**: Cascaded from HelixAgent root `CLAUDE.md` with HelixCode-specific addenda

---

## 1. Agent Identity & Purpose

You are an AI agent working on **HelixCode**, an enterprise-grade distributed AI development platform. Your work directly impacts the quality and usability of a production system.

**Your mandate**: Write real, working, tested code. No simulations. No placeholders. No "for now" implementations. Every feature you implement MUST actually work when a user invokes it.

---

## 2. Universal Mandatory Rules (Non-Negotiable)

These rules cascade from the HelixCode Constitution. They are permanent and apply to every task.

### Rule 1: No CI/CD Pipelines
No `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `.travis.yml`, `.circleci/`, or any automated pipeline. All builds and tests run manually or via Makefile/script targets.

### Rule 2: No Mocks in Production
Mocks, stubs, fakes, placeholder classes, TODO implementations are STRICTLY FORBIDDEN in production code. Only unit tests may use mocks.

### Rule 3: No HTTPS for Git
SSH URLs only (`git@github.com:…`) for all Git operations.

### Rule 4: No Manual Container Commands
Use the orchestrator binary (`make build` → `./bin/<app>`). Direct `docker`/`docker-compose` commands are prohibited as workflows.

### Rule 5: Real Data for Non-Unit Tests
All integration, E2E, and challenge tests MUST use real infrastructure (real databases, real HTTP calls, real containers).

### Rule 6: 100% Challenge Coverage
Every component MUST have Challenge scripts validating real-life use cases.

### Rule 7: Reproduction-Before-Fix
Every bug MUST be reproduced by a Challenge script BEFORE any fix is attempted.

### Rule 8: Definition of Done
A change is NOT done because code compiles. "Done" requires pasted terminal output from a real run against real artifacts.

### Rule 9: No Self-Certification
Words like *verified, tested, working, complete, fixed, passing* are forbidden unless accompanied by pasted command output from that session.

### Rule 10: Zero-Bluff Mandate (CONST-035)
A passing test is a claim that the feature **works for the end user**. Every test must guarantee Quality + Completion + Full Usability. Any test that doesn't certify all three is a bluff and must be tightened.

---

## 3. HelixCode-Specific Architecture

### 3.1 Technology Stack
- **Language**: Go 1.24.0 with toolchain go1.24.9
- **Module**: `dev.helix.code`
- **HTTP Framework**: Gin v1.11.0
- **Database**: PostgreSQL 15+ (optional for testing)
- **Cache**: Redis 7+ (optional)
- **Authentication**: JWT v4.5.2 + bcrypt/argon2
- **Configuration**: Viper v1.21.0
- **CLI**: Cobra v1.8.0
- **Testing**: Testify v1.11.1

### 3.2 Directory Structure
```
HelixCode/
├── cmd/
│   ├── server/         # HTTP server entry point
│   ├── cli/            # CLI client entry point
│   └── security-test/  # Security testing tools
├── internal/
│   ├── auth/           # JWT authentication (VERIFIED REAL)
│   ├── llm/            # LLM providers (CRITICAL BLUFF AREA - see below)
│   ├── worker/         # SSH worker pool (VERIFY BEFORE USING)
│   ├── task/           # Task management & checkpointing
│   ├── server/         # HTTP handlers & routing
│   ├── database/       # PostgreSQL layer
│   ├── redis/          # Redis client
│   ├── config/         # Viper configuration
│   ├── tools/          # Tool ecosystem
│   ├── editor/         # Multi-format code editing
│   ├── memory/         # Memory provider integration
│   ├── notification/   # Multi-channel notifications
│   ├── mcp/            # Model Context Protocol
│   ├── workflow/       # Workflow execution engine
│   ├── project/        # Project lifecycle
│   ├── session/        # Session management
│   ├── context/        # Context building
│   ├── agent/          # AI agent coordination
│   ├── hardware/       # Hardware detection
│   ├── monitoring/     # Metrics & health
│   ├── performance/    # Performance optimization
│   ├── security/       # Security management
│   └── version/        # Version management
├── applications/
│   ├── desktop/        # Fyne GUI
│   ├── terminal-ui/    # tview TUI
│   ├── ios/            # iOS (Swift bindings)
│   ├── android/        # Android (Kotlin)
│   ├── aurora-os/      # Aurora OS client
│   └── harmony-os/     # Harmony OS client
├── tests/
│   ├── e2e/challenges/ # E2E challenge framework
│   ├── integration/    # Integration tests
│   ├── unit/           # Unit tests
│   ├── security/       # Security tests
│   └── performance/    # Benchmarks
├── config/             # Configuration files
├── docker/             # Docker configurations
├── scripts/            # Build and utility scripts
└── go.mod              # Module definition
```

### 3.3 Critical Implementation Areas

#### BLUFF-001: LLM Generation is Simulated
**Location**: `cmd/cli/main.go` lines 190-214
**Status**: CRITICAL - MUST FIX IMMEDIATELY
**Code Pattern**:
```go
// ANTI-BLUFF: NEVER write code like this
// "For now, simulate generation"
// "In production, this would use the actual LLM provider"

// WRONG - SIMULATION:
response := fmt.Sprintf("Generated response for: %s\n\nThis is a simulated response...")

// CORRECT - REAL IMPLEMENTATION:
resp, err := c.llmProvider.Generate(ctx, req)
if err != nil {
    return fmt.Errorf("generation failed: %w", err)
}
fmt.Println(resp.Text)
```

**Agent Rule**: When implementing LLM-related code, you MUST make real HTTP calls to real providers. NEVER simulate responses.

#### BLUFF-002: Model Listing is Hardcoded
**Location**: `cmd/cli/main.go` lines 101-128
**Status**: CRITICAL
**Correct Pattern**:
```go
func (c *CLI) handleListModels(ctx context.Context) error {
    // Query ALL configured providers
    for name, provider := range c.providerManager.GetProviders() {
        models, err := provider.GetModels()
        if err != nil {
            log.Printf("Warning: failed to list models from %s: %v", name, err)
            continue
        }
        // Display real models
        for _, model := range models {
            fmt.Printf("%s/%s: %s (context: %d)\n", name, model.ID, model.Name, model.ContextSize)
        }
    }
    return nil
}
```

#### BLUFF-003: Command Execution is Simulated
**Location**: `cmd/cli/main.go` lines 237-250
**Status**: HIGH
**Correct Pattern**:
```go
func (c *CLI) handleCommand(ctx context.Context, command string) error {
    // ANTI-BLUFF: Actually execute the command
    cmd := exec.CommandContext(ctx, "sh", "-c", command)
    cmd.Dir = c.workingDirectory
    
    output, err := cmd.CombinedOutput()
    
    fmt.Printf("Exit code: %d\n", cmd.ProcessState.ExitCode())
    fmt.Printf("Output:\n%s\n", string(output))
    
    return err
}
```

---

## 4. Code Patterns for Agents

### 4.1 Interface-Driven Design
```go
// Define the contract
type Provider interface {
    Generate(ctx context.Context, req *GenerateRequest) (*GenerateResponse, error)
    GetModels() ([]Model, error)
    HealthCheck(ctx context.Context) error
}

// Implement with REAL behavior
type OllamaProvider struct { ... }
func (p *OllamaProvider) Generate(ctx context.Context, req *GenerateRequest) (*GenerateResponse, error) {
    // Make REAL HTTP call
    // NO simulation
}
```

### 4.2 Manager Pattern
```go
type TaskManager struct {
    db     TaskRepository
    mu     sync.RWMutex
    tasks  map[uuid.UUID]*Task
}

func (m *TaskManager) Create(ctx context.Context, task *Task) error {
    m.mu.Lock()
    defer m.mu.Unlock()
    
    // Persist to REAL database
    if err := m.db.Save(ctx, task); err != nil {
        return fmt.Errorf("failed to save task: %w", err)
    }
    
    m.tasks[task.ID] = task
    return nil
}
```

### 4.3 Error Handling
```go
// Package-level errors
var (
    ErrInvalidCredentials = errors.New("invalid credentials")
    ErrTokenExpired       = errors.New("token expired")
)

// Contextual wrapping
func (s *Service) DoSomething(ctx context.Context) error {
    result, err := s.db.Query(ctx)
    if err != nil {
        return fmt.Errorf("failed to query database for user %s: %w", userID, err)
    }
    
    if err := s.process(result); err != nil {
        return fmt.Errorf("failed to process query result: %w", err)
    }
    
    return nil
}
```

### 4.4 Testing Pattern (Unit)
```go
func TestService_DoSomething(t *testing.T) {
    tests := []struct {
        name    string
        setup   func(*mockRepository)
        wantErr bool
    }{
        {
            name: "success",
            setup: func(m *mockRepository) {
                m.On("Query", mock.Anything).Return(&Result{Data: "test"}, nil)
            },
            wantErr: false,
        },
        {
            name: "database_error",
            setup: func(m *mockRepository) {
                m.On("Query", mock.Anything).Return(nil, errors.New("connection refused"))
            },
            wantErr: true,
        },
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            repo := new(mockRepository)
            tt.setup(repo)
            
            svc := NewService(repo)
            err := svc.DoSomething(context.Background())
            
            if tt.wantErr {
                require.Error(t, err)
            } else {
                require.NoError(t, err)
            }
            
            repo.AssertExpectations(t)
        })
    }
}
```

### 4.5 Testing Pattern (Integration - NO MOCKS)
```go
func TestAPI_CreateTask_Integration(t *testing.T) {
    if testing.Short() {
        t.Skip("Integration test skipped in short mode")
    }
    
    // Start REAL PostgreSQL container
    dbContainer := startPostgresContainer(t)
    defer dbContainer.Terminate(context.Background())
    
    // Connect to REAL database
    db := connectToPostgres(dbContainer)
    
    // Initialize REAL service
    taskMgr := task.NewManager(db)
    
    // ANTI-BLUFF: Test with REAL data
    task, err := taskMgr.Create(context.Background(), &task.Task{
        Title: "Integration Test Task",
    })
    
    require.NoError(t, err)
    require.NotZero(t, task.ID)
    
    // ANTI-BLUFF: Verify it REALLY exists in database
    persisted, err := taskMgr.Get(context.Background(), task.ID)
    require.NoError(t, err)
    require.Equal(t, "Integration Test Task", persisted.Title)
}
```

---

## 5. Anti-Bluff Checklist for Every Task

Before marking any task complete, verify:

- [ ] **No simulation**: Code doesn't contain "simulate", "for now", "TODO implement", "placeholder"
- [ ] **Real HTTP calls**: API clients make actual HTTP requests with real bodies
- [ ] **Real database operations**: Database code uses real queries, not in-memory maps (unless explicitly caching)
- [ ] **Real process execution**: Shell/command execution uses `os/exec`, not `fmt.Printf` + `time.Sleep`
- [ ] **Real file operations**: File tools use `os.ReadFile`/`os.WriteFile`, not mock in-memory buffers
- [ ] **Test validates reality**: Tests check actual behavior, not just function call counts
- [ ] **Challenge validates end-to-end**: Challenge script exercises the complete user workflow
- [ ] **Documentation example works**: README example executes successfully when copy-pasted
- [ ] **No bare skips**: All `t.Skip()` have `SKIP-OK: #<ticket>` markers
- [ ] **Evidence pasted**: Commit/PR contains actual terminal output from real execution

---

## 6. Common Anti-Patterns to Avoid

### ANTI-PATTERN 1: The Simulation Trap
```go
// WRONG
func Generate(prompt string) string {
    // For now, just return a simulated response
    return fmt.Sprintf("Generated: %s", prompt)
}

// CORRECT
func (p *Provider) Generate(ctx context.Context, req *GenerateRequest) (*GenerateResponse, error) {
    resp, err := p.client.Post(p.endpoint, req)
    if err != nil {
        return nil, fmt.Errorf("generation request failed: %w", err)
    }
    return parseResponse(resp)
}
```

### ANTI-PATTERN 2: The Hardcoded List
```go
// WRONG
func ListModels() []Model {
    return []Model{
        {"llama-3-8b", "Llama 3 8B"},
        {"mistral-7b", "Mistral 7B"},
    }
}

// CORRECT
func (p *Provider) GetModels() ([]Model, error) {
    resp, err := p.client.Get(p.baseURL + "/api/tags")
    if err != nil {
        return nil, err
    }
    return parseModelList(resp)
}
```

### ANTI-PATTERN 3: The Stub Interface
```go
// WRONG
type WorkerPool struct {}
func (p *WorkerPool) AddWorker(w *Worker) error {
    return nil  // TODO: implement
}

// CORRECT
func (p *SSHWorkerPool) AddWorker(ctx context.Context, w *SSHWorker) error {
    client, err := ssh.Dial("tcp", w.Host, w.SSHConfig)
    if err != nil {
        return fmt.Errorf("failed to connect to worker %s: %w", w.Host, err)
    }
    defer client.Close()
    
    // Verify worker has helix binary
    session, err := client.NewSession()
    if err != nil {
        return fmt.Errorf("failed to create SSH session: %w", err)
    }
    defer session.Close()
    
    // Actually test the worker
    output, err := session.Output("which helix || echo 'NOT_INSTALLED'")
    if strings.Contains(string(output), "NOT_INSTALLED") {
        // Auto-install
        if err := p.installWorker(ctx, client); err != nil {
            return fmt.Errorf("failed to install worker: %w", err)
        }
    }
    
    p.workers[w.Hostname] = w
    return nil
}
```

---

## 7. Working with Submodules

HelixCode has 80+ submodules. When working with them:

1. **Check governance**: Does the submodule have Constitution.md / CLAUDE.md / AGENTS.md?
2. **Add if missing**: Create governance files referencing parent
3. **Verify builds**: Does the submodule actually compile?
4. **Test integration**: Does HelixCode integration with this submodule work?

---

## 8. Emergency Procedures

### If You Discover a Bluff
1. STOP working on dependent features
2. Document the bluff in `docs/issues/BLUFFS.md`
3. Write a Challenge that reproduces the bluff
4. Fix the bluff
5. Verify the Challenge now passes
6. Update documentation to reflect reality

### If a Test Passes But Feature Doesn't Work
1. The test is a bluff - tighten it
2. Add assertions that verify actual output quality
3. Add anti-bluff checks (no "simulated" in responses)
4. Run the test against real infrastructure
5. Verify it FAILS with the broken code
6. Then fix the code

---

## 9. Reference Commands

```bash
# Build
make build

# Unit tests only (mocks allowed)
go test -short ./...

# Integration tests (NO MOCKS)
make integration-test

# All challenges
./tests/e2e/challenges/run_all_challenges.sh

# Verify no bluffs in code
grep -r "simulated\|for now\|TODO implement\|placeholder" internal/ cmd/ || echo "No bluffs found"

# Verify real LLM calls
curl -X POST http://localhost:8080/api/v1/llm/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What is 2+2?","model":"llama3.2"}'
# Should return actual AI-generated text, NOT "This is a simulated response"
```

---

## 10. LLMsVerifier Constitutional Mandates (CONST-036 through CONST-040)

### CONST-036: LLMsVerifier Single Source of Truth
LLMsVerifier is the sole authoritative source for model metadata, provider metadata, verification status, and scoring data. NO hardcoded model lists. NO simulated discovery.

### CONST-037: Model Provider Anti-Bluff Guarantee
Every model displayed to users MUST be verified by LLMsVerifier within 24h. Integration tests MUST use real verifier data, not mocks.

### CONST-038: Real-Time Model Status Accuracy
Model status MUST reflect verifier state within 60s. Poll interval ≤ 60s if push unavailable.

### CONST-039: All Providers Integration Mandate
HelixCode MUST integrate with all verifier-supported providers: OpenAI, Anthropic, Gemini, DeepSeek, Groq, Mistral, xAI, OpenRouter, Ollama, Llama.cpp.

### CONST-040: Capability Integration Mandate
MCP, LSP, ACP, Embedding, RAG, Skills, and Plugins capability flags MUST be sourced from verifier `VerificationResult`. NO hardcoded capability flags.

---

## 11. Contact & Escalation

- **Bluff reports**: `docs/issues/BLUFFS.md`
- **Bug fixes**: `docs/issues/fixed/BUGFIXES.md`
- **Architecture questions**: `docs/ARCHITECTURE.md`
- **Emergency**: Create a Challenge that reproduces the issue

---

*Remember: Your code will be used by real people. Write code that actually works.*

## Anti-Bluff and Quality Mandate

### Article XI §11.9 — Anti-Bluff Forensic Anchor

> Verbatim user mandate: "We had been in position that all tests do execute
> with success and all Challenges as well, but in reality the most of the
> features does not work and can't be used! This MUST NOT be the case and
> execution of tests and Challenges MUST guarantee the quality, the
> completion and full usability by end users of the product!"

**Operative rule:** Every PASS MUST carry positive runtime evidence.
No false-success results are tolerable.

**Bluff Taxonomy:** wrapper, contract, structural, comment, skip.

---

## CONST-047 — Recursive Submodule Application Mandate (cascaded from root CONSTITUTION.md)

> Verbatim user mandate (2026-05-14): *"Make sure all work we do is applied ALWAYS to all Submodules we control under our organizations (vasic-digital and HelixDevelopment) fully recursively everywhere with full bluff-proofing and comprehensive documentation, user manuals and guides and full tests and Challenges coverage!"*

Every engineering deliverable produced for the main project MUST be applied — fully and recursively — to every owned submodule under the `vasic-digital` and `HelixDevelopment` GitHub organizations. Each owned submodule (including this one) MUST receive in lockstep: (1) anti-bluff posture (CONST-035 / Article XI §11.9), (2) comprehensive documentation matching actual capabilities, (3) full tests + Challenges coverage with captured runtime evidence, (4) recursive propagation through nested submodules under the same orgs, (5) synchronized commits when meta-repo state advances this surface.

See the root `CONSTITUTION.md` §CONST-047 for the full mandate. This anchor MUST remain in this submodule's CONSTITUTION.md, CLAUDE.md, and AGENTS.md.
---

## CONST-048: Full-Automation-Coverage Mandate (cascaded from constitution submodule §11.4.25)

> Verbatim user mandate (2026-05-15): *"Make sure that every feature, every functionality, every flow, every use case, every edge case, every service or application, on every platform we support is covered with full automation tests which will confirm anti-bluff policy and provide the proof of fully working capabilities, working implementation as expected, no issues, no bugs, fully documented, tests covered! Nothing less than this does not give us a chance to deliver stable product! This is mandatory constraint which MUST BE respected without ignoring, skipping, slacking or forgetting it!"*

No feature / functionality / flow / use case / edge case / service / application on any supported platform of this submodule is deliverable until covered by automation tests proving six invariants: (1) anti-bluff posture with captured runtime evidence (CONST-035); (2) proof of working capability end-to-end on target topology; (3) implementation matching documented promise; (4) no open issues/bugs surfaced; (5) full documentation in sync; (6) four-layer test floor (pre-build + post-build + runtime + paired mutation).

**Cascade requirement:** This anchor (verbatim or by CONST-048 ID reference) MUST remain in this submodule's CONSTITUTION.md, CLAUDE.md, and AGENTS.md, and propagate recursively to any nested owned-by-us submodule. See parent project's `CONSTITUTION.md` §CONST-048 and constitution submodule `Constitution.md` §11.4.25 for the full mandate.
## CONST-049: Constitution-Submodule Update Workflow Mandate (cascaded from constitution submodule §11.4.26)

> Verbatim user mandate (2026-05-15): *"Every time we add something into our root (constitution Submodule) Constitution, CLAUDE.MD and AGENTS.MD we MUST FIRST fetch and pull all new changes / work from constitution Submodule first! All changes we apply MUST BE commited and pushed to all constitution Submodule upstreams! In case of conflict, IT MUST BE carefully resolved! Nothing can be broken, made faulty, corrupted or unusable! After merging full validation and verification MUST BE done!"*

Before ANY modification to `constitution/{Constitution,CLAUDE,AGENTS}.md` in the parent project, the agent or operator MUST execute the 7-step pipeline: (1) fetch + pull first inside the constitution submodule worktree; (2) apply the change with §11.4.17 classification + verbatim mandate quote; (3) validate (meta-test + no merge-conflict markers + cross-file consistency); (4) commit + push to EVERY configured upstream of the constitution submodule (governance files only — never `git add -A`); (5) careful conflict resolution preserving union of governance content (force-push forbidden per CONST-043 / §9.2); (6) post-merge `git submodule update --remote --init` + re-run cascade verifier (CONST-047); (7) bump consuming project's `.gitmodules` pointer to the new constitution HEAD in the SAME commit as cascade work.

**Cascade requirement:** This anchor (verbatim or by CONST-049 ID reference) MUST remain in this submodule's CONSTITUTION.md, CLAUDE.md, and AGENTS.md, and propagate recursively to any nested owned-by-us submodule. See parent project's `CONSTITUTION.md` §CONST-049 and constitution submodule `Constitution.md` §11.4.26 for the full mandate.
## CONST-050: No-Fakes-Beyond-Unit-Tests + 100%-Test-Type-Coverage Mandate (cascaded from constitution submodule §11.4.27)

> Verbatim user mandate (2026-05-15): *"Mocks, stubs, placeholders, TODOs or FIXMEs are allowed to exist ONLY in Unit tests! All other test types MUST interract with real fully implemented System! No fakes, empty implementations or bluffing is allowed of any kind! All codebase of the project MUST BE 100% covered with every supported test type: unit tests, integration tests, e2e tests, full automation tests, security tests, ddos tests, scaling tests, chaos tests, stress tests, performance tests, benchmarking tests, ui tests, ux tests, Challenges (fully incorporating our Challenges Submodule — https://github.com/vasic-digital/Challenges). EVERYTHING MUST BE tested using HelixQA (fully incorporating HelixQA Submodule — https://github.com/HelixDevelopment/HelixQA). HelixQA MUST BE used with all possible written tests suites (test banks) for every applications, service, platform, etc and execution of the full HelixQA QA autonomous sessions! All required dependency Submodules MUST BE added into the project as well (fully recursive!!!)."*

Two cooperating invariants:

**(A) No-fakes-beyond-unit-tests.** Mocks, stubs, fakes, placeholders, `TODO`, `FIXME`, "for now", "in production this would", or empty-implementation patterns are PERMITTED only in unit-test sources. Every other test type — integration, E2E, full automation, security, DDoS, scaling, chaos, stress, performance, benchmarking, UI, UX, Challenges, HelixQA — MUST exercise this submodule's real, fully implemented system against real infrastructure. Production code MUST NOT import mock paths.

**(B) 100% test-type coverage.** Codebase MUST be covered by every supported test type the domain warrants: unit, integration, E2E, full-automation, security, DDoS, scaling, chaos, stress, performance, benchmarking, UI, UX, Challenges (vasic-digital/Challenges submodule fully incorporated), HelixQA (HelixDevelopment/HelixQA submodule fully incorporated, with full autonomous QA sessions executing every registered test bank with captured wire evidence).

**Required dependency submodules** (recursive per CONST-047): Challenges + HelixQA + any other functionality submodules under vasic-digital/HelixDevelopment orgs this submodule depends on.

**Cascade requirement:** This anchor (verbatim or by CONST-050 ID reference) MUST remain in this submodule's CONSTITUTION.md, CLAUDE.md, and AGENTS.md, and propagate recursively to any nested owned-by-us submodule. See parent project's `CONSTITUTION.md` §CONST-050 and constitution submodule `Constitution.md` §11.4.27 for the full mandate.
