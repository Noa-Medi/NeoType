import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, categoryFinder, todoFinder,
    loadFromLocalStorage
} from './categories.js';
import { sidebarCategoriesRender } from "./sidebar.js";
import { setupBottomPart } from './bottomBar.js';
import { hashDecoder } from './component/hashDecoder.js';
import { getCategoryName } from './component/getCategoryName.js';
import { getMyDayTodos } from './logic/mydayLogic.js';
import { getImportantTodos } from './logic/importantLogic.js';
import { toFormattedDate } from './component/dateHelper.js';
import { editbarSetup } from "./editbar/editbar.js";
import { topPartSetup } from "./editbar/editbar-topPart.js";
import { datePartSetup } from "./editbar/editbar-datePart.js";
import { notePartSetup } from "./editbar/editbar-notePart.js";
import { bottomPartSetup } from "./editbar/editbar-bottomPart.js";

export function todoPageRender(categoryName = getCategoryName()) {


    const runApp = () => {
        loadFromLocalStorage()
        let hashLocation = getCategoryName()
        if (categoryName !== hashLocation) {
            window.location.hash = categoryName;
        }
        if (categoryName === 'My Day') {
            getMyDayTodos()
        }
        if (categoryName === 'Important') {
            getImportantTodos()
        }
        titleText();
        titleDate();
        todosRender();
        todosClickHandler();
        setupBottomPart(categoryName);
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
        importantButtonClickHandler(event);
        todoClickHandler(event);
    });
}

function todoClickHandler(event) {
    const categoryName = getCategoryName();
    const todoTextContainer = event.target.closest('.to-do-text-container');
    if (!todoTextContainer) return;

    const todoContainer = todoTextContainer.closest('.to-do-container');
    const todoId = todoContainer.dataset.todoId;
    const todo = todoFinder(categoryName, todoId);
    if (!todo) return;

    // Clear any previous editbar state
    const editbarContainer = document.querySelector('.editbar-container');
    if (editbarContainer.currentTodo && editbarContainer.currentTodo.todo_id !== todoId) {
        editbarContainer.classList.remove('show-editbar');
    }

    const editbar = editbarSetup(todo);
    // Then modify ALL part setups to receive the save handler:
    // topPartSetup(todo, editbar);
    // datePartSetup(todo, editbar);
    // notePartSetup(todo, editbar);
    // bottomPartSetup(todo, editbar);
}


function importantButtonClickHandler(event) {
    const categoryName = getCategoryName();
    const starButtonElem = event.target.closest('.star-icon-container');
    if (!starButtonElem) return;

    const todoContainer = starButtonElem.closest('.to-do-container');
    const todoId = todoContainer.dataset.todoId;
    const todo = todoFinder(categoryName, todoId);
    if (!todo) return;

    todo.isImportant = !todo.isImportant;
    getImportantTodos()
    todosRender(categoryName);
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
function completeContainerClickHandler(event) {
    const categoryName = getCategoryName();
    const completedContainer = event.target.closest('.completed-container');
    if (!completedContainer) return;

    const category = categoryFinder({ categoryName: categoryName });
    category.isCompletedCollapsed = !category.isCompletedCollapsed;
    todosRender()


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
    if (categoryName === 'My Day') {
        getMyDayTodos()
    } else if (categoryName === 'Important') {
        getImportantTodos()
    }
    const category = categoryFinder({ categoryName });
    let isCollapse = category.isCompletedCollapsed;
    function categoryChecker(catName) {
        if (catName === 'My Day' || catName === 'Important') {


            return true
        } else {
            return false
        }
    }

    function isDividerNeeded({ item1, item2 }) {
        if (item1 && item2) {
            return `<div class="to-do-divider">&#x2022</div>`
        } else {
            return ``
        }
    }

    function dateChecker(date) {
        if (date && category.name !== 'My Day') {
            return true
        } else {
            return false
        }
    }
    // let isCompletedNeeded = true;
    category.todos.sort((a, b) => a.isCompleted - b.isCompleted);
    console.log(`todos when rendering:`, category.todos);
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
                    <div class="to-do-description">
                    ${categoryChecker(category.name) ? ` <div class="to-do-category">${todo.catName}</div>` : ``}

                    ${isDividerNeeded({ item1: categoryChecker(category.name), item2: dateChecker(todo.date) || todo.reminder })}

                    ${dateChecker(todo.date) ? `<div class="to-do-date">${toFormattedDate(todo.date)}</div>` : ``}

                    ${isDividerNeeded({ item1: todo.date, item2: todo.reminder })}

                    ${todo.reminder ? `<div class="to-do-reminder">${toFormattedDate(todo.reminder)}</div>` : ``}
                    </div>
                </div>
            </div>
            <div class="to-do-flex-right">
                <div class="star-icon-container">
                    <img src="${todo.isImportant ? 'assets/icons/star-filled.png' : 'assets/icons/star.png'}" class="star-icon">
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


