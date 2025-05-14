import { todosRender } from "../todoPage.js";

export function topPartSetup(todo) {
    // Initial render
    renderTopPart(todo);

    // Set up event listeners only once
    const topPartContainerElem = document.querySelector('.top-part-todo-container');
    if (!topPartContainerElem.dataset.initialized) {
        // Checkbox click handler
        const checkboxElem = topPartContainerElem.querySelector('.todo-checkbox-icon-container');
        checkboxElem.addEventListener('click', () => {
            todo.isCompleted = !todo.isCompleted;
            renderTopPart(todo);
            todosRender();
        });

        // Important icon click handler
        const importantIconElem = topPartContainerElem.querySelector('.todo-important-icon-container');
        importantIconElem.addEventListener('click', () => {
            todo.isImportant = !todo.isImportant;
            renderTopPart(todo);
            todosRender();
        });

        // Text input handler
        const textInput = topPartContainerElem.querySelector('.todo-text-content');

        // Auto-resize functionality
        textInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Save on blur
        textInput.addEventListener('blur', () => {
            todo.text = textInput.value.trim();
            renderTopPart(todo);
            todosRender();
        });

        // Save on Enter key (without newline)
        textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                textInput.blur();
                todo.text = textInput.value.trim();
                renderTopPart(todo);
                todosRender();
            }
        });

        topPartContainerElem.dataset.initialized = true;
    }
}

function renderTopPart(todo) {
    // Update checkbox
    const checkboxElem = document.querySelector('.todo-checkbox-icon');
    checkboxElem.src = todo.isCompleted
        ? 'assets/icons/checklist.png'
        : 'assets/icons/checklist-with-out-check-mark.png';

    // Update text input
    const textInput = document.querySelector('.todo-text-content');
    textInput.value = todo.text;
    textInput.style.textDecoration = todo.isCompleted ? 'line-through' : 'none';
    textInput.style.height = 'auto';
    textInput.style.height = (textInput.scrollHeight) + 'px';

    // Update important icon
    const importantElem = document.querySelector('.todo-important-icon');
    importantElem.src = todo.isImportant
        ? 'assets/icons/star-filled.png'
        : 'assets/icons/star.png';
}