import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder
} from './categories.js';
import { setupBottomPart } from './bottomBar.js'


export function todoPageRender(categoryName) {
    titleText(categoryName);
    titleDate();
    todosRender(categoryName);
    setupBottomPart(categoryName);

}



function titleText(categoryName) {
    const titleTextElem = document.querySelector('.title-text');
    let category;
    category = todoCategoryFinder(categoryName);

    if (category) {
        titleTextElem.innerText = category.name;
    }
}

function titleDate() {
    const titleDateElem = document.querySelector('.title-date');
    const date = dayjs().format('dddd, M.MMMM');
    titleDateElem.innerText = date;
}

export function todosRender(categoryName) {
    const uncompletedTodosElem = document.querySelector('.uncompleted-todos');
    const completedTodosElem = document.querySelector('.completed-todos');
    const uncompletedHTML = [];
    const completedHTML = [];

    const category = todoCategoryFinder(categoryName);
    // let isCompletedNeeded = true;
    category.todos.sort((a, b) => a.isCompleted - b.isCompleted);
    category.todos.forEach((todo) => {
        const todoHTML = `
        <div class="to-do-container ${todo.isCompleted ? 'completed-to-do' : ''}">
            <div class="to-do-flex-left">
                <div class="check-box-icon-container">
                    <img src="assets/icons/${todo.isCompleted ? 'checklist' : 'checklist-with-out-check-mark'}.png" class="check-box-icon">
                </div>
                <div class="vertical-divider-container">
                    <div class="vertical-divider"></div>
                </div>
                <div class="to-do-text-container">
                    <div class="to-do-text">${todo.text}</div>
                </div>
            </div>
            <div class="to-do-flex-right">
                <div class="star-icon-container">
                    <img src="assets/icons/star.png" class="star-icon">
                </div>
            </div>
        </div>`;

        if (todo.isCompleted) {
            completedHTML.push(todoHTML);
        } else {
            uncompletedHTML.push(todoHTML);
        }
    });
    uncompletedTodosElem.innerHTML = uncompletedHTML.join('');
    completedTodosElem.innerHTML = completedHTML.join('');

}


