from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    DATABASE_URL: str

    SECRET_KEY: str

    # Алгоритм шифрования для JWT
    ALGORITHM: str = "HS256"

    # Время жизни токена доступа (в минутах)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Время жизни refresh токена (в днях)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Отсюда берем настройки
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"



settings = Settings()

