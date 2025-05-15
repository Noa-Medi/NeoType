import { topPartSetup } from "./editbar-topPart.js"
import { datePartSetup } from "./editbar-datePart.js"
import { notePartSetup } from "./editbar-notePart.js"
import { cleanupEditbar } from "./editbar-datePart.js";
import { bottomPartSetup } from "./editbar-bottomPart.js";

// Add this at the top of your file
let currentCloseHandler = null;

export function editbarSetup(todo) {
    const editbarContainer = document.querySelector('.editbar-container');

    // Clear all previous state and event listeners
    if (editbarContainer.currentTodo) {
        cleanupEditbar();
    }

    editbarContainer.currentTodo = todo;
    editbarTrigger(todo);
    bodySizeChanger();
    setupEditbarParts(todo);
}

cleanupEditbar()


function setupEditbarParts(todo) {
    // Use the current todo from editbar container
    const editbarContainer = document.querySelector('.editbar-container');
    const currentTodo = editbarContainer.currentTodo || todo;

    closeButtonSetup(currentTodo);
    topPartSetup(currentTodo);
    datePartSetup(currentTodo);
    notePartSetup(currentTodo);
    bottomPartSetup(currentTodo);
}

function closeButtonSetup(todo) {
    const closeButtonElem = document.querySelector('.close-editbar-button');

    // Remove previous listener if exists
    if (currentCloseHandler) {
        closeButtonElem.removeEventListener('click', currentCloseHandler);
    }

    // Create new handler
    currentCloseHandler = () => {
        editbarTrigger(todo, false);
        bodySizeChanger();
    };

    // Add new listener
    closeButtonElem.addEventListener('click', currentCloseHandler);
}
export function bodySizeChanger() {
    const editbarElem = document.querySelector('.editbar-container');
    const body = document.querySelector('.main-content-container');
    if (editbarElem.classList.contains('show-editbar')) {
        body.style.right = '15em';
        // }
    } else {
        body.style.right = '0';
    }
    console.log('cleaned bodysize');
}

export function editbarTrigger(todo, isShow) {
    const editbarContainer = document.querySelector('.editbar-container');

    // Store the current todo in the editbar container
    editbarContainer.currentTodo = todo; // This maintains a direct reference

    if (isShow === undefined) {
        if (!editbarContainer.classList.contains('show-editbar')) {
            editbarContainer.classList.add('show-editbar');
            editbarContainer.dataset.todoId = todo.todo_id;
        } else if (editbarContainer.dataset.todoId === todo.todo_id) {
            editbarContainer.classList.remove('show-editbar');
            editbarContainer.dataset.todoId = '';
        } else {
            editbarContainer.dataset.todoId = todo.todo_id;
        }
    } else {
        if (isShow) {
            editbarContainer.classList.add('show-editbar');
            editbarContainer.dataset.todoId = todo.todo_id;
        } else {
            editbarContainer.classList.remove('show-editbar');
            editbarContainer.dataset.todoId = '';
        }
    }
    console.log('cleaned editbar');
}