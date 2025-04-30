import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder
} from './categories.js';
import { Todo } from './models.js';
import { todosRender } from './todoPage.js';


export function setupBottomPart(categoryName) {
    const addButton = document.querySelector('.to-do-add-button-container');
    const input = document.getElementById('real-input');
    const datePicker = document.querySelector('.calendar-picker-js '); // example selector
    const reminderBtn = document.querySelector('.reminder-picker-js'); // example selector
    const categoryPicker = document.querySelector('.category-inputer');


    let selectedDate = null;
    let selectedReminder = null;
    let selectedCategory = null;

    document.addEventListener('DOMContentLoaded', () => {

        setupDatePicker(datePicker, (date) => selectedDate = date);
        setupReminder(reminderBtn, (reminder) => selectedReminder = reminder);
        setupCategoryPicker(categoryPicker, (category) => selectedCategory = category)

        setupAddTaskHandler(categoryName, addButton, input, () => selectedDate, () => selectedReminder);
    });
}

function setupAddTaskHandler(categoryName, button, input, getDate, getReminder) {
    button.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) {
            input.focus();
            return;
        }

        const date = getDate();
        const reminder = getReminder();
        addTask(text, categoryName, date, reminder);

        input.value = '';
        todosRender(categoryName);
    });
}

function addTask(text, categoryName, date, reminder) {
    const category = todoCategoryFinder(categoryName);
    category.addTodo(new Todo(text, undefined, false, date, reminder));
}

function setupDatePicker(elem, callback) {
    const calendarPicker = flatpickr("#calendar-picker", {
        // mode: "range",
        dateFormat: "d.m.Y",
        // enableTime: true,
        clickOpens: false,
        position: 'above',


        onValueUpdate: (dates) => {
            let dayObject = dayjs(dates[0]);
            let formattedDay = dayObject.format('dddd, D.MMMM');
            document.querySelector('.calendar-picked-date-text').textContent = formattedDay;

        }
    });

    elem.addEventListener('click', () => {
        const position = getPosition(document.querySelector('.reminder-position-linker'));
        calendarPicker.open();

        const fpContainer = calendarPicker.calendarContainer;
        fpContainer.style.top = `${position.top - 285}px`;
        fpContainer.style.left = `${position.left - 260}px`;

    });
    // elem.addEventListener('change', (e) => {
    //     callback(e.target.value); // or formatted date
    // });
}
function setupReminder(elem, callback) {
    const reminderPickedDateElem = document.querySelector('.reminder-picked-date-text');

    const reminderPicker = flatpickr("#reminder-picker", {

        dateFormat: "d.m.Y",
        enableTime: true,
        clickOpens: false,
        position: 'above',
        onValueUpdate: (dates) => {
            let dayObject = dayjs(dates[0]);
            let formattedDay = dayObject.format('dddd, D.MMMM HH:mm');
            reminderPickedDateElem.textContent = formattedDay;
            if (reminderPickedDateElem.textContent.length > 0) {
                reminderPickedDateElem.style.marginRight = '8px'; // ❗ Correct way
            }
        }
    });

    elem.addEventListener('click', () => {
        const position = getPosition(document.querySelector('.reminder-position-linker'));
        reminderPicker.open();

        const fpContainer = reminderPicker.calendarContainer;
        fpContainer.style.top = `${position.top - 320}px`;
        fpContainer.style.left = `${position.left - 260}px`;
    });
}
function setupCategoryPicker(elem, callback) {

    categoriesgenerator()
    categoryPopupSetup(elem)
    onCategoryClickHandler()


}

function onCategoryClickHandler() {
    const categoryElems = document.querySelectorAll('.overley-category-and-icon-container');
    const categoryNameElem = document.querySelector('.category-name-js');
    categoryElems.forEach((category) => {
        category.addEventListener('click', (event) => {
            let categorynName = event.target.dataset.categoryId;
            // console.log(categorynName);
            // categoryNameElem.textContent = event.dataset
        });
    });

}
function categoriesgenerator() {
    const categoriesElem = document.querySelector('.overley-categories-list');
    let categoriesHTML = '';
    let categoiesTooShow = [];

    categoiesTooShow.push(todoCategoryFinder('Tasks'));
    neo_todo_user_made_categories.forEach((category) => {
        categoiesTooShow.push(category);
    })
    categoiesTooShow.forEach((category) => {
        categoriesHTML += `
        <div class="overley-category-and-icon-container " data-category-id="${category.id}">
                                                <div class="overley-category-icon-container icon-container">
                                                    <img src="${category.icon}" alt=""
                                                        class="overley-category-icon ">
                                                </div>
                                                <div class="overley-category-name">${category.name}</div>
                                            </div>`
    });
    categoriesElem.innerHTML = categoriesHTML;


}
function categoryPopupSetup(elem) {
    const categoryOverlayElem = document.querySelector('.choose-category-overlay-container');




    elem.addEventListener('click', (e) => {
        e.stopPropagation();
        categoryOverlayElem.style.opacity = '1';
        categoryOverlayElem.style.pointerEvents = 'auto';

    });
    document.addEventListener('click', (e) => {
        if (!elem.contains(e.target)) {
            categoryOverlayElem.style.opacity = '0';
            categoryOverlayElem.style.pointerEvents = 'none';
        }

    });
}
function getPosition(element) {
    const rect = element.getBoundingClientRect();
    const pos = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    }
    // console.log(pos)
    return pos
}