import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, todoCategoryFinder
} from './categories.js';
import { Todo } from './models.js'
import { todosRender } from './todoPage.js'

export function setupBottomPart(categoryName) {
    const addButton = document.querySelector('.to-do-add-button-container');
    const input = document.getElementById('real-input');
    const datePicker = document.querySelector('.calendar-picker-js '); // example selector
    const reminderBtn = document.querySelector('.reminder-picker-js'); // example selector

    let selectedDate = null;
    let selectedReminder = null;

    setupDatePicker(datePicker, (date) => selectedDate = date);
    setupReminder(reminderBtn, (reminder) => selectedReminder = reminder);

    setupAddTaskHandler(categoryName, addButton, input, () => selectedDate, () => selectedReminder);
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


        onChange: (dates) => {
            console.log("Calendar range:", dates);
        }
    });

    elem.addEventListener('click', () => {
        const position = getPosition(elem);
        calendarPicker.open();

        const fpContainer = calendarPicker.calendarContainer;
        fpContainer.style.top = `${position.top - 300}px`;
        fpContainer.style.left = `${position.left - 190}px`;
    });
    // elem.addEventListener('change', (e) => {
    //     callback(e.target.value); // or formatted date
    // });
}

function setupReminder(elem, callback) {
    const reminderPicker = flatpickr("#reminder-picker", {

        dateFormat: "d.m.Y",
        enableTime: true,
        clickOpens: false,
        position: 'above',
        onChange: (dates) => {
            console.log("Calendar range:", dates);
        }
    });

    elem.addEventListener('click', () => {
        const position = getPosition(elem);
        reminderPicker.open();

        const fpContainer = reminderPicker.calendarContainer;
        fpContainer.style.top = `${position.top - 300}px`;
        fpContainer.style.left = `${position.left - 228}px`;
    });
}


function getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    }
}