# Comments - Service

## Description
This is a FastAPI application for the comments feature and will handle all the API calls for the comment feature.

## TO create and activate venv install the required packages
```
conda create --name myenv python=3.10
conda activate myenv
pip install -r requirements.txt
```

##  Usage

To run the application using debugger add below configuration to launch.json in vs code

'''
{
        "name": "Comments server: FastAPI",
        "type": "debugpy",
        "request": "launch",
        "module": "uvicorn",
        "cwd": "${workspaceFolder}/docker/services/comments - service",
        "python": "/home/{userName}/miniconda3/envs/nuclios/bin/python",
        "args": [
                "api.main:app",
                "--reload",
                "--port",
                "8001"
            ],
        "jinja": true
}
'''

To run the application without debugger,execute the following command:
'''
./run_comments_webserver_local.sh
'''

The application will be avaliable at `http://localhost:8001`.

To access the DOCS, navigate to `http://localhost:8001/docs`.


## To change the env variables according to the client

Create the .env file in the comment - service folder and add these env variables to the .env and fill the empty variables with the client credentials:

FASTAPI_ENV="fast_development"
ALLOWED_HEADERS="Accept,Accept-Language,Content-Language,Content-Type,Accept-Encoding,Authorization,Cache-Control,Codx-App-Id,Nac_access_token,Referer,Cookie,userId,Password_token"
ALLOWED_METHODS="GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD"
ALLOWED_ORIGINS=
API_VERSION="0.0.1"
APP_MODE="development"
APP_NAME="COMMENTS FEATURE SERVER"
AZURE_BLOB_ROOT_URL="https://stcodxdev.blob.core.windows.net/"
AZURE_OAUTH_APPLICATION_ID=
AZURE_OAUTH_TENANCY=
DOCS_URL="/docs"
REDOC_URL="/redoc"
FOLDER_PATH=""
JWT_ALGORITHM="RS256"
JWT_PUBLIC_KEY_ENCODED="LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQklqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FROEFNSUlCQ2dLQ0FRRUF6c1JQc2VEcmxyN0Uxa05kbzdQbAo2UGRTUlVyNG9wQnhuQTVDRTJuN2lYQllNMm0xNFQwYktlaFNuK3I3dEdlSWRZRnpGZkp2ZmZxRW9WS0oyZW4zCkd5QjhSSXk4ckdTdWJNMEQxUzlUaGIwQXUzU1BGS1lZUkw2cXBHVTBzM3RSQ3lYaFFMNTRoMElrTjJLNGNIWGUKRlYwYVNhTWxpbW9nQzhESXNZcU54ZjlLcWVGZHZ6Z2hRZnRDdjczZXUwVXJ6NVZic2ZqTDg0YnNjVElZYXZnOQpudzRhS0RNOGtFWnM2ODY2OG5OeEcwaXJtSzZtK1VUM3F2SEExMDc5VmhyaVNjUjNwNUJ6bWRlakZ6ZjNWVjIvCmlyMDFYSk5JZ1RxblJXakNGa1lKb2dEdkVPY3ZuQmprdFNWUnZLYVZQemZ5REEwR1pLYkRZRUtaK05qRE1pRHcKUFFJREFRQUIKLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg=="
SHARE_EMAIL_PWD=
SHARE_EMAIL_SENDER=
SQLALCHEMY_DATABASE_URI=
DATA_AZURE_CONNECTION_STRING=
DATA_FOLDER_PATH=
AZURE_OAUTH_SCOPE=
AZURE_OAUTH_CLIENT_SECRET=

## Configuration in the Azure Portal

In the Azure portal, go to the Microsoft Entra ID

In Microsoft Entra ID, Under manage go to the app registrations and select your application

In your Application, Under Manage goto the API Permissions.

create a new API permission in API Permissions as User.ReadBasic.All and grant admin consent for directory which you are using