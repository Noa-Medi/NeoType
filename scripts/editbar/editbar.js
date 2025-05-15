import { topPartSetup } from "./editbar-topPart.js";
import { datePartSetup } from "./editbar-datePart.js";
import { notePartSetup } from "./editbar-notePart.js";
import { cleanupEditbar } from "./editbar-datePart.js";
import { bottomPartSetup } from "./editbar-bottomPart.js";
import { saveInLocalStorage } from "../categories.js";
import { todosRender } from "../todoPage.js";
import { categoryFinder } from "../categories.js";

let currentCloseHandler = null;
let currentOriginalTodo = null; // Track the original reference
export function editbarSetup(originalTodo) {
    currentOriginalTodo = originalTodo;
    const todo = { ...originalTodo };
    cleanupEditbar();

    const editbarContainer = document.querySelector('.editbar-container');
    editbarContainer.currentTodo = todo;
    // Create the save handler
    const saveHandler = {
        saveChanges: () => {
            // Update the original todo in the category
            const category = categoryFinder({ categoryName: todo.catName });
            const originalInCategory = category.findTodoById(todo.todo_id);

            if (originalInCategory) {
                Object.assign(originalInCategory, todo);
                saveInLocalStorage();
                todosRender();
            } else {
                console.error('Original todo not found in category!');
            }
        }
    };

    editbarTrigger(todo, true);
    bodySizeChanger();
    setupEditbarParts(todo, saveHandler);

    // Return a way to sync changes back
    return saveHandler;
}

function setupEditbarParts(todo, saveHandler) {
    // Reset all initialization flags
    document.querySelector('.top-part-todo-container')?.removeAttribute('data-initialized');
    document.querySelector('.date-information-container')?.removeAttribute('data-initialized');
    document.querySelector('.note-part-container')?.removeAttribute('data-initialized');

    closeButtonSetup(todo);
    topPartSetup(todo, saveHandler); // Pass saveHandler here
    datePartSetup(todo, saveHandler);
    notePartSetup(todo, saveHandler);
    bottomPartSetup(todo, saveHandler);
}

function closeButtonSetup(todo) {
    const closeButtonElem = document.querySelector('.close-editbar-button');

    // Remove ALL click listeners (nuclear option)
    const newCloseButton = closeButtonElem.cloneNode(true);
    closeButtonElem.replaceWith(newCloseButton);

    currentCloseHandler = () => {
        editbarTrigger(todo, false);
        bodySizeChanger();
        cleanupEditbar();
    };

    newCloseButton.addEventListener('click', currentCloseHandler);
}

export function bodySizeChanger() {
    const editbarElem = document.querySelector('.editbar-container');
    const body = document.querySelector('.main-content-container');
    body.style.right = editbarElem.classList.contains('show-editbar') ? '15em' : '0';
}

export function editbarTrigger(todo, isShow) {
    const editbarContainer = document.querySelector('.editbar-container');
    editbarContainer.currentTodo = todo;

    if (isShow) {
        editbarContainer.classList.add('show-editbar');
        editbarContainer.dataset.todoId = todo.todo_id;
    } else {
        editbarContainer.classList.remove('show-editbar');
        editbarContainer.dataset.todoId = '';
    }
}

