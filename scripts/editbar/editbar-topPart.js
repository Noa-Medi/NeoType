import { todosRender } from "../todoPage.js";
import { getImportantTodos } from "../logic/importantLogic.js";
import { saveInLocalStorage } from "../categories.js";
let isTopPartInitialized = false;

export function topPartSetup(todo) {
    renderTopPart(todo);

    const topPartContainerElem = document.querySelector('.top-part-todo-container');
    if (isTopPartInitialized) return;

    topPartContainerElem.addEventListener('click', (event) => {
        const todo = getCurrentTodo();

        if (event.target.closest('.todo-checkbox-icon-container')) {
            todo.isCompleted = !todo.isCompleted;
            renderTopPart(todo);
            saveInLocalStorage();
            todosRender();
        }
        else if (event.target.closest('.todo-important-icon-container')) {
            todo.isImportant = !todo.isImportant;
            renderTopPart(todo);
            saveInLocalStorage();
            getImportantTodos();
            todosRender();
        }
    });

    const textInput = topPartContainerElem.querySelector('.todo-text-content');
    textInput.addEventListener('input', () => {
        textInput.style.height = 'auto';
        textInput.style.height = (textInput.scrollHeight) + 'px';
    })
    textInput.addEventListener('blur', () => {
        const todo = getCurrentTodo();
        todo.text = textInput.value.trim();
        saveInLocalStorage();
        renderTopPart(todo);
        todosRender();
    });

    isTopPartInitialized = true;
}

function getCurrentTodo() {
    const editbarContainer = document.querySelector('.editbar-container');
    return editbarContainer.currentTodo;
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