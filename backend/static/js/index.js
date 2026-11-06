document.addEventListener('DOMContentLoaded', function() {
    // 1. ПРОВЕРКА ТОКЕНА
    const token = localStorage.getItem('authToken');
    if (!token) {
        window.location.href = '/auth';
        return;
    }

    // Логика модального окна для редактирования
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const cancelEditBtn = document.getElementById('cancelEdit');

    // Функция открытия окна
    window.openEditModal = function(id, site, login, password) {
        document.getElementById('editItemId').value = id;
        document.getElementById('editSiteName').value = site;
        document.getElementById('editLogin').value = login;
        document.getElementById('editPassword').value = password;
        editModal.style.display = 'flex';
    };

    // Функция закрытия окна
    function closeEditModal() {
        editModal.style.display = 'none';
        editForm.reset();
    }

    cancelEditBtn.addEventListener('click', closeEditModal);

    // Закрытие при клике вне окна (на затемненный фон)
    editModal.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });

    // Обработка отправки формы (Сохранение изменений)
    editForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('editItemId').value;
        const tokenUser = localStorage.getItem('authToken');
        
        const updatedData = {
            site_name: document.getElementById('editSiteName').value,
            login: document.getElementById('editLogin').value,
            encrypted_password: document.getElementById('editPassword').value
        };

        try {
            const response = await fetch(`/api/v1/vault/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenUser}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка при сохранении');
            }

            alert('✅ Запись успешно обновлена!');
            closeEditModal();
            

            loadVaultItems(); 

        } catch (error) {
            console.error('Ошибка обновления:', error);
            alert('❌ Не удалось сохранить изменения: ' + error.message);
        }
    });

    // Логика модального окна для удаления
    const delModal = document.getElementById('delModal');
    const delForm = document.getElementById('delForm');
    const cancelDeleteBtn = document.getElementById('cancelDelete'); // Уникальный ID

    window.openDeleteModal = function(id, site, login, password) {
        document.getElementById('delItemId').value = id;
        document.getElementById('delSiteName').value = site;
        document.getElementById('delLogin').value = login;
        document.getElementById('delPassword').value = password;
        delModal.style.display = 'flex';
    };

    function closeDeleteModal() {
        delModal.style.display = 'none';
        delForm.reset();
    }

    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    delModal.addEventListener('click', function(event) {
        if (event.target === delModal) {
            closeDeleteModal();
        }
    });

    delForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const id = document.getElementById('delItemId').value;
        const tokenUser = localStorage.getItem('authToken');

        try {
            const response = await fetch(`/api/v1/vault/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${tokenUser}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Ошибка при удалении');
            }

            alert('✅ Запись успешно удалена!');
            closeDeleteModal();
            loadVaultItems(); // Перерисовываем список

        } catch (error) {
            console.error('Ошибка удаления:', error);
            alert('❌ Не удалось удалить: ' + error.message);
        }
    });


    // Функция кнопки "Добавить пароль"

    const modal = document.getElementById('modal');
    const addPassword = document.getElementById('add_password');
    const cancelWindow = document.getElementById('cancelWindow');

    // Функция отображения карточек

    // Переменная для хранения знаечния из выпадающего списка
    const sortType = document.getElementById('password').value; 

    async function loadVaultItems() {
        const tokenUser = localStorage.getItem('authToken');
        const currentSortType = document.getElementById('password').value; 

        try {
            const response = await fetch(`/api/v1/vault?sort=${currentSortType}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenUser}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Ошибка от сервера:', errorData);
                window.location.href = '/auth';
                return;
            }

            const data = await response.json();
            const vaultList = document.getElementById('vault-list');

            vaultList.style.display = 'flex';
            vaultList.style.flexDirection = 'column';
            vaultList.style.gap = '15px';
            vaultList.innerHTML = '';

            if (data.length === 0) {
                vaultList.innerHTML = '<p style="text-align: center; color: #666; margin-top: 20px;">У вас пока нет сохранённых записей. Нажмите "Добавить пароль".</p>';
                return;
            }

            // Отрисовка карточек
            data.forEach(item => {
                const dateAdded = item.created_at 
                    ? new Date(item.created_at).toLocaleDateString('ru-RU') 
                    : 'Дата неизвестна';

                const cardHTML = `
                    <div class="password-card">
                        <div class="site-name">
                            <p>${item.site_name}</p>
                            <span class="card-date">Добавлено: ${dateAdded}</span>
                        </div>
                        <div class="line"></div>
                        <div class="block-login">
                            <p><strong>Логин:</strong> ${item.login}</p>
                            <button class="copy-btn" data-copy="${item.login}">Копировать</button>
                        </div>
                        <div class="block-password">
                            <p><strong>Пароль:</strong> <code id="pass-text-${item.id}">••••••••</code></p>
                            <button class="toggle-password-btn" data-id="${item.id}" data-real-pass="${item.encrypted_password}" title="Показать/скрыть пароль">
                                👁️
                            </button>
                            
                            <button class="copy-btn" data-copy="${item.encrypted_password}">Копировать</button>
                            <button class="edit-btn" 
                                    data-id="${item.id}" 
                                    data-site="${item.site_name}" 
                                    data-login="${item.login}" 
                                    data-password="${item.encrypted_password}">
                                Изменить
                            </button>
                            <button class="delete-btn" 
                                    data-id="${item.id}"
                                    data-site="${item.site_name}"
                                    data-login="${item.login}"
                                    data-password="${item.encrypted_password}">
                                Удалить
                            </button>
                        </div>
                    </div>
                `;
                vaultList.innerHTML += cardHTML;
            });

            // Навешиваем обработчики на динамически созданные кнопки "Изменить"
            attachEditListeners();
            attachDeleteListeners();
            attachTogglePasswordListeners();

            // Навешиваем обработчики на динамически созданные кнопки "Копировать"
            const allCopyButtons = document.querySelectorAll('.copy-btn');
            allCopyButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const textToCopy = this.getAttribute('data-copy');
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            alert('✅ Текст успешно скопирован!');
                        })
                        .catch(err => {
                            console.error('Ошибка копирования:', err);
                            alert('❌ Не удалось скопировать текст');
                        }
                    );
                });
            });

        } catch (error) {
            console.error('Ошибка:', error.message || error);
            alert(error.message);
        }
    }

    const sortSelect = document.getElementById('password');
    sortSelect.addEventListener('change', () => {
        loadVaultItems(); 
    });
    
    loadVaultItems();

    // Функция для навешивания событий на кнопки редактирования
    function attachEditListeners() {
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const site = this.getAttribute('data-site');
                const login = this.getAttribute('data-login');
                const password = this.getAttribute('data-password');
                
                openEditModal(id, site, login, password);
            });
        });
    }
    loadVaultItems();

    // Функция для навешивания событий на кнопки удаления
    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const site = this.getAttribute('data-site');
                const login = this.getAttribute('data-login');
                const password = this.getAttribute('data-password');
                
                openDeleteModal(id, site, login, password);
            });
        });
    }
    loadVaultItems();

    function attachTogglePasswordListeners() {
        const toggleBtn = document.querySelectorAll('.toggle-password-btn');
        toggleBtn.forEach(btn => {
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const realPass = this.getAttribute('data-real-pass');
                
                const passElement = document.getElementById('pass-text-' + id);
                
                if (passElement.textContent === '••••••••') {
                    passElement.textContent = realPass;
                    this.textContent = '🙈';
                } else {
                    passElement.textContent = '••••••••';
                    this.textContent = '👁️';
                }
            });
        });
        
    }
});