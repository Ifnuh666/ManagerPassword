from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from core.config import settings

 # Строка подключения к БД
DATABASE_URL = "postgresql+asyncpg://postgres:197809rr@localhost:5432/Manager"

# Создаю асинхронное подклбчение (движок)
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Создаем "фабрику сессий"
AsyncSessionLocal = async_sessionmaker(
    bind=engine, # Объект, с которым связывается сессия для выполнения запросов
    expire_on_commit=False # Делает объекты устаревшими (expired) после коммита, заставляя их обновляться при следующем обращении.
)

# Создаем базовый класс для работы с моделями
Base = declarative_base()

# Функция-генератор для получения сессии БД в эндпоинтах
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session # yield передает сессию в эндпоинт