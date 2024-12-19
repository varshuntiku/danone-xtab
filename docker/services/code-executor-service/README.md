# FastAPI

## Description
This is a FastAPI application that is for executing python code and will return logs, error and output of your code.

## Usage
To run the application, execute the following command:
```
uvicorn main:app --reload
```

The application will be available at `http://localhost:8000`.

To access the DOCS, navigate to `http://localhost:8000/docs`.

## TO create and activate venv install the required packages
```
python3 -m venv venv
source venv/bin/activate or venv\Scripts\activate
pip install -r requirements.txt
```

## To install Jmeter
follow the instructions in the link below
https://www.simplilearn.com/tutorials/jmeter-tutorial/jmeter-installation

## To run the Jmeter test for load testing
open the jmeter and select the ```docker\services\nuclios-python-code-executor\nuclios_executor_jmeter_test_sample.jmx``` file and run the test

Before running the test, make sure the FastAPI application is running with more than 1 worker. To run the application with more than 1 worker, execute the following command:
```
uvicorn main:app --workers 20
```



