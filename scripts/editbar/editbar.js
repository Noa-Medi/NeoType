import { topPartSetup } from "./editbar-topPart.js"
import { datePartSetup } from "./editbar-datePart.js"
import { notePartSetup } from "./editbar-notePart.js"

export function editbarSetup(todo) {
    editbarTrigger(todo)
    bodySizeChanger()
    setupEditbarParts(todo)
}


function setupEditbarParts(todo) {
    topPartSetup(todo)
    datePartSetup(todo)
    notePartSetup(todo)
}



function bodySizeChanger() {
    const editbarElem = document.querySelector('.editbar-container');
    const body = document.querySelector('.main-content-container');
    if (editbarElem.classList.contains('show-editbar')) {
        body.style.right = '15em';
        // }
    } else {
        body.style.right = '0';
    }
}

function editbarTrigger(todo, isShow) {
    const editbarContainer = document.querySelector('.editbar-container');

    if (!editbarContainer.classList.contains('show-editbar')) {
        editbarContainer.classList.add('show-editbar');
        editbarContainer.dataset.todoId = todo.todo_id;
    } else if (editbarContainer.dataset.todoId === todo.todo_id) {
        editbarContainer.classList.remove('show-editbar');
        editbarContainer.dataset.todoId = '';
    } else {
        editbarContainer.dataset.todoId = todo.todo_id
    }

}