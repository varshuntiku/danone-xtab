#!/bin/bash

export ENV=test

echo "Running Unit Tests..."

pytest --cov=app --cov-report=html --cov-report=term-missing --html=htmlcov/report.html --self-contained-html --metadata title="Copilot Unit Test Report" tests/

echo "Unit Tests Run Completed"
