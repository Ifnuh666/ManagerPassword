from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):

    SECRET_KEY: str

    # Алгоритм шифрования для JWT
    ALGORITHM: str = "HS256"

    # Время жизни токена доступа (в минутах)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Время жизни refresh токена (в днях)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str

    class Config:
        env_file = ".env"



settings = Settings()

