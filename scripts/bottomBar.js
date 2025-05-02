import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, categoryFinder
} from './categories.js';
import { getCategoryName } from './component/getCategoryName.js';
import { Todo } from './models.js';
import { todosRender } from './todoPage.js';
import { hashDecoder } from './component/hashDecoder.js';


export function setupBottomPart() {
    const addButton = document.querySelector('.to-do-add-button-container');
    const input = document.getElementById('real-input');
    const datePicker = document.querySelector('.calendar-picker-js '); // example selector
    const reminderBtn = document.querySelector('.reminder-picker-js'); // example selector
    const categoryPicker = document.querySelector('.category-inputer');



    let selectedDate = null;
    let selectedReminder = null;
    let selectedCategory = null;



    setupDatePicker(datePicker, (date) => selectedDate = date);
    setupReminder(reminderBtn, (reminder) => selectedReminder = reminder);
    setupCategoryPicker(categoryPicker, (category) => selectedCategory = category)

    setupAddTaskHandler(addButton, input, () => selectedDate, () => selectedReminder, () => selectedCategory);

}

function setupAddTaskHandler(button, input, getDate, getReminder, getCategory) {
    button.addEventListener('click', () => {
        // const categoryName = getCategoryName();
        // console.log(categoryName)
        const text = input.value.trim();
        if (!text) {
            input.focus();
            return;
        }

        const date = getDate();
        const reminder = getReminder();
        const categoryName = getCategory();
        addTask(text, categoryName, date, reminder);
        console.log(text, categoryName, date, reminder)

        input.value = '';
        todosRender(categoryName);

    });
}

function setupDatePicker(elem, callback) {
    let pickedDate;
    const calendarPicker = flatpickr("#calendar-picker", {
        // mode: "range",
        dateFormat: "d.m.Y",
        // enableTime: true,
        clickOpens: false,
        position: 'above',


        onValueUpdate: (dates) => {
            let dayObject = dayjs(dates[0]);

            console.log(dayObject.toISOString())


            let formattedDay = dayObject.format('dddd, D.MMMM');
            document.querySelector('.calendar-picked-date-text').textContent = formattedDay;

            pickedDate = dayObject.toISOString();


        }

    });
    if (pickedDate) {
        return callback(pickedDate)
    } else {
        return callback(dayjs().toISOString())
    }

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

            return callback(dayObject.toISOString());
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
function categoriesgenerator() {
    const categoriesElem = document.querySelector('.overley-categories-list');
    let categoriesHTML = '';
    let categoiesTooShow = [];

    categoiesTooShow.push(categoryFinder({ categoryName: 'Tasks' }));
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
function setupCategoryPicker(elem, callback) {
    categoriesgenerator();
    categoryPopupSetup(elem);

    // 👉 Call the callback immediately with default
    callback('Tasks');

    const overleyElem = document.querySelector('.choose-category-overlay-container');
    const categoryNameElem = document.querySelector('.category-name-js');

    overleyElem.addEventListener('click', (event) => {
        const choosedCategory = event.target.closest('.overley-category-and-icon-container');
        if (!choosedCategory) return;

        let categoryId = choosedCategory.dataset.categoryId;
        const category = categoryFinder({ categoryId: categoryId });

        categoryNameElem.textContent = category.name;
        callback(category.name); // 👉 Update selectedCategory
    });
}

function addTask(text, categoryName, date, reminder) {
    const category = categoryFinder({ categoryName: categoryName });
    console.log(text);
    console.log(categoryName);
    console.log(date);
    console.log(reminder);
    console.log(category);
    category.addTodo(new Todo(text, undefined, false, date, reminder));
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

