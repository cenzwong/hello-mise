# Hello Mise — Python + Node.js

A minimal example of **Rolling Toolbox, Pinned Workspace** using native Python and Node.js project files, with Mise as an optional developer experience layer.

Both programs read the same `HELLO_NAME` environment variable and print a greeting. They use only the standard libraries, so no third-party application dependencies are required.

## 1. Project structure

```text
hello-mise/
├── .python-version        # Python development version
├── .node-version          # Node.js development version
├── .env.example           # Shared environment variable template
├── .gitignore
├── pyproject.toml         # Native Python project metadata and dependencies
├── uv.lock                # Python dependency lockfile
├── package.json           # Node scripts, dependencies and pnpm version
├── pnpm-lock.yaml         # Node dependency lockfile
├── mise.toml              # Optional tools, activation and task shortcuts
├── hello.py               # Python application
├── hello.mjs              # Node.js application
├── tests/
│   ├── test_hello.py
│   └── hello.test.mjs
└── README.md
```

Run the commands below from the repository root. After extracting the archive, enter `hello-mise/` (or clone your own repository if you publish it).

Create your local environment file once:

```sh
cp .env.example .env
```

The example pins Python 3.13.5, Node.js 22.16.0, pnpm 10.15.0 and (for Mise users) uv 0.10.0. These are demonstration versions, not recommendations for the latest production security patches.

## 2. Quick start — with Mise

Install [Mise](https://mise.jdx.dev/getting-started.html) first. On macOS, for example:

```sh
brew install mise
```

Add this line to `~/.zshrc` **once**, if it is not already there:

```sh
eval "$(mise activate zsh)"
```

Open a new terminal. For an optional rolling global toolbox, run these outside the repository:

```sh
mise use -g python@latest uv@latest node@lts pnpm@latest
```

### Set up this workspace

```sh
cd hello-mise
cp .env.example .env  # only if you have not created .env already
mise trust            # review mise.toml before trusting
mise install
```

Wait for the normal shell prompt to return (activation updates the shell at the prompt). Then restore native dependencies:

```sh
uv sync --locked
pnpm install --frozen-lockfile
```

Alternatively, use the optional task:

```sh
mise run setup
```

The Python virtual environment is created by uv. Mise's `python.uv_venv_auto = "source"` activates it at the next interactive prompt, rather than creating a second environment.

### Run the applications

In the activated interactive shell:

```sh
python hello.py
node hello.mjs
```

Mise reads `.env` into the shell. Both programs can also be run through the native package managers:

```sh
uv run --locked --env-file .env hello.py
pnpm start
```

Or run both with one optional task:

```sh
mise run hello
```

Expected output (with `HELLO_NAME=World`):

```text
Hello, World! (Python)
Hello, World! (Node.js)
```

### Test and inspect

```sh
mise run test
mise ls --current
mise config ls
mise which python
mise which node
mise which pnpm
python -c 'import sys; print(sys.executable)'
```

After `uv sync`, the final command should normally point into the project's `.venv`. `mise which python` instead identifies Mise's selected base interpreter.

For a non-interactive shell with no activation, use `mise run setup`, `mise run hello` and `mise run test`, or an explicit command such as `mise exec -- uv run --locked --env-file .env hello.py`. Interactive users do not need to prefix every command with `mise exec --`.

## 3. Quick start — without Mise

You do not need Mise to build, run or test this repository.

### Prerequisites

- Install [uv](https://docs.astral.sh/uv/getting-started/installation/). uv can install the pinned Python if it is not already available.
- Install Node.js 22.16.0 using an existing version manager or the [official distribution](https://nodejs.org/en/download).
- Install [pnpm](https://pnpm.io/installation) 10.15.0. With npm available, `npm install -g pnpm@10.15.0` is one option.

If you use a version manager, select the version listed in `.node-version` before running the commands.

### Python

```sh
uv python install 3.13.5  # optional if the interpreter is already installed
uv sync --locked
uv run --locked --env-file .env hello.py
uv run --locked python -m unittest discover -s tests -p 'test_*.py'
```

Prefer direct Python commands? On macOS/Linux, you can activate the environment yourself:

```sh
source .venv/bin/activate
# Python reads the process environment; it does not automatically parse .env.
HELLO_NAME=World python hello.py
deactivate
```

Use `uv run --env-file .env` when you want uv to load the dotenv file without Mise.

### Node.js

```sh
pnpm install --frozen-lockfile
pnpm start
pnpm test
```

Or use Node directly, without even needing pnpm for this dependency-free example:

```sh
node --env-file=.env hello.mjs
node --test tests/hello.test.mjs
```

`pnpm start` calls the same Node command through the script in `package.json`.

## 4. Shared environment configuration

Change your local `.env` to:

```dotenv
HELLO_NAME=London
```

Run both applications again. With no competing exported `HELLO_NAME`, you should get:

```text
Hello, London! (Python)
Hello, London! (Node.js)
```

Mise users: let the interactive prompt refresh after editing `.env`, or run `mise run hello`. Native users: use `uv run --env-file .env ...` and `pnpm start` to load the file. If you previously exported a different value, unset it before comparing workflows; dotenv precedence can differ between tools.

Both applications fall back to `World` if `HELLO_NAME` is absent. The native start commands expect `.env` to exist. Never commit secrets or your local `.env`; commit `.env.example` instead.

## 5. Everyday commands

| Operation | Native commands (also work with Mise activated) | Optional Mise shortcut |
| --- | --- | --- |
| Install toolchain | Install uv, Python, Node and pnpm separately | `mise install` |
| Restore dependencies | `uv sync --locked` and `pnpm install --frozen-lockfile` | `mise run setup` |
| Run Python | `uv run --locked --env-file .env hello.py` | `mise run hello` (both apps) |
| Run Node | `pnpm start` | `mise run hello` (both apps) |
| Test Python | `uv run --locked python -m unittest discover -s tests -p 'test_*.py'` | `mise run test` (both suites) |
| Test Node | `pnpm test` | `mise run test` (both suites) |
| Add Python dependency | `uv add requests` | Same native command |
| Add Node dependency | `pnpm add dayjs` | Same native command |
| Remove dependency | `uv remove requests` / `pnpm remove dayjs` | Same native command |
| Update dependencies | `uv lock --upgrade`, then `uv sync` / `pnpm update` | Same native commands |
| Update global toolbox | Depends on your version manager | `mise upgrade -g` |

The add/remove commands are examples for future development; neither library is required by Hello World. Review and commit native manifest and lockfile changes together when adding dependencies.

## 6. How the integration works

- `.python-version` selects the development interpreter for uv and Mise. `requires-python` in `pyproject.toml` describes compatibility, not the exact interpreter selection.
- `.node-version` selects Node for compatible version managers and Mise. `engines.node` in `package.json` describes compatibility.
- `package.json` declares the pnpm version via `packageManager` and owns Node scripts.
- uv and pnpm own their native dependency graphs and lockfiles. Mise never replaces these files.
- `mise.toml` opts into idiomatic version files, pins the uv executable, loads `.env`, passes the selected Python to uv and activates the environment uv creates. Its tasks only delegate to existing native commands.
- `UV_PYTHON_DOWNLOADS=never` applies in the Mise environment only. Native uv users remain free to let uv install Python.

If you want Mise to additionally record platform-specific toolchain resolution and integrity metadata, run `mise lock` after installing the tools, review and commit the generated `mise.lock`, and use `mise install --locked` thereafter. This starter intentionally does not ship a fabricated Mise lockfile.

No custom wrapper, Docker, extra task runner, framework or experimental dependency provider is necessary. Remove `mise.toml` (and any subsequently generated `mise.lock`) and the native project still works.

## 7. Validation and limitations

The starter was tested with Python 3.13.5, uv 0.10.0 and Node.js 22.16.0 on Linux. All three Python tests and all three Node tests passed. Both applications were also run using the shared dotenv configuration. The uv lockfile was generated by uv itself.

Mise and pnpm were unavailable in the authoring environment, and network access to their download sources was blocked. Node scripts were verified using npm and Node directly, not pnpm. The dependency-free `pnpm-lock.yaml` is a minimal version-9 starter lockfile, not an output verified by pnpm. If your first `pnpm install --frozen-lockfile` rejects it, run `pnpm install --no-frozen-lockfile` once, inspect the generated lockfile and rerun the frozen install. Mise's configuration and tasks follow the official documentation but have not been executed here. Use a current Mise release supporting the settings shown.

## References

- [Rolling Toolbox, Pinned Workspace](https://cenz.hashnode.dev/rolling-toolbox-pinned-workspace)
- [Mise: Python cookbook](https://mise.jdx.dev/mise-cookbook/python.html)
- [Mise: Node.js cookbook](https://mise.jdx.dev/mise-cookbook/nodejs.html)
- [Mise: version files](https://mise.jdx.dev/dev-tools/versions.html)
- [Mise: environment variables](https://mise.jdx.dev/environments/)
- [uv: working on projects](https://docs.astral.sh/uv/guides/projects/)
- [pnpm: installation](https://pnpm.io/installation)
