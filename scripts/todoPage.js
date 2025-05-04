import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, categoryFinder, todoFinder
} from './categories.js';
import { sidebarCategoriesRender } from "./sidebar.js";
import { setupBottomPart } from './bottomBar.js';
import { hashDecoder } from './component/hashDecoder.js';
import { getCategoryName } from './component/getCategoryName.js';


export function todoPageRender(categoryName = getCategoryName()) {


    const runApp = () => {
        // console.log(categoryName);
        let hashLocation = getCategoryName()
        if (categoryName !== hashLocation) {
            window.location.hash = categoryName;
        }
        titleText();
        titleDate();
        todosRender();
        todosClickHandler();
        setupBottomPart();
        sidebarCategoriesRender()
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runApp)
    } else {
        runApp();
    }

}

function todosClickHandler() {
    const todosListContainer = document.querySelector('.to-do-list-container');

    // Remove all previous listeners
    const newContainer = todosListContainer.cloneNode(true);
    todosListContainer.parentNode.replaceChild(newContainer, todosListContainer);

    newContainer.addEventListener('click', (event) => {
        todoCheckboxClickHandler(event);
        completeContainerClickHandler(event);

    });
}
function completeContainerClickHandler(event) {
    const categoryName = getCategoryName();
    const completedContainer = event.target.closest('.completed-container');
    if (!completedContainer) return;

    const category = categoryFinder({ categoryName: categoryName });
    category.isCompletedCollapsed = !category.isCompletedCollapsed;
    console.log(category.isCompletedCollapsed)
    todosRender()


}
function todoCheckboxClickHandler(event) {
    const categoryName = getCategoryName();
    const checkbox = event.target.closest('.check-box-icon-container');
    if (!checkbox) return;

    const todoContainer = checkbox.closest('.to-do-container');
    const todoId = todoContainer.dataset.todoId;
    const todo = todoFinder(categoryName, todoId);
    if (!todo) return;

    todo.isCompleted = !todo.isCompleted;
    todosRender(categoryName);
}


function titleText() {
    const categoryName = getCategoryName();
    const titleTextElem = document.querySelector('.title-text');
    let category;
    category = categoryFinder({ categoryName });
    if (category) {
        titleTextElem.innerText = category.name;
    }
}

function titleDate() {
    const titleDateElem = document.querySelector('.title-date');
    const date = dayjs().format('dddd, D.MMMM');
    titleDateElem.innerText = date;
}

export function todosRender() {
    const categoryName = getCategoryName();
    const uncompletedTodosElem = document.querySelector('.uncompleted-todos');
    const completedTodosElem = document.querySelector('.completed-todos');
    // const completedTodosContainer = document.querySelector('.completed-container')
    const uncompletedHTML = [];
    const completedHTML = [];
    let isContainerShow = false;

    const category = categoryFinder({ categoryName });
    // let isCompletedNeeded = true;
    category.todos.sort((a, b) => a.isCompleted - b.isCompleted);
    category.todos.forEach((todo) => {
        const todoHTML = `
        <div class="to-do-container ${todo.isCompleted ? 'completed-to-do' : ''}" data-todo-id="${todo.todo_id}">
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
            let completedContainer = ` <div class="completed-container ${isCollapse ? 'collapse' : 'expand'}">
                            <div class="arrow-icon-container">
                                <img src="assets/icons/arrow-down-sign-to-navigate.png" alt=""
                                    class="completed-arrow-icon">
                            </div>
                            <div class="completed-text">Completed</div>
                        </div>`;

            if (!isContainerShow) {
                isContainerShow = true;
                completedHTML.push(completedContainer);
            }
            if (!isCollapse) {
                completedHTML.push(todoHTML);
            }
        } else {

            uncompletedHTML.push(todoHTML);
        }
    });
    uncompletedTodosElem.innerHTML = uncompletedHTML.join('');
    completedTodosElem.innerHTML = completedHTML.join('');

}


