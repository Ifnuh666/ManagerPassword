from core.security import create_access_token, decode_token
from datetime import timedelta

# Создаём токен
email = "test@example.com"

# 1. Создаем токен (по умолчанию 30 минут)
token = create_access_token(data={"sub": email})

print("🔑 Созданный токен:")
print(token)
print()

# Декодируем токен
decoded = decode_token(token)

print("🔓 Декодированные данные:")
print(decoded)
print()

# Проверяем, что email совпадает
if decoded and decoded.get("sub") == email:
    print("✅ Токен работает корректно!")
else:
    print("❌ Ошибка в токене")

# 3. Тестируем кастомное время (например, 1 минута)
# Тут мы проверяем как работает параметр expires_minutes, а именно как он работает с разным временем
print("\n🧪 Тестируем токен с кастомным временем (1 минута):")
short_token = create_access_token(data={"sub": email}, expires_minutes=2)
short_decoded = decode_token(short_token)
print(f"Успешно декодирован: {short_decoded is not None}")

# 4. Тестируем невалидный токен (подделка)
print("\n🧪 Тестируем поддельный токен:")
fake_decoded = decode_token("fake.token.string")
print(f"Результат декодирования подделки: {fake_decoded}")  # Должен быть None