"""A tiny greeting using the process environment, independent of Mise."""

import os


def greet(name: str = "World") -> str:
    return f"Hello, {name}! (Python)"


def main() -> None:
    print(greet(os.environ.get("HELLO_NAME", "World")))


if __name__ == "__main__":
    main()
