#!/bin/bash
# run_dev.sh
# Navigate to the backend directory and run uvicorn
cd "$(dirname "$0")/.."
../.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
