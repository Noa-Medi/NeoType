import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder
} from './categories.js';
import { buttomPart } from './bottomBar.js'


export function todoPageRender(categoryName) {
    titleText(categoryName);
    titleDate();
    todosRender(categoryName);

    buttomPart(categoryName);

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
    const todosContElem = document.querySelector('.to-do-list-container');
    let allTodosHTML = '';
    const category = todoCategoryFinder(categoryName);
    let isCompletedNeeded = true;
    category.todos.sort((a, b) => a.isCompleted - b.isCompleted);
    category.todos.forEach((todo) => {
        if (todo.isCompleted === false) {
            allTodosHTML += `
            <div class="to-do-container">
                            <div class="to-do-flex-left">
                                <div class="check-box-icon-container">
                                    <img src="assets/icons/checklist-with-out-check-mark.png" alt=""  
                                        class="check-box-icon">
                                </div>
                                <div class="vertical-divider-container">
                                    <div class="vertical-divider"></div>
                                </div>
                                <div class="to-do-text-container">
                                    <div class="to-do-text">
                                        ${todo.text}
                                    </div>
                                </div>
                            </div>

                            <div class="to-do-flex-right">
                                <div class="star-icon-container">
                                    <img src="assets/icons/star.png" alt="" class="star-icon">
                                </div>
                            </div>
                        </div>`
        } if (todo.isCompleted === true) {
            if (isCompletedNeeded) {
                isCompletedNeeded = false;
                allTodosHTML += ` <div class="completed-container">
                            <div class="arrow-icon-container">
                                <img src="assets/icons/arrow-down-sign-to-navigate.png" alt=""
                                    class="completed-arrow-icon">
                            </div>
                            <div class="completed-text">Completed</div>
                        </div>`
            }
            allTodosHTML += `
            <div class="to-do-container completed-to-do">
                            <div class="to-do-flex-left">
                                <div class="check-box-icon-container">
                                    <img src="assets/icons/checklist.png" alt="" class="check-box-icon">
                                </div>
                                <div class="vertical-divider-container">
                                    <div class="vertical-divider"></div>
                                </div>
                                <div class="to-do-text-container">
                                    <div class="to-do-text">
                                    ${todo.text}
                                    </div>
                                </div>
                            </div>

                            <div class="to-do-flex-right">
                                <div class="star-icon-container">
                                    <img src="assets/icons/star.png" alt="" class="star-icon">
                                </div>
                            </div>
                        </div>`
        }
    });

    todosContElem.innerHTML = allTodosHTML;
}


