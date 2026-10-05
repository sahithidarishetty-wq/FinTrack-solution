# Project Approach & Architecture — Build Secure 24

**Team ID:** 
**Project Name:**FinTrack 
**Team Size:**2 [2 or 4 Members]
**Primary Track / Domain:** 
Cybersecurity / Personal Finance

---

## 1. Problem Understanding, Scope & Threat Model

### 1.1 Problem Statement & Real-World Motivation
*Describe the specific problem your project solves, why it matters, and the core security challenges involved.*
FinTrack is a secure personal finance platform that helps users manage income, expenses, and budgets while providing useful financial insights through an AI assistant.

The platform aims to make personal financial management easier while protecting sensitive financial information from unauthorized access, misuse, and common application security threats.

### 1.2 Target Users & Personas
*Identify target user groups, their operational workflows, and their trust levels (e.g. End User, Admin, Auditor).*
- **End User:** Manages personal income, expenses, budgets, and financial insights.
- **Administrator:** Responsible for application administration and security monitoring, where applicable.
- **AI Assistant:** Provides financial insights based on information the user is authorized to access.

### 1.3 Threat Model & Attack Surface
*Document the threat landscape for this system:*
- **Critical Assets:**(e.g., user credentials, PII, sensitive business records, session tokens)
- User account information
- Financial records
- Income and expense data
- Budget information
- Authentication/session information
- AI assistant requests and responses

- **Potential Attack Vectors:** (e.g., credential stuffing, injection attacks, privilege escalation, unauthorized API access)
- Unauthorized account access
- Broken access control
- Injection attacks
- Malicious or invalid input
- Unauthorized access to financial records
- Credential attacks
- Exposure of sensitive information

- **OWASP Top 10 Considerations:** (e.g., broken access control, cryptographic failures, injection prevention)

- Broken access control
- Cryptographic failures
- Injection
- Identification and authentication failures
- Security misconfiguration
- Sensitive data exposure
---

## 2. Technical Architecture & Secure System Design

### 2.1 High-Level Architecture Overview
FinTrack follows a layered, multi-tier architecture designed to keep personal financial data isolated, auditable, and accessible only to authorized users. The user interacts with a lightweight client interface that communicates with a secure API layer. The API layer handles authentication, business workflows, and access checks before invoking domain services for budgeting, income/expense operations, and financial insights. Data persistence is handled by a relational database for core transactional records and optional caching for frequently accessed metadata or session state.

The intended architecture is:
- **Client / Presentation Layer:** Web frontend for login, dashboard, transactions, budgets, and AI insight views.
- **API Gateway / Application Layer:** Validates input, enforces auth/session rules, applies rate limits, and routes requests to the correct domain services.
- **Domain Services:** Encapsulate personal finance workflows like transaction creation, budget enforcement, analytics, and user account management.
- **Data Persistence Layer:** Stores user profiles, transaction records, budgets, and audit data in a secure database with integrity controls and backups.
- **Trust Boundary:** The frontend is treated as untrusted; all critical decisions are enforced on the backend, not on the client.

### 2.2 Data Flow & Component Interaction
A typical request enters through the client application, where the user signs in or submits a transaction. The request is sent to the API gateway, which first validates the session token and checks whether the request is within configured rate limits. The gateway then sanitizes and validates the payload using strict schemas before it reaches the business logic layer.

Within the domain layer, services verify the user’s permissions, apply business rules such as budget constraints and category validation, and perform the intended operation. Sensitive data is never trusted from the client side; authorization and ownership checks happen server-side before any database write or read is executed. After processing, the persistence layer stores or retrieves records, and the service returns the minimum required data back to the client.

The trust boundaries are:
- **Public Client to API:** Requests are assumed untrusted and must be authenticated and validated.
- **API to Domain Services:** Business rules and authorization are enforced here.
- **Domain Services to Database:** Only the backend may access persistent financial records; raw SQL or unsafe queries are blocked.
- **Database to External Services:** Any AI or analytics service must receive only scoped, authorized data to prevent privacy leakage.

