#!/bin/bash

usage() {
    echo "Usage: $0 [marker_name]"
    echo "Run pytest with or without a specific marker."
    echo
    echo "  -h, --help          Show this help message and exit"
    echo "  marker_name         Run pytest with the specified marker"
    echo
    echo "Examples:"
    echo "  $0                  Run basic pytest without a marker"
    echo "  $0 model            Run pytest with 'model' marker"
    echo "  coverage            Run pytest code coverage report"
}

# Check if help argument is provided
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    usage
    exit 0
fi

case "$1" in
    coverage)
        pytest -s -m "integration" --cache-clear --cov=api --cov-report=html --cov-report=term-missing \
               --html=htmlcov/report.html --self-contained-html \
               --metadata title "NucliOS Test Coverage Report"
        ;;
    unit|integration|model)
        pytest -s -m "$1"
        ;;
    "")
        echo "Running All Tests"

        echo "Running Structural Tests"
        pytest -s -m "model"

        echo "Running Unit Tests"
        pytest -s -m "unit"

        echo "Running Integration Tests"
        pytest -s -m "integration"

        echo "All tests run completed"
        ;;
    *)
        echo "Invalid argument. Please use 'coverage', 'unit', 'integration', or 'model'."
        exit 1
        ;;
esac
