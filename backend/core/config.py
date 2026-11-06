from pydantic_settings import BaseSettings

class Settings(BaseSettings):

    SECRET_KEY: str = "your-super-secret-key-change-this-in-production-12345"

    # Алгоритм шифрования для JWT
    ALGORITHM: str = "HS256"

    # Время жизни токена доступа (в минутах)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Время жизни refresh токена (в днях)
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7



settings = Settings()