### 2.3 Technology Stack Rationale
- **Backend / API Framework:** FastAPI (Python) — Why chosen: FastAPI offers strong API validation, async support, clean dependency injection, and excellent compatibility with Python security libraries. It is highly suitable for a short, security-focused hackathon build because it reduces boilerplate, helps enforce schema validation, and supports rapid iteration without sacrificing readability or maintainability.
- **Frontend / Client:** React + HTML/CSS/JavaScript — Why chosen: React provides a fast, modular way to build a responsive dashboard and transaction interface, while keeping the UI easy to structure in a 24-hour build. Alternatives like heavier full-stack frameworks were rejected because the team’s main focus is secure finance functionality, not large-scale frontend complexity.
- **Database & Persistence:** SQLite for local development, with a path toward PostgreSQL in production — Why chosen: SQLite is lightweight, easy to set up during the hackathon, and sufficient for a personal finance prototype. PostgreSQL is the preferred production-grade replacement due to stronger transaction integrity, advanced constraints, and reliable multi-user behavior. Redis may be considered later for caching or rate-limit metadata, but it is not core to the initial secure MVP.
- **Authentication & Cryptography:** Password hashing with Argon2/bcrypt and JWT or signed session tokens — Why chosen: Passwords must never be stored in plaintext, and modern password hashing algorithms provide strong protection against credential compromise. JWT or signed tokens are useful for short-lived authentication and authorization in a stateless API. Alternative options like raw session IDs without hashing or weaker algorithms were rejected because they significantly increase security risk.

### 2.4 Defense-in-Depth Security Controls
1. **Authentication & Session Security:** User passwords are hashed using a strong adaptive algorithm such as Argon2 or bcrypt; session tokens are short-lived and signed with a secret key; logout and token invalidation mechanisms are enforced for account security.
2. **Authorization & Access Control:** Each API request must verify that the user owns the target resource or has the required role; object-level checks prevent unauthorized access to other users’ financial data or budgets.
3. **Input Validation & Sanitization:** All incoming payloads are validated against strict request schemas; parameters are sanitized before use, and database queries use parameterized statements to prevent injection flaws.
4. **Rate Limiting & Abuse Prevention:** Public endpoints are throttled to reduce password-guessing, brute-force attempts, and abuse patterns. Suspicious traffic or repeated failures trigger protective response handling.
5. **Secrets & Configuration Hygiene:** No credentials are stored in source code; all secrets are isolated in environment variables or secure config files. Deployment settings are never committed to version control, and secret scanning is part of the verification process.

---

## 3. Implementation Milestones & 24-Hour Timeline

| Milestone / Phase | Time Window | Key Objectives & Deliverables | Security Verification | Status |
|---|---|---|---|---|
| **Phase 1: Foundation & Setup** | 0h – 4h | Contract onboarding, repo setup, baseline data schemas, secure config management | Secret scan & baseline check | `In Progress` |
| **Phase 2: Core Domain & Auth** | 4h – 12h | Core business logic, secure authentication & authorization, transaction workflows | Auth test suite & crypto validation | `Planned` |
| **Phase 3: Security & Hardening**| 12h – 18h | Input validation, rate limiting, error handling, security middleware, audit logging | SAST scanning & edge case tests | `Planned` |
| **Phase 4: Polish & Deployment**| 18h – 24h | UI polish, live cloud deployment, final docs & commit freeze | Live deployment URL check | `Planned` |

---

## 4. Architecture Decision Records (ADRs)

### ADR-001: Secure Personal Finance MVP with Backend-Enforced Authorization
- **Status:** Accepted
- **Context:** FinTrack manages sensitive user financial data, including income, spending, budgets, and potentially AI-generated insights. A compromise in the client or a malicious request could otherwise expose private information.
- **Options Considered:** 
  1. Trust the frontend for access checks and ownership validation
  2. Enforce all authorization decisions on the backend
- **Decision & Rationale:** The team selected backend-enforced authorization with session verification, ownership checks, and strict API validation. This ensures that even a malicious or modified client cannot read or mutate another user’s records.
- **Security & Performance Trade-offs:** The added checks create minimal overhead and are worth the security gain. The performance footprint remains low because the validation occurs only at the API boundary and the database layer remains efficiently scoped.

### ADR-002: API-First Architecture for a Secure 24-Hour Build
- **Status:** Accepted
- **Context:** The hackathon requires a functional, deployable solution under a tight deadline while still prioritizing secure engineering practices.
- **Options Considered:**
  1. Large full-stack monolith with broader feature depth and more complexity
  2. Lean API-first architecture with secure core workflows and a polished interface
- **Decision & Rationale:** The project uses a lean API-first design so authentication, authorization, validation, and persistence can be hardened quickly. This makes the system easier to reason about and easier to test under time pressure.
- **Security & Performance Trade-offs:** The architecture reduces complexity and makes security controls easier to audit. The trade-off is a narrower initial feature set, but the result is a stronger, more maintainable delivery for the hackathon.

### ADR-003: SQLite for Local Development, PostgreSQL-Ready for Production
- **Status:** Accepted
- **Context:** The solution must be built rapidly, but it still needs to be realistic and production-aware.
- **Options Considered:**
  1. Full PostgreSQL setup from day one
  2. SQLite for prototype and migration path toward PostgreSQL
- **Decision & Rationale:** SQLite is preferred for the initial sprint because it is fast to configure and sufficient for a secure personal finance MVP. PostgreSQL remains the preferred production database because of stronger multi-user scalability and transaction integrity.
- **Security & Performance Trade-offs:** SQLite is simple and effective for early development, while PostgreSQL offers better concurrency and long-term production reliability. The migration path is clear and does not compromise the current security model.

---

## 5. Engineering Journal & Real-Time Decision Log

*Maintain this chronological log as your team builds during the 24-hour hackathon.*

### 2026-10-05 15:20 IST Entry 1: Project Initialization & Scope Lock
- **Focus:** Defined the FinTrack scope, team alignment, and secure architecture direction.
- **Key Challenges:** Balancing a quick 24-hour build with security-first design under the competition constraints.
- **Resolution:** Chose a layered API-first architecture, secure authentication workflow, and backend-enforced authorization model to ensure sensitive financial data is protected without overcomplicating the build.

### 2026-10-05 16:00 IST Entry 2: Core Finance Domain Definition
- **Focus:** Identified the critical user flows: login, transaction creation, budget tracking, and insight generation.
- **Key Challenges:** Keeping the MVP manageable while still covering the most sensitive finance operations.
- **Resolution:** Prioritized essential, high-value workflows and separated them from optional AI features so the team can focus on security and correctness first.

### [YYYY-MM-DD HH:MM IST] Entry 3: Implementation Milestone Progress
- **Focus:** 
- **Key Challenges:** 
- **Resolution:** 

---

## 6. Testing, Security Verification & Deployment Record

### 6.1 Testing & Security Verification Strategy
- **Unit & Integration Tests:** Cover authentication, authorization, transaction logic, budget validation, and AI insight input handling in `src/`.
- **Static Analysis & Linting:** Run linting, dependency checks, and secret scanning to detect misconfigurations or unsafe coding patterns before deployment.
- **Security Edge Cases:** Validate malformed input, unauthorized access attempts, duplicate transactions, invalid session tokens, and abnormal budget scenarios.

### 6.2 Deployment Verification
- **Live Deployment Platform:** Render / Railway / AWS-compatible cloud hosting
- **Deployment URL:** Recorded in `metadata/submission.yaml` and `deployment/README.md`
- **Health Check Endpoint:** `/health` or `/api/health`
- **Verification Checklist:** Confirm the app starts successfully, API endpoints are reachable, authentication works, and no secrets are exposed in logs or public config files.
