document.addEventListener('DOMContentLoaded', function(){

    const registrationForm = document.getElementById('registration-form');

    const emailInput = document.getElementById('login');

    const passwordInput = document.getElementById('password');

    const repeatPasswordlInput = document.getElementById('repeat_password');

    const submitBtn = document.getElementById('submit-btn')

    if (!registrationForm) return;

    registrationForm.addEventListener('submit', async function(event){
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const repeat_password = repeatPasswordlInput.value;

        if (!email || !password || !repeat_password){
            alert('Заполните все поля!');
            return;
        }

        if (password !== repeat_password){
            alert('Пароли не совпадают!');
            return;
        }

        if (password.length < 8){
            alert('Пароль должен быть больше 8 символов!');
            return;
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }

        if (!validateEmail(email)){
            alert('Введите корректный адрес электронной почты!');
            return;
        }

        // С помощью fetch делаем запрос
        submitBtn.disabled = true;
        submitBtn.textContent = 'Регистрируем...';

        try{
            const response = await fetch('/api/v1/auth/register',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
            if (!response.ok){
                // Превращаем текст ошибки в JS-объект
                const errorData = await response.json();
                console.error('Ошибка от сервера:', errorData); // Выводим в консоли ошибку
                
                
                let errorMessage = 'Ошибка регистрации';
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
            console.log('Регистрация прошла успешна!', data)

            alert('Регистрация прошла успешно! Теперь вы можете войти.');

            // Перенаправление на страницу авторизации
            window.location.href = '/auth'

        }
        catch(error){
            console.error('Ошибка:', error.message || error);
            alert(error.message);
        }
        finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Зарегистрироваться';
        }
    })
})