from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
import uvicorn
from database import get_db, engine, Base
from fastapi.security import OAuth2PasswordBearer

import models

from API.auth import router as auth_router
from API.vault import router as vault_router

# Создаём схему безопасности
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

@asynccontextmanager
async def lifespan(app: FastAPI):

    # КОД ВЫПОЛНЯЕТСЯ ДО СТАРТА ПРИЛОЖЕНИЯ 
    # Открываем асинхронное соединение с БД
    async with engine.begin() as conn:
        # Запускаем синхронный метод в асинхронном контексте
        await conn.run_sync(Base.metadata.create_all)
    
    print("✅ Таблицы созданы")
    
    # Передаем управление FastAPI
    yield
    
    # КОД ВЫПОЛНЯЕТСЯ ПРИ ОСТАНОВКЕ
    await engine.dispose()
    print("👋 Остановлено")


# Передаем lifespan в FastAPI
app = FastAPI(lifespan=lifespan,
    title="MyVault - Менеджер паролей",
    description="Безопасное хранение паролей с Zero-Knowledge архитектурой",
    version="1.0.0",
)


app.include_router(auth_router)
app.include_router(vault_router)

@app.get("/")
def return_answer():
    return {"message": "Успешно!"}


@app.get("/tables")
async def list_tables(db: AsyncSession = Depends(get_db)):
    """Показать все таблицы в БД"""
    result = await db.execute(text("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """))
    tables = [row[0] for row in result.fetchall()]
    return {"tables": tables}


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)