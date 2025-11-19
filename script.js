document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addBtn = document.getElementById('add-btn');
    const taskList = document.getElementById('task-list');
    const dateDisplay = document.getElementById('date-display');

    // Set current date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);

    // Load tasks from Local Storage
    loadTasks();

    // Save tasks to Local Storage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks function
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        // Reverse the array because addTask prepends
        tasks.slice().reverse().forEach(task => {
            addTask(task.text, task.completed);
        });
    }

    // Add task function
    function addTask(text = null, isCompleted = false) {
        const taskText = text || taskInput.value.trim();

        if (taskText === '') return;

        const li = document.createElement('li');
        if (isCompleted) {
            li.classList.add('completed');
        }

        const span = document.createElement('span');
        span.textContent = taskText;
        li.appendChild(span);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        deleteBtn.ariaLabel = 'Delete task';

        // Toggle complete on click
        li.addEventListener('click', () => {
            li.classList.toggle('completed');
            saveTasks();
        });

        // Delete task
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            li.style.opacity = '0';
            li.style.transform = 'translateX(20px)';
            setTimeout(() => {
                li.remove();
                saveTasks();
            }, 200);
        });

        li.appendChild(deleteBtn);

        taskList.prepend(li);

        if (!text) {
            taskInput.value = '';
            taskInput.focus();
            saveTasks();
        }
    }

    // Event listeners
    addBtn.addEventListener('click', () => addTask());

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
