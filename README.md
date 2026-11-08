# Manager Password
Это безопасное веб-приложение для надежного хранения, управления и защиты учетных данных пользователей. Предоставление пользователям удобного и защищенного инструмента для хранения логинов и паролей от различных сервисов, исключающего необходимость запоминать их или хранить в небезопасных местах (например, в текстовых файлах или непроверенных расширениях браузера).

## Содержание
- [Технологии](#технологии)

## Технологии
- [Python](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/ru/tutorial/)
- [Pydantic](https://habr.com/ru/companies/amvera/articles/851642/)
- [SQLAlchemy](https://pythonru.com/biblioteki/vvedenie-v-sqlalchemy)
- [PostgreSQL](https://www.postgresql.org/)
- [JS](https://learn.javascript.ru/)

## Использование
Для запуска "менеджера" нужно установить все библиотеки из файла requirements.txt:

1. Перед этим создайте виртуальное окружение:
```sh
python -m venv .venv

```

2. Активируйте его:
```sh
.venv\Scripts\activate

```

3. Перейдите в дерикторию backend:
```sh
cd\backend

```

4. Установите библиотеки с помощью команды (в venv):
```sh
pip install -r requirements.txt

```

5. В переменные из файла .env.example впишите свои значения и переименуйте файл в .env:

6. Запустите приложение (из пути, в котором лежит файл main.py):
```sh
fastapi dev main.py

```
