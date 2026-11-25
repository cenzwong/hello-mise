# AGENTS.md — Developer Environment Policy

## 1. Philosophy

**Rolling Toolbox. Pinned Workspace. Native-first. Mise-enhanced.**

Mise is the preferred, optional toolchain and environment manager. Native ecosystem tools remain responsible for application dependencies, builds, tests and packaging. A repository must remain usable without Mise.

- Keep global tools rolling and project-required versions reproducible.
- Prefer declarative configuration, automatic activation and native commands.
- Maintain one authoritative declaration for each version or setting.
- Do not introduce custom wrappers, DevKit CLIs or redundant orchestration merely to standardise commands.
- Follow existing repository conventions; do not migrate established tooling without approval.

## 2. Ownership and source of truth

| Ecosystem | Toolchain selection | Native manifest | Dependency resolution | Native tool |
|---|---|---|---|---|
| Python | `.python-version` | `pyproject.toml` | `uv.lock` | uv |
| Node.js | `.node-version` or `.nvmrc` | `package.json` | `pnpm-lock.yaml` | pnpm |
| Rust | `rust-toolchain.toml` | `Cargo.toml` | `Cargo.lock` | Cargo / rustup |
| Go | `go.mod` / `go.work`, or `.go-version` | `go.mod` | `go.sum` (checksums) | Go |
| Java | `.java-version` or existing convention | `pom.xml` / `build.gradle.kts` | Native dependency locking where supported | Maven / Gradle |

Keep native scripts, workspace definitions and compatibility constraints. Compatibility ranges (e.g. `requires-python`, `engines`, `rust-version`) are not exact toolchain pins. Keep them consistent with the selected development version.

Mise may read native version declarations through idiomatic version files. Use `[tools]` for tools not already declared through a supported native version file (e.g. uv). Avoid conflicting version declarations. Generate lockfiles using their respective tools; commit them according to the repository's reproducibility policy. `mise.lock` complements, never replaces, native lockfiles.

## 3. Workstation and project setup

Global CLI installation is a user-level operation, for example `mise use -g ripgrep@latest`. Agents must not change global tools, shell configuration or system packages without explicit approval.

For a trusted project using Mise, inspect configuration before running `mise install`. Use `mise install --locked` when a valid Mise lockfile exists. Do not trust unknown configuration automatically. In an activated interactive shell, entering the project selects its declared tools. Use ordinary commands (`uv`, `pnpm`, `cargo`) when the correct environment is active. Use `mise exec -- <command>` only when needed in a non-interactive or unactivated environment. If Mise is unavailable, use the native workflow.

## 4. Optional Mise configuration

Example for a Python, Node.js and Rust repository; include only the languages actually used. Replace the illustrative uv version with the project's chosen version.

```toml
[tools]
uv = "0.10.0"

[settings]
idiomatic_version_file_enable_tools = ["python", "node", "pnpm", "rust"]
python.uv_venv_auto = "source"

[env]
_.file = ".env"
UV_PYTHON = { value = "{{ tools.python.path }}", tools = true }
UV_PYTHON_DOWNLOADS = "never"
```

Keep `.python-version`, `.node-version` and `rust-toolchain.toml` as native runtime declarations. Declare pnpm through the existing `packageManager` field in `package.json`. uv creates `.venv`; Mise may activate it. A missing `.venv` before the first `uv sync` is expected. Rust toolchain selection must respect `rust-toolchain.toml`, including components and targets; verify with `rustup show active-toolchain`. Do not add a conflicting Rust override in Mise.

## 5. Native workflows

Run commands from the appropriate project or workspace directory. Examples assume the required native tools are installed and existing lockfiles are valid.

| Operation | Python | Node.js | Rust |
|---|---|---|---|
| Restore | `uv sync --locked` | `pnpm install --frozen-lockfile` | `cargo fetch --locked` |
| Add dependency | `uv add PACKAGE` | `pnpm add PACKAGE` | `cargo add CRATE` |
| Run | `uv run --locked main.py` | `pnpm run dev` | `cargo run --locked` |
| Test | `uv run --locked pytest` | `pnpm test` | `cargo test --locked` |
| Build | `uv build` | `pnpm run build` | `cargo build --locked` |

Use the repository's actual entry points, scripts and test tools. On initial project creation, generate missing lockfiles using native commands before using locked modes. Only build packages when the project is intended to be distributable.

Optional Mise Tasks may delegate to these same native commands. Optional `[deps]` providers may automate dependency restoration where the installed Mise version supports them; they must not replace native manifests or workflows. Do not introduce experimental features unless there is a clear benefit and the repository accepts them.

## 6. Environment and security

Keep application configuration in `.env` or the existing native configuration mechanism. Commit `.env.example` with placeholders; never commit secrets. Ensure the application, native runner or deployment environment can load or supply required variables without Mise. Do not assume Cargo automatically reads `.env`. Do not print credentials or expose server secrets to frontend code.

## 7. Agent execution and validation

1. Inspect README, manifests, version declarations, lockfiles and existing scripts before changing anything.
2. Identify the native toolchain and verify active versions; use Mise only if available and appropriate.
3. Restore dependencies from existing lockfiles; do not silently regenerate them to bypass failures.
4. Make dependency changes through the designated native package manager and review the resulting manifest and lockfile diff.
5. Run relevant native tests, lint and build commands. Use locked modes for CI and verification when supported.
6. Document both Mise-assisted and native setup paths in README when adding environment integration. Avoid machine-specific paths.
7. Report actual checks, failures, environmental limitations and any untested workflow. Never claim verification that was not performed.

## 8. Acceptance criteria

- Native manifests and package-manager scripts remain authoritative.
- Required toolchain versions are declared and reproducible within supported platforms.
- Removing `mise.toml` and `mise.lock` does not prevent native setup, tests, builds or deployment when prerequisites are installed.
- No unnecessary custom tooling, duplicate dependency graphs or global environment changes are introduced.

**Native configuration is the contract. Mise is the convenience layer.**

## References

- https://mise.jdx.dev/dev-tools/versions.html
- https://mise.jdx.dev/mise-cookbook/python.html
- https://mise.jdx.dev/mise-cookbook/nodejs.html
- https://mise.jdx.dev/lang/rust.html
- https://mise.jdx.dev/dev-tools/deps.html
- https://mise.jdx.dev/dev-tools/mise-lock.html
- https://doc.rust-lang.org/cargo/
