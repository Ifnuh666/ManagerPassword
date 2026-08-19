from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.user import User
from models.vault_item import VaultItem
from schemas.vault import VaultItemCreate, VaultItemUpdate, VaultItemResponse
from core.security import get_current_user


router = APIRouter(prefix="/api/v1/vault", tags=["vault"])

# Добавление новых записей в хранилище
@router.post(
    "",
    response_model=VaultItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Добавить новую запись в хранилище",
    description="Создаёт новую запись с зашифрованным паролем от сайта"
)

async def create_vault_item(
    item_data: VaultItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Создаем запись
    new_item = VaultItem(
        user_id = current_user.id,
        site_name = item_data.site_name,
        login = item_data.login,
        encrypted_password = item_data.encrypted_password
    )

    # Добавляем объект в сессию
    db.add(new_item)

    # await db.commit() - выполняет SQL запрос INSERT и сохраняет данные
    await db.commit()

    # await db.refresh() - загружает данные из БД обратно в объект
    await db.refresh(new_item)
    
    return new_item

# Получение всех записей из хранилища
@router.get(
        "",
        response_model=list[VaultItemResponse],
        status_code=status.HTTP_200_OK,
        summary="Просмотр данных",
        description="Возможность посмотреть логин и пароль всех записей пользователя"
)

async def get_vault_item_total(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(VaultItem).where(VaultItem.user_id == current_user.id)
    )

    items = result.scalars().all()

    return items

# Получение конкретной записи из хранилища по ее id 
@router.get(
    "/{item_id}",
    response_model=VaultItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Просмотр данных",
    description="Возможность посмотреть логин и пароль пользователя по item_id"
)

async def get_vault_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(VaultItem).where(VaultItem.id == item_id, VaultItem.user_id == current_user.id))

    get_item = result.scalar_one_or_none()

    if get_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись не найдена или доступ запрещен"
        )
    return get_item

# Удаление записей из хранилища
@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удаление данных из хранилища",
    description="Возможность удалить данные из хранилища"
)

async def delete_vault_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
    select(VaultItem).where(
        VaultItem.id == item_id,
        VaultItem.user_id == current_user.id
    )
)
    del_item = result.scalar_one_or_none()

    if not del_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись не найдена"
        )
    
    await db.delete(del_item)
    await db.commit()
    
    return None


# Обновление данных в хранилище
@router.put(
    "/{item_id}",
    response_model=VaultItemResponse,
    status_code=status.HTTP_200_OK,
    summary="Обновление данных в хранилище",
    description="Возможность обновить данные из хранилища"
)

async def update_vault_item(
    item_id: int,
    user_data: VaultItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(VaultItem).where(VaultItem.id == item_id, VaultItem.user_id == current_user.id))
    item = result.scalar_one_or_none()

    if item is None:
        raise HTTPException(
            status_code=status.HTTP_204_NO_CONTENT,
            detail="Запись не найдена"
        )
    
    update_data = user_data.model_dump(exclude_unset=True) # Обновляем записи, которые явно указали

    # Проходим циклом по словарю
    for key, value in update_data.items():
        # setattr - метод динамического обновления данных
        setattr(item, key, value)
    
    await db.commit()
    await db.refresh(item)
    
    return item