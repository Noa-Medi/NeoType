import { todosRender } from "../todoPage.js";
import { getImportantTodos } from "../logic/importantLogic.js";
import { saveInLocalStorage } from "../categories.js";

export function topPartSetup(todo, saveHandler) {
    const newContainer = document.querySelector('.top-part-todo-container').cloneNode(true);
    document.querySelector('.top-part-todo-container').replaceWith(newContainer);

    renderTopPart(todo, newContainer);

    newContainer.addEventListener('click', (event) => {
        const todo = getCurrentTodo();
        if (event.target.closest('.todo-checkbox-icon-container')) {
            todo.isCompleted = !todo.isCompleted;
            renderTopPart(todo, newContainer);
            saveHandler.saveChanges();
            saveInLocalStorage();
            todosRender();
        } else if (event.target.closest('.todo-important-icon-container')) {
            todo.isImportant = !todo.isImportant;
            renderTopPart(todo, newContainer);
            saveHandler.saveChanges();
            saveInLocalStorage();
            getImportantTodos();
            todosRender();
        }
    });

    const textInput = newContainer.querySelector('.todo-text-content');
    textInput.addEventListener('input', () => {
        textInput.style.height = 'auto';
        textInput.style.height = textInput.scrollHeight + 'px';
    });

    textInput.addEventListener('blur', () => {
        const todo = getCurrentTodo();
        todo.text = textInput.value.trim();
        saveHandler.saveChanges();
        saveInLocalStorage();
        todosRender();
    });
}

function getCurrentTodo() {
    const editbarContainer = document.querySelector('.editbar-container');
    return editbarContainer.currentTodo;
}

function renderTopPart(todo, container) {
    const checkboxElem = container.querySelector('.todo-checkbox-icon');
    const textInput = container.querySelector('.todo-text-content');
    const importantElem = container.querySelector('.todo-important-icon');

    checkboxElem.src = todo.isCompleted
        ? 'assets/icons/checklist.png'
        : 'assets/icons/checklist-with-out-check-mark.png';

    textInput.value = todo.text;
    textInput.style.textDecoration = todo.isCompleted ? 'line-through' : 'none';
    textInput.style.height = 'auto';
    textInput.style.height = textInput.scrollHeight + 'px';

    importantElem.src = todo.isImportant
        ? 'assets/icons/star-filled.png'
        : 'assets/icons/star.png';
}

