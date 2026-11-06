from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base # Импортируем класс Base из database.py

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # server_default=func.now() - БД сама поставит текущую дату при создании записи
    
    vault_items = relationship(
        "VaultItem", 
        back_populates="owner", 
        cascade="all, delete-orphan"
    )

    # Магический метод для красивого вывода объекта в консоль
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}')>"