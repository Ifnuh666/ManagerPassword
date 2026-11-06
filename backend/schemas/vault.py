from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class VaultItemCreate(BaseModel):
    site_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        example="Google",
        description="Название сайта"
    )
    login: str = Field(
        ...,
        min_length=1,
        max_length=255,
        example="user@gmail.com",
        description="Логин на сайте"
    )
    encrypted_password: str = Field(
        ...,
        description="Зашифрованный пароль от сайта (AES-256)"
    )

class VaultItemUpdate(BaseModel):
    site_name: Optional[str] = Field(None, min_length=1, max_length=255)
    login: Optional[str] = Field(None, min_length=1, max_length=255)
    encrypted_password: Optional[str] = None

class VaultItemResponse(BaseModel):
    id: int
    user_id: int
    site_name: str
    login: str
    encrypted_password: str  # Зашифрованный пароль
    created_at: datetime
    update_at: Optional[datetime]
    
    model_config = {
        "from_attributes": True
    }
    