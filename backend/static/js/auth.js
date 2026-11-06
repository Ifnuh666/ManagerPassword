document.addEventListener('DOMContentLoaded', function(){

    const loginForm = document.getElementById('login-form')

    const emailInput = document.getElementById('login')

    const passwordInput = document.getElementById('password')

    const submitBtn = document.getElementById('submit-btn')

    if (!loginForm) return;

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault()

        const email = emailInput.value.trim()
        const password = passwordInput.value

        if (!email || !password){
            alert('Пожалуйста, заполните все поля')
            return;
        }
        
        // С помощью fetch делаем запрос
        submitBtn.disabled = true;
        submitBtn.textContent = 'Входим...';

        try 
        {
            const response = await fetch('/api/v1/auth/login',
                {
                    method: 'POST', // Тут мы отправялем POST запрос на адрес (/api/v1/auth/login) и ждем ответ
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

            if (!response.ok){
                // Превращаем текст ошибки в JS-объект
                const errorData = await response.json();
                console.error('Ошибка от сервера:', errorData); // Выводим в консоли ошибку
                
                
                let errorMessage = 'Ошибка входа';
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
            console.log('Успешный вход!', data)

            // Сохраняем токен в localStorage
            localStorage.setItem('authToken', data.access_token);
            localStorage.setItem('tokenType', data.token_type);

            // Перенаправление на главную страницу
            window.location.href = '/';
        }
        catch(error) 
        {
            console.error('Ошибка:', error.message || error);
            alert(error.message);
        }
        finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Войти';
        }

    })
})