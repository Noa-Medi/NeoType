import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder, todoFinder
} from './categories.js';
import { setupBottomPart } from './bottomBar.js'
import { hashDecoder } from './component/hashDecoder.js';


export function todoPageRender(categoryName) {

    const runApp = () => {
        // console.log(categoryName);
        let hashLocation = hashDecoder(window.location.hash);
        if (categoryName !== hashLocation) {
            window.location.hash = categoryName;
        }
        titleText(categoryName);
        titleDate();
        todosRender(categoryName);
        todosClickHandler(categoryName);
        setupBottomPart(categoryName);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runApp)
    } else {
        runApp();
    }

}

function todosClickHandler(categoryName) {
    const todosListContainer = document.querySelector('.to-do-list-container');

    todosListContainer.addEventListener('click', (event) => {
        const checkbox = event.target.closest('.check-box-icon-container');
        if (!checkbox) return;

        const todoContainer = checkbox.closest('.to-do-container');
        const todoId = todoContainer.dataset.todoId;
        const todo = todoFinder(categoryName, todoId);
        if (!todo) return;
        todo.isCompleted = !todo.isCompleted;
        todosRender(categoryName);
    });

    // const iconContainerElems = document.querySelectorAll('.check-box-icon-container');
    // iconContainerElems.forEach((element) => {
    //     element.addEventListener('click', (event) => {
    //         let todoId = element.closest('.to-do-container').dataset.todoId;
    //         let todo = todoFinder(categoryName, todoId);
    //         console.log(todo.isCompleted);
    //         todo.isCompleted = !todo.isCompleted
    //         todoPageRender(categoryName);

    //     });
    // });
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
    const date = dayjs().format('dddd, D.MMMM');
    titleDateElem.innerText = date;
}

export function todosRender(categoryName) {
    const uncompletedTodosElem = document.querySelector('.uncompleted-todos');
    const completedTodosElem = document.querySelector('.completed-todos');
    // const completedTodosContainer = document.querySelector('.completed-container')
    const uncompletedHTML = [];
    const completedHTML = [];
    let isContainerShow = false;

    const category = todoCategoryFinder(categoryName);
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

            let completedContainer = ` <div class="completed-container">
                            <div class="arrow-icon-container">
                                <img src="assets/icons/arrow-down-sign-to-navigate.png" alt=""
                                    class="completed-arrow-icon">
                            </div>
                            <div class="completed-text">Completed</div>
                        </div>`
            if (!isContainerShow) {
                isContainerShow = true;
                completedHTML.push(completedContainer);
            }
            completedHTML.push(todoHTML);
        } else {

            uncompletedHTML.push(todoHTML);
        }
    });
    uncompletedTodosElem.innerHTML = uncompletedHTML.join('');
    completedTodosElem.innerHTML = completedHTML.join('');

}


