# Introduction

This service has the logic for handling Minerva requests. Minerva is a cognitive assistant on Co.dx which helps deliver value to users by translating natural language to Insights

# Developer Documentation

## Local Setup

Install python and dependencies (Assuming the current folder is the working directory)

```
conda create -n "minerva_new" python=3.10.10
conda activate minerva_new
pip install -r requirements.txt
uvicorn app.main:app --port 8003 --reload
```