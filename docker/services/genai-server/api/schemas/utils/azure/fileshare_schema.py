from pydantic import BaseModel


class FileShareFileUpload(BaseModel):
    # file: UploadFile = File(...)
    share_name: str
    server_file_path: str

    class config:
        orm_mode = True
