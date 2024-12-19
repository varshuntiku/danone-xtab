#!/bin/bash

echo "Running Structural Tests..."
pytest -s -m "model"

echo "Running Unit Tests..."
pytest -s -m "unit"

echo "Running Integration Tests..."
pytest -s -m "integration" --cache-clear --cov=api --cov-report=html --cov-report=term-missing \
       --html=htmlcov/report.html --self-contained-html \
       --metadata title "NucliOS Test Coverage Report"

echo "Tests Run Completed"
echo "Code Coverage Report is Generated"
