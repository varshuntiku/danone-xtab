from sqlalchemy import create_engine


class CodexDBConnection:
    def __init__(self):
        self.connection = False

    def get_db_connection(self, postgres_uri):
        if not self.connection:
            engine = create_engine(postgres_uri)
            self.connection = engine.connect()

        return self.connection
