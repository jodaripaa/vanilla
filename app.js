const API_URL = 'https://todoapitest.juansegaliz.com/todos';
let currentFilter = 'all';
let editingId = null;

// Elements
const form = document.getElementById('todoForm');
const todosContainer = document.getElementById('todosContainer');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Initialize
loadTodos();
setupEventListeners();

function setupEventListeners() {
    form.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            loadTodos();
        });
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const todo = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        isCompleted: document.getElementById('isCompleted').checked
    };

    if (editingId) {
        await updateTodo(editingId, todo);
    } else {
        await createTodo(todo);
    }
}

async function createTodo(todo) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            showNotification('Tarea creada exitosamente', 'success');
            resetForm();
            loadTodos();
        }
    } catch (error) {
        showNotification('Error al crear la tarea', 'error');
    }
}

async function updateTodo(id, todo) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(todo)
        });

        if (response.ok) {
            showNotification('Tarea actualizada exitosamente', 'success');
            resetForm();
            loadTodos();
        }
    } catch (error) {
        showNotification('Error al actualizar la tarea', 'error');
    }
}

async function deleteTodo(id) {
    if (!confirm('¿Está seguro de eliminar esta tarea?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showNotification('Tarea eliminada exitosamente', 'success');
            loadTodos();
        }
    } catch (error) {
        showNotification('Error al eliminar la tarea', 'error');
    }
}

async function loadTodos() {
    try {
        const response = await fetch(API_URL);
        const payload = await response.json();

        // The API may return either an array directly or an object { code, data: [...] }
        const todos = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.data) ? payload.data : []);

        let filteredTodos = todos;
        if (currentFilter === 'completed') {
            filteredTodos = todos.filter(t => t.isCompleted);
        } else if (currentFilter === 'pending') {
            filteredTodos = todos.filter(t => !t.isCompleted);
        }

        renderTodos(filteredTodos);
    } catch (error) {
        console.error('loadTodos error:', error);
        todosContainer.innerHTML = `<div class="empty-state">Error al cargar las tareas<br><small>${escapeHtml(error.message || String(error))}</small></div>`;
    }
}

function renderTodos(todos) {
    if (todos.length === 0) {
        todosContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No hay tareas</h3>
                <p>Comienza creando una nueva tarea</p>
            </div>
        `;
        return;
    }

    todosContainer.innerHTML = `
        <div class="todos-grid">
            ${todos.map(todo => `
                <div class="todo-card ${todo.isCompleted ? 'completed' : ''}">
                    <div class="todo-header">
                        <h3 class="todo-title">${escapeHtml(todo.title)}</h3>
                        <span class="todo-status ${todo.isCompleted ? 'status-completed' : 'status-pending'}">
                            ${todo.isCompleted ? 'Completada' : 'Pendiente'}
                        </span>
                    </div>
                    <p class="todo-description">${escapeHtml(todo.description || 'Sin descripción')}</p>
                    <div class="todo-actions">
                        <button class="btn-edit btn-small" onclick="editTodo('${todo.id}')">Editar</button>
                        <button class="btn-delete btn-small" onclick="deleteTodo('${todo.id}')">Eliminar</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function editTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const todo = await response.json();

        document.getElementById('todoId').value = todo.id;
        document.getElementById('title').value = todo.title;
        document.getElementById('description').value = todo.description || '';
        document.getElementById('isCompleted').checked = todo.isCompleted;

        editingId = id;
        submitBtn.textContent = 'Actualizar Tarea';
        cancelBtn.style.display = 'block';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        showNotification('Error al cargar la tarea', 'error');
    }
}

function resetForm() {
    form.reset();
    document.getElementById('todoId').value = '';
    editingId = null;
    submitBtn.textContent = 'Crear Tarea';
    cancelBtn.style.display = 'none';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Expose functions used by inline onclick handlers
window.editTodo = editTodo;
window.deleteTodo = deleteTodo;