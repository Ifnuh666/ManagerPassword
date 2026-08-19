from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse, UserLogin, Token
from core.security import get_password_hash, create_access_token, verify_password

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Регистрация нового пользователя",
    description="Создает нового пользователя с хэшированным паролем"
)

# Создаем функцию для регистрации пользователя
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email)) # Получаем из БД email пользователя
    existing_user = result.scalar_one_or_none() # Здесь мы ищем первую найденную запись или None

    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким email уже существует")

    hashed_password = get_password_hash(user_data.password) # Хэшируем пароль

    new_user = User( # Создаем нового пользователя
        email = user_data.email,
        hashed_password = hashed_password
    )

    # Сохраняем данные в БД
    db.add(new_user)  # Добавляем объект в сессию
    await db.commit()  # Сохраняем изменения в БД (делаем COMMIT)
    await db.refresh(new_user)  # Обновляем объект (чтобы получить id из БД)

    return new_user


@router.post(
    "/login",
    response_model=Token,
    summary="Вход в систему",
    description="Проверяет email и пароль, возвращает JWT токен"
)

async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where(User.email == user_data.email)
    )
    user = result.scalar_one_or_none()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }