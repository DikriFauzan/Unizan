#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 compiler/sovereign_cli.py "ACTIVATE MODULE_NEOENGINE TARGET:DEVICE_01 AUTH:LEVEL_3" --run
python3 compiler/sovereign_cli.py "DEACTIVATE MODULE_NEOENGINE TARGET:DEVICE_01 AUTH:OWNER" --run
echo "Tests completed."
