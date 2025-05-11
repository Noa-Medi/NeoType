import { todosRender } from "../todoPage.js";
export function topPartSetup(todo) {
    // Initial render
    renderTopPart(todo);

    // Set up event listeners only once
    const topPartContainerElem = document.querySelector('.top-part-todo-container');
    if (!topPartContainerElem.dataset.initialized) {
        topPartContainerElem.addEventListener('click', handleTopPartClick);
        topPartContainerElem.dataset.initialized = true;
    }
}
function handleTopPartClick(event) {
    const todo = this.todo; // Assuming todo is attached to the element
    const checkboxElem = event.target.closest('.todo-checkbox-icon-container');
    const textContentElem = event.target.closest('.todo-text-container');
    const importantIconElem = event.target.closest('.todo-important-icon-container');

    if (checkboxElem) {
        todo.isCompleted = !todo.isCompleted;
        renderTopPart(todo);
        todosRender();
        return;
    }

    if (textContentElem && !textContentElem.classList.contains('has-input')) {
        switchToInputMode(textContentElem, todo);
        return;
    }

    if (importantIconElem) {
        todo.isImportant = !todo.isImportant;
        renderTopPart(todo);
    }
}


function switchToInputMode(textContainer, todo) {
    // Create input element
    const input = document.createElement('input');
    input.type = 'text';
    input.value = todo.text;
    input.className = 'todo-text-content';

    // Save reference to the original text
    input.dataset.originalText = todo.text;

    // Replace content with input
    textContainer.innerHTML = '';
    textContainer.appendChild(input);
    textContainer.classList.add('has-input');

    // Focus and select all text
    input.focus();
    input.select();

    // Handle blur (when input loses focus)
    input.addEventListener('blur', () => {
        const newText = input.value.trim();
        todo.text = newText || input.dataset.originalText; // Revert to original if empty
        textContainer.classList.remove('has-input');
        renderTopPart(todo);
    });

    // Handle Enter key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur(); // Triggers the blur event
        }
    });
}


function renderTopPart(todo) {
    const topPartContainerElem = document.querySelector('.top-part-todo-container');
    topPartContainerElem.todo = todo; // Attach todo data to element

    checkboxElementSetup(todo);
    textContentElementSetup(todo);
    importantElementSetup(todo);
}

// Keep your existing setup functions
function checkboxElementSetup(todo) {
    const checkboxElem = document.querySelector('.todo-checkbox-icon');
    checkboxElem.src = todo.isCompleted ? 'assets/icons/checklist.png' : 'assets/icons/checklist-with-out-check-mark.png';
}

function textContentElementSetup(todo) {
    const textContentElem = document.querySelector('.todo-text-content');
    textContentElem.value = todo.text;
    textContentElem.style.textDecoration = todo.isCompleted ? 'line-through' : 'none';
}

function importantElementSetup(todo) {
    const importantElem = document.querySelector('.todo-important-icon');
    importantElem.src = todo.isImportant ? 'assets/icons/star-filled.png' : 'assets/icons/star.png';
}