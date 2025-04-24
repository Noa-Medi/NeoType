import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder
} from './categories.js';
import { Todo } from './models.js'
import { todosRender } from './todoPage.js'
export function buttomPart(categoryName) {
    let choosedDate;
    let choosedReminder;
    const addButtonElem = document.querySelector('.to-do-add-button-container');
    const addTaskInputElem = document.getElementById('real-input');

    addButtonElem.addEventListener('click', () => {
        if (addTaskInputElem.value === '') {
            addTaskInputElem.focus()
        }
        else {
            let text = addTaskInputElem.value;
            const category = todoCategoryFinder(categoryName)
            category.addTodo(new Todo(text, undefined, false, choosedDate, choosedReminder));
            addTaskInputElem.value = null;
            todosRender(categoryName);
        };
    });



}