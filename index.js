const form = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-form__input');
const addTodoButton = document.querySelector('.todo-form__button');
const todoListContainer = document.querySelector('.todo-list');
const alertMessage = document.querySelector('.hidden');

// Functions

const saveTodos = (todo) => {
    let todos = (localStorage.getItem('todos') === null) ? [] : JSON.parse(localStorage.getItem('todos'));

    todos.push(todo);
    localStorage.setItem('todos', JSON.stringify(todos));
}

const getSavedTodos = () => ((localStorage.getItem('todos') === null) ? [] : JSON.parse(localStorage.getItem('todos')));

const updateTodos = (elementValue, operation, newValue = null) => {
    const todos = getSavedTodos();
    const index = todos.indexOf(elementValue);

    if (operation === 'edit') {
        todos.splice(index, 1, newValue);
    } else if (operation === 'delete') {
        const deletedItem = todos[index];
        todos.splice(index, 1);
    }

    localStorage.setItem('todos', JSON.stringify(todos));
}

const createTodoItem = (value) => (`
    <li class="todo-list__item">
        <span class="todo-list-item__text">${value}</span>
        <div class="form-buttons__wrapper">
            <button type="button" class="todo-button" data-action="check">
                <i class="fa fa-check-square"></i>
            </button>
            <button type="button" class="todo-button" data-action="edit">
                <i class="fa fa-edit"></i>
            </button>
            <button type="button" class="todo-button" data-action="delete">
                <i class="fa fa-trash"></i>
            </button>
        </div>
    </li>`
)

const renderTodos = () => {
    const todos = getSavedTodos();
    let str = '';

    if (todos.length) {
        str = todos.map(todo => createTodoItem(todo)).join('');
        if (!todoListContainer.classList.contains('show')) todoListContainer.classList.add('show');
        todoListContainer.insertAdjacentHTML('beforeend', str);
    }
}

const addNewTodo = () => {
    const value = todoInput.value;
    if (value.length) {
        if (!todoListContainer.classList.contains('show')) todoListContainer.classList.add('show');
        todoListContainer.insertAdjacentHTML('beforeend', createTodoItem(value));
        saveTodos(value);
        todoInput.value = '';
    } else {
        alertMessage.innerText = 'Вы не заполнили поле';
        todoInput.style.border = '1px solid red';
    }
}

const createModalPopup = (value) => {
    const str = `
        <div class="modal-overlay">
            <div class="modal">
                <h5>Редактирование задачи</h5>
                <span class="modal-close" data-action="cancel">&times;</span>
                <form class="modal-form">
                    <input type="text" class="todo-form__input modal-input" value="${value}" />
                    <div class="modal-buttons__wrapper">
                        <button type="submit" class="todo-button" data-action="save"><i class="fa fa-save"></i>Сохранить</button>
                        <button type="button" class="todo-button" data-action="cancel"><i class="fa fa-ban"></i>Отмена</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', str);
}

const editTodoItem = (todo, value) => {
    createModalPopup(value);
    const modalOverlay = document.querySelector('.modal-overlay');
    const modal = document.querySelector('.modal-form');

    modal.addEventListener('submit', e => {
        e.preventDefault();

        const editInput = document.querySelector('.modal-input');
        todo.innerText = editInput.value;
        updateTodos(value, 'edit', editInput.value);
        modalOverlay.remove();

    })

    modal.parentNode.addEventListener('click', e => {
        if (e.target.dataset.action === 'cancel') {
            modalOverlay.remove();
        }
    })
}

const deleteTodoItem = (elem) => {
    const parent = elem.parentNode;
    elem.classList.add('ondelete');
    elem.insertAdjacentHTML('beforeend', `
        <div class="deleted-message">Удалено <i class="fa fa-undo"></i></div>
    `)

    setTimeout(() => {
        elem.remove();
        updateTodos(elem.children[0].innerText, 'delete');
    }, 1000);

    if (!parent.children.length) {
        parent.classList.remove('show');
    }
}

const checkTodoItem = (elem) => {
    elem.classList.toggle('completed');
}

const init = () => {
    const dateContainer = document.querySelector('.today-date');
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short'
    }
    let now = new Date();
    dateContainer.innerText = now.toLocaleString('ru-RU', options);

    renderTodos();

    form.addEventListener('submit', e => {
        e.preventDefault();
        addNewTodo();
    });

    todoListContainer.addEventListener('click', e => {
        const todo = e.target.parentNode.parentNode.previousElementSibling;
        switch (e.target.parentNode.dataset.action) {
            case 'edit':
                editTodoItem(todo, todo.innerText);
                break;
            case 'delete':
                deleteTodoItem(todo.parentNode);
                break;
            case 'check':
                checkTodoItem(todo.parentNode);
                break;
        }
    });
}

// Listeners

document.addEventListener('DOMContentLoaded', init);