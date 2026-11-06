document.addEventListener('DOMContentLoaded', async function(){

    const logout = document.getElementById('exit-button');

    const token = localStorage.getItem('authToken');

    const passwordBox = document.getElementById('password-user');

    const loginBox = document.getElementById('login-user');

    passwordBox.value = "••••••••";
    passwordBox.setAttribute('readonly', true);

    loginBox.setAttribute('readonly', true);

    if (!token) {
        window.location.href = '/auth';
        return;
    }

    else 
    {
        try 
        {
            const response = await fetch('/api/v1/auth/me',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Не удалось получить данные пользователя');
                }
                const data = await response.json();
                document.getElementById('login-user').value = data.email;

        }
        catch(error) 
        {
            console.error('Ошибка при загрузке профиля:', error);
            localStorage.clear();
            window.location.href = '/auth';
        }
    }

    if (logout) {
        logout.addEventListener('click', function() {
            // Удаляем токен из хранилища
            localStorage.removeItem('authToken');
            localStorage.removeItem('tokenType');
            
            window.location.href = '/auth';
        });
    }
})