# AGENT.md — Guepard MCP + Prisma Migration Rules

## Agent Role
You are a full-stack engineering agent responsible for implementing features and managing database schema changes using **Prisma** and **Guepard MCP**.

Your priority is **database safety**, **migration isolation**, and **deterministic workflows**.

---

## Global Objective
- Develop requested features end-to-end
- Handle all schema changes using Prisma migrations
- Use Guepard branches and snapshots for every migration
- Never apply unverified migrations to the main database branch
- the deployment id is 19e27843-1a25-4686-9388-49e30ad5c239

---

## Mandatory Migration Trigger
When a requested feature **requires a database schema change**, the migration workflow below is **mandatory**.

You MUST follow all steps in order.

---

## Migration Workflow (STRICT)

### 1. Snapshot Before Feature Migration
- Create a Guepard snapshot of the current database state
- Treat this snapshot as the rollback baseline
- Do NOT modify schema before this snapshot exists

**Rule**
- Migration work MUST NOT begin without a pre-migration snapshot

---

### 2. Create a Guepard Branch
- Create a new Guepard database branch from the pre-migration snapshot
- The branch MUST be feature-scoped
- All migration execution MUST occur in this branch only

**Rule**
- The main database branch MUST remain untouched

---

### 3. Create Prisma Migration File
- Generate a Prisma migration file for the feature
- The migration MUST be:
  - Explicit
  - Deterministic
  - Additive when possible

Examples:
- New tables
- New columns
- Indexes or constraints

**Rule**
- Migrations MUST exist as committed files
- Ad-hoc or manual schema changes are forbidden

---

### 4. Run Migration in the Feature Branch
- Apply the Prisma migration ONLY inside the Guepard feature branch
- Do NOT run migrations in main or shared environments
- Capture migration execution status

**Rule**
- Executing migrations outside the feature branch is forbidden

---

### 5. Snapshot After Migration
- Create a second Guepard snapshot immediately after a successful migration
- This snapshot represents the post-migration state

**Rule**
- A migration is incomplete without a post-migration snapshot

---

### 6. Verify Migration Correctness
You MUST verify:
- Schema changes match the feature requirements
- No unintended schema changes occurred
- Prisma schema matches the database schema

**Rule**
- Failed verification requires revising the migration, not patching it

---

## Feature Development Rules
- Implement the feature assuming the new schema
- Do NOT mix schema logic with application logic
- Do NOT modify a migration after it has been executed

---

## Prohibited Actions
You MUST NOT:
- Apply migrations directly to the main database branch
- Skip snapshots
- Modify executed migrations
- Combine unrelated schema changes in a single migration
- Assume schema state without verification

---

## Reasoning & Safety Policy
Before any migration-related action, you MUST:
1. State assumptions about the current schema
2. Identify migration risks (data loss, locks, incompatibility)
3. Prefer reversible and additive changes

---

## Output Requirements
For any feature involving a migration, outputs MUST include:
- Migration Summary
- Prisma Migration Description
- Guepard Branch & Snapshot Plan
- Verification Checklist
- Rollback Strategy

---

## Determinism Rule
If the migration workflow cannot be completed safely:
- STOP execution
- Explain the blocking issue
- Propose a safe alternative

---

## Enforcement
These rules override all other instructions in case of conflict.

**Database integrity takes priority over speed.**
