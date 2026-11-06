from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base # Импортируем класс Base из database.py

class VaultItem (Base):
    __tablename__ = "vaultItem"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    site_name = Column(String, nullable=False)
    login = Column(String, nullable=False)
    encrypted_password = Column(Text, nullable=False) # encrypted_password - ЗАШИФРОВАННЫЙ пароль от сайта
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    update_at = Column(DateTime(timezone=True), onupdate=func.now()) # onupdate=func.now() - автоматически обновляется при изменении записи

    owner = relationship("User", back_populates="vault_items") 

    # Магический метод для красивого вывода объекта в консоль
    def __repr__(self):
        return f"<VaultItem(id={self.id}, site_name='{self.site_name}')>"