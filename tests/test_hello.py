import os
import subprocess
import sys
import unittest
from pathlib import Path

from hello import greet

ROOT = Path(__file__).resolve().parents[1]


class GreetingTests(unittest.TestCase):
    def test_default(self):
        self.assertEqual(greet(), "Hello, World! (Python)")

    def test_custom_name(self):
        self.assertEqual(greet("London"), "Hello, London! (Python)")

    def test_cli_reads_environment(self):
        output = subprocess.check_output(
            [sys.executable, str(ROOT / "hello.py")],
            env={**os.environ, "HELLO_NAME": "London"},
            text=True,
        )
        self.assertEqual(output.strip(), "Hello, London! (Python)")


if __name__ == "__main__":
    unittest.main()
