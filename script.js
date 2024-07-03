document.addEventListener('DOMContentLoaded', () => {
    const listsContainer = document.getElementById('lists'); // Обертка для списка задач
    const addListBtn = document.getElementById('js-addListBtn'); // Кнопка добавления
    let lists = JSON.parse(localStorage.getItem('taskLists')) || []; // Смотрим на локальное хранилище

    const saveLists = () => {
        localStorage.setItem('taskLists', JSON.stringify(lists));
    }; // Сохраняем в локальное хранилище. Можно сохранять в куки

    const createListElement = (list, index) => {
        const listElement = document.createElement('div'); 
        listElement.className = 'list'; // Добавляем в наш список div.list

        const completedTasks = list.tasks.filter(task => task.completed).length; // Фильтруем завершенные таски для общего кол-ва

        listElement.innerHTML = `
            <div class="list-title">
                <input type="text" placeholder="Введите название списка" ${list.title && ' value="'+ list.title + '"' }>
                <span>(${completedTasks}/${list.tasks.length})</span>
                <button class="js-deleteList siteButton min red">Удалить список</button>
            </div>
            <ul></ul>
            <button class="js-addTask siteButton min">Добавить задачу</button>
        `; // Формируем HTML нашего списка input для названия

        listElement.querySelector('input[type="text"]').addEventListener('input', (e) => {
            list.title = e.target.value; 
            saveLists();
        }); // Меняем название списка и сохраняем

        listElement.querySelector('.js-deleteList').addEventListener('click', () => {
            lists.splice(index, 1);
            renderLists();
            saveLists();
        });

        const tasksContainer = listElement.querySelector('ul');
        list.tasks.forEach((task, taskIndex) => {
            tasksContainer.appendChild(createTaskElement(task, index, taskIndex));
        });

        listElement.querySelector('.js-addTask').addEventListener('click', () => {
            list.tasks.push({ text: '', completed: false });
            renderLists();
            saveLists();
        });

        return listElement;
    }; // Добавление списка

    const createTaskElement = (task, listIndex, taskIndex) => {
        const taskElement = document.createElement('li');
        taskElement.className = task.completed ? 'completed' : ''; // Устанавливаем клас completed для стилизации но необязательно
        taskElement.innerHTML = `
            <div>
                <input type="text" placeholder="Введите название задачи" ${task.text && ' value="'+ task.text + '"' } ${task.completed ? 'disabled' : ''}>
                <label>
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 122.877 101.052" enable-background="new 0 0 122.877 101.052" xml:space="preserve"><g><path d="M4.43,63.63c-2.869-2.755-4.352-6.42-4.427-10.11c-0.074-3.689,1.261-7.412,4.015-10.281 c2.752-2.867,6.417-4.351,10.106-4.425c3.691-0.076,7.412,1.255,10.283,4.012l24.787,23.851L98.543,3.989l1.768,1.349l-1.77-1.355 c0.141-0.183,0.301-0.339,0.479-0.466c2.936-2.543,6.621-3.691,10.223-3.495V0.018l0.176,0.016c3.623,0.24,7.162,1.85,9.775,4.766 c2.658,2.965,3.863,6.731,3.662,10.412h0.004l-0.016,0.176c-0.236,3.558-1.791,7.035-4.609,9.632l-59.224,72.09l0.004,0.004 c-0.111,0.141-0.236,0.262-0.372,0.368c-2.773,2.435-6.275,3.629-9.757,3.569c-3.511-0.061-7.015-1.396-9.741-4.016L4.43,63.63 L4.43,63.63z"/></g></svg></span>
                </label>
            </div>
            <button class="js-deleteTask siteButton min red">x</button>
        `; // Формируем HTML 

        taskElement.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            task.completed = e.target.checked;
            renderLists();
            saveLists();
        });

        taskElement.querySelector('input[type="text"]').addEventListener('input', (e) => {
            task.text = e.target.value;
            saveLists();
        });

        taskElement.querySelector('.js-deleteTask').addEventListener('click', () => {
            lists[listIndex].tasks.splice(taskIndex, 1);
            renderLists();
            saveLists();
        });

        return taskElement;
    }; // Добавление задачи

    const renderLists = () => {
        listsContainer.innerHTML = '';

        if(lists.length === 0){
            listsContainer.innerHTML = '<div class="list-empty">Список пуст</div>'
        }

        lists.forEach((list, index) => {
            listsContainer.appendChild(createListElement(list, index));
        });

    }; // Отображаем данные

    addListBtn.addEventListener('click', () => {
        lists.push({ title: '', tasks: [] });
        renderLists();
        saveLists();
    }); // Кнопка добавления списка

    renderLists(); // Запускаем функцию
});