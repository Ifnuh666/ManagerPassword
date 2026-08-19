from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(
        ...,  # ... означает, что поле обязательное
        min_length=8,
        max_length=100,
        example="StrongPassword123!",
        description="Мастер-пароль для входа в менеджер паролей"
    )

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime
    model_config = {
            "from_attributes": True
        }

class Token(BaseModel):
    access_token: str  # Сам JWT токен
    token_type: str = "bearer"  # Тип токена (стандарт)

class TokenData(BaseModel):
    email: Optional[str] = None
