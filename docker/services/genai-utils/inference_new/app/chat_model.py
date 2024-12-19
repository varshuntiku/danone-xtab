from fastapi import status
from LLaMA_Factory.src.llamafactory import ChatModel, create_app
from starlette.responses import JSONResponse


def main():
    chat_model = ChatModel()
    app = create_app(chat_model)

    @app.get("/healthcheck", status_code=status.HTTP_200_OK)
    @app.get("/", status_code=status.HTTP_200_OK)
    async def health_check():
        return JSONResponse(content={"status": "Ok", "message": "Running"}, status_code=status.HTTP_200_OK)


if __name__ == "__main__":
    main()
