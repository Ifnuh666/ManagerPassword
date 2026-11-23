from cryptography.fernet import Fernet, InvalidToken
from core.config import settings

cipher = Fernet(settings.ENCRYPTION_KEY.encode())

# Функция для шифрования паролей
def encrypt_password(plain_text: str) -> str:
    return cipher.encrypt(plain_text.encode()).decode()

# Функция для расшифровки паролей
def decrypt_password(encrypted_text: str) -> str:
    try:
        return cipher.decrypt(encrypted_text.encode()).decode()
    except InvalidToken:
        return encrypted_text