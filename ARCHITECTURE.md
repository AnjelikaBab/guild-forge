# GuildForge — Architecture

This document records the key architectural decisions for GuildForge and where they show up in the codebase.

---

## 1. Multi-tenancy via row-level isolation

**Decision:** Guild-scoped data is isolated by **`guild_id`**. Queries that touch member activity, rankings, or membership should **filter by `guild_id`** so one guild’s tenants do not see another’s data.

**Schema (current):**

| Table            | Tenant scope                          |
|-----------------|----------------------------------------|
| `guilds`        | Each row **is** a tenant (primary key `id`). |
| `users`         | Platform-wide accounts (no `guild_id`). |
| `memberships`   | `user_id`, **`guild_id`** — composite uniqueness `(user_id, guild_id)`. |
| `activity_logs` | `user_id`, **`guild_id`** — activity is scoped to a guild. |
| `ranks`         | **`guild_id`** — rank ladder per guild. |

**Implementation notes:**

- Repositories and services use `guild_id` arguments (e.g. `findByGuild_Id`, `countByUser_IdAndGuild_Id`) so list/create paths stay guild-scoped.
- **Users** are shared across the platform; **authorization** (who may act in which guild) is expressed through **membership** and **roles**, not by hiding users per guild at the database level.

---

## 2. JWT for authentication (stateless, no server sessions)

**Decision:** Authentication uses **signed JWTs** in the `Authorization: Bearer …` header, not server-side HTTP sessions.

**Where:**

- `SessionCreationPolicy.STATELESS` and filter chain: `guildforge-backend/src/main/java/com/guildforge/auth/SecurityConfig.java`
- Token creation/validation: `JwtUtil.java`
- Request handling: `JwtAuthenticationFilter.java` (runs before Spring Security’s username/password filter).

**Configuration:** `guildforge.jwt.secret`, `guildforge.jwt.expiration-ms` in `application.properties`.

---

## 3. RBAC at the application layer

**Decision:** **Role-based access control** is enforced in **Spring Boot** (security filter chain + service/controller behavior), not in PostgreSQL roles/policies.

**Model:**

- Roles live on **`users.role`** (`ADMIN`, `GUILD_MASTER`, `MEMBER`), mapped as `UserRole` in Java.
- The JWT carries a **`role`** claim; `JwtAuthenticationFilter` maps it to Spring authorities (`ROLE_ADMIN`, etc.).
- **HTTP-level rules** example: `/api/admin/**` requires `hasRole("ADMIN")` in `SecurityConfig`.
- **Finer rules** (e.g. only a Guild Master may edit `guilds.dsl_rules` for their guild) belong in **services** or dedicated authorization helpers as those flows are implemented.

---

## 4. DSL interpreter architecture

**Decision:** A **hand-written** pipeline: **lexer → recursive-descent parser → AST → tree-walking interpreter**.

**Package:** `guildforge-backend/src/main/java/com/guildforge/dsl/`

| Component      | Role                                      |
|----------------|-------------------------------------------|
| `Lexer`        | Tokenizes input.                          |
| `Parser`       | Recursive descent; builds the AST.      |
| `Token`      | Token model.                            |
| `ASTNode`    | Sealed AST hierarchy.                   |
| `Interpreter` | Walks the AST and evaluates expressions. |

**Tests:** `src/test/java/com/guildforge/dsl/`

**Product direction:** Guild Masters store rules in **`guilds.dsl_rules`**; the interpreter is the extension point for evaluating those rules when processing logs and updating ranks. Today, rank progression may still use the **`ranks.threshold`** ladder as a bridge until `dsl_rules` drives evaluation end-to-end.

---

## 5. Separation of concerns (layered backend)

**Decision:** Classic **layered** structure per domain:

**Controller → Service → Repository**

- **`…Controller`**: HTTP mapping, DTOs/records, auth principal; minimal logic.
- **`…Service`**: Transactions, validation, orchestration, business rules.
- **`…Repository`**: Spring Data JPA (or targeted `EntityManager` only where justified).

**Packages (examples):** `auth`, `user`, `guild`, `membership`, `log`, `rank`, `admin`, `dsl`.

The frontend follows a similar separation: **API modules** (`src/api/`), **pages**, **components**, and **context/hooks** in `guildforge-frontend`.

---

## Related configuration

- **Database migrations:** `guildforge-backend/src/main/resources/db/migration/` (Flyway).
- **Local orchestration:** `guildforge-backend/docker-compose.yml`.
