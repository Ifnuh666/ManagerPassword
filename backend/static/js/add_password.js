document.addEventListener('DOMContentLoaded', function(){

    const post_password = document.getElementById('post_password');

    const siteNameInput = document.getElementById('site_name');

    const LoginInput = document.getElementById('login');

    const passwordInput = document.getElementById('password');

    const add_password_btn = document.getElementById('add_password_btn');

    if (!post_password) return;

    post_password.addEventListener('submit', async function(event) {
        event.preventDefault()

        const SiteName = siteNameInput.value.trim()
        const Login = LoginInput.value
        const Password = passwordInput.value

        if (!SiteName || !Login || !Password) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const token = localStorage.getItem('authToken');

        add_password_btn.disabled = true;
        add_password_btn.textContent = 'Добавляю...';

        try {
            const response = await fetch('/api/v1/vault/',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        site_name: SiteName,
                        login: Login,
                        encrypted_password: Password
                    })
                });
            if (!response.ok){
                // Превращаем текст ошибки в JS-объект
                const errorData = await response.json();
                console.error('Ошибка от сервера:', errorData); // Выводим в консоли ошибку
                
                
                let errorMessage = 'Ошибка добавления пароля!';
                // Тут проверка, если поле detail (ответ от сервера) является строкой, то в переменную errorMessage сохраняем текст ошибки
                if (typeof errorData.detail === 'string') {
                    errorMessage = errorData.detail;
                } else if (Array.isArray(errorData.detail)) { // Тут проверяем, если detail это массив (т.е. не прошли валидацию Pydantic), то берем первый элмент массива и достаем (с помощью msg) текст ошибки
                    errorMessage = errorData.detail[0].msg || 'Ошибка валидации';
                }
                
                // Вылетает из блока try в случае какой либо ошикбки и нас переносит в catch
                throw new Error(errorMessage);
            }
            const data = await response.json() // Читаем ответ от сервера и сохраняем его в переменную
            console.log('Пароль успешно добавлен!', data)
            alert("Пароль успешно добавлен!");
            post_password.reset();


        }
        catch(error) {
            console.error('Ошибка:', error.message || error);
            alert(error.message);
        }
        finally {
            add_password_btn.disabled = false;
            add_password_btn.textContent = 'Добавить пароль';
        }
    })
})