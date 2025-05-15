import {
    neo_todo_pre_made_categories, neo_todo_user_made_categories, categoryFinder, loadFromLocalStorage
    , saveInLocalStorage
} from './categories.js';
import { Todo } from './models.js';
import { todosRender } from './todoPage.js';
import { getMyDayTodos } from './logic/mydayLogic.js';



export function setupBottomPart(categoryName) {
    let CURRENT_CATEGORY = categoryName;
    let SELECTED_CATEGORY = 'Tasks';

    const addButton = document.querySelector('.to-do-add-button-container');
    const input = document.getElementById('real-input');
    const datePicker = document.querySelector('.calendar-picker-js '); // example selector
    const reminderBtn = document.querySelector('.reminder-picker-js'); // example selector
    const categoryPicker = document.querySelector('.category-inputer');


    let selectedDate = null;
    let selectedReminder = null;

    // ===== 1. Setup Category Picker =====
    const updateCategoryPicker = () => {
        if (['My Day', 'Important'].includes(CURRENT_CATEGORY)) {
            // Show picker for special categories
            categoryPicker.innerHTML = `
                    <div class="input-box-icon-container">
                        <img src="assets/icons/home.png" alt=""
                            class="input-category-icon input-box-icon">
                    </div>
                    <div class="category-name category-name-js">Tasks</div>

                    <div class="choose-category-overlay-container">
                        <div class="overley-categories-list"></div>
                    </div>
            `;
            setupCategoryPicker(CURRENT_CATEGORY, (selectedCategory) => {
                // This runs when user selects a category
                SELECTED_CATEGORY = selectedCategory;
                // Update your task addition logic here
            });
        } else {
            // Hide for normal categories
            categoryPicker.innerHTML = '';
            SELECTED_CATEGORY = CURRENT_CATEGORY; // Sync selection
        }
    };


    // ===== 2. Setup Date & Reminder Pickers =====
    setupDatePicker(datePicker, (date) => selectedDate = date);
    setupReminder(reminderBtn, (reminder) => selectedReminder = reminder);

    // ===== 3. Add Task Handler =====
    addButton.onclick = () => {
        const text = input.value.trim();
        if (!text) {
            input.focus();
            return;
        }
        // Use selected date or null if none chosen
        const dateToUse = calendarPickerInstance?.selectedDates[0]
            ? dayjs(calendarPickerInstance.selectedDates[0]).toISOString()
            : dayjs().toISOString();

        const targetCategory = ['My Day', 'Important'].includes(CURRENT_CATEGORY)
            ? SELECTED_CATEGORY
            : CURRENT_CATEGORY;

        const isImportant = CURRENT_CATEGORY === 'Important' ? true : false;
        addTask(text, targetCategory, dateToUse, selectedReminder, isImportant);
        input.value = '';
        getMyDayTodos()
        todosRender(CURRENT_CATEGORY);
    };

    // Initialize
    updateCategoryPicker();
}


function addTask(text, categoryName, date, reminder, isImportant) {
    const category = categoryFinder({ categoryName });
    category.addTodo(new Todo({
        text: text,
        isCompleted: false,
        date: date,
        reminder: reminder,
        catName: category.name,
        isImportant: isImportant
    }));
    console.log(category);
}

let calendarPickerInstance = null;
function setupDatePicker(elem, callback) {

    // Destroy previous instance if exists
    if (calendarPickerInstance) {
        calendarPickerInstance.destroy();
    }

    let currentDate = null; // Start with no date selected
    const today = dayjs().toISOString();
    calendarPickerInstance = flatpickr("#calendar-picker", {
        dateFormat: "d.m.Y",
        clickOpens: false,
        position: 'above',
        defaultDate: today,
        onValueUpdate: (dates) => {
            const dayObject = dayjs(dates[0]);
            currentDate = dayObject.toISOString();
            document.querySelector('.calendar-picked-date-text').textContent =
                dayObject.format('dddd, D.MMMM');
            callback(currentDate); // Only fires on actual selection
        }
    });

    // Click handler
    elem.addEventListener('click', () => {
        const position = getPosition(document.querySelector('.reminder-position-linker'));
        calendarPickerInstance.open();
        calendarPickerInstance.calendarContainer.style.top = `${position.top - 285}px`;
        calendarPickerInstance.calendarContainer.style.left = `${position.left - 260}px`;
    });


}

let reminderPickerInstance = null;
function setupReminder(elem, callback) {

    // Destroy previous instance if exists
    if (reminderPickerInstance) {
        reminderPickerInstance.destroy();
    }
    let currentDate = null;
    const reminderPickedDateElem = document.querySelector('.reminder-picked-date-text');

    reminderPickerInstance = flatpickr("#reminder-picker", {

        dateFormat: "d.m.Y",
        enableTime: true,
        clickOpens: false,
        position: 'above',
        onValueUpdate: (dates) => {
            const dayObject = dayjs(dates[0]);
            currentDate = dayObject.toISOString();
            reminderPickedDateElem.textContent =
                dayObject.format('dddd, D.MMMM');
            if (reminderPickedDateElem.textContent.length > 0) {
                reminderPickedDateElem.style.marginRight = '8px';
            }
            callback(currentDate); // Only fires on actual selection

            // let formattedDay = dayObject.format('dddd, D.MMMM HH:mm');
            // reminderPickedDateElem.textContent = formattedDay;
        }
    });

    elem.addEventListener('click', () => {
        const position = getPosition(document.querySelector('.reminder-position-linker'));
        reminderPickerInstance.open();
        reminderPickerInstance.calendarContainer.style.top = `${position.top - 320}px`;
        reminderPickerInstance.calendarContainer.style.left = `${position.left - 260}px`;

        // reminderPicker.open();
        // const fpContainer = reminderPicker.calendarContainer;
        // fpContainer.style.top = `${position.top - 320}px`;
        // fpContainer.style.left = `${position.left - 260}px`;
    });
}

export function setupCategoryPicker(currentCategory, onCategorySelect) {
    const pickerContainer = document.querySelector('.input-category-container');
    const categoryNameElem = pickerContainer.querySelector('.category-name-js');
    const categoryIconElem = pickerContainer.querySelector('.input-category-icon');
    const overlay = pickerContainer.querySelector('.choose-category-overlay-container');
    const categoriesList = pickerContainer.querySelector('.overley-categories-list');

    // 1. Only show picker for special categories
    if (!['My Day', 'Important'].includes(currentCategory)) {
        pickerContainer.style.display = 'none';
        return;
    }

    // 2. Generate dynamic category list (Tasks + User categories)
    const categoriesToShow = [
        categoryFinder({ categoryName: 'Tasks' }),
        ...neo_todo_user_made_categories
    ];

    categoriesList.innerHTML = categoriesToShow.map(category => `
        <div class="overley-category-and-icon-container" 
             data-category-id="${category.id}">
            <div class="overley-category-icon-container icon-container">
                <img src="${category.icon}" class="overley-category-icon">
            </div>
            <div class="overley-category-name">${category.name}</div>
        </div>
    `).join('');

    // 3. Setup click handlers
    pickerContainer.querySelector('.category-name-js').addEventListener('click', () => {
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
    });

    document.addEventListener('click', (e) => {
        if (!pickerContainer.contains(e.target)) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
        }
    });

    // 4. Handle category selection
    categoriesList.addEventListener('click', (e) => {
        const categoryElem = e.target.closest('[data-category-id]');
        if (!categoryElem) return;

        const category = categoryFinder({
            categoryId: categoryElem.dataset.categoryId
        });

        if (category) {
            categoryNameElem.textContent = category.name;
            categoryIconElem.src = category.icon;
            overlay.style.opacity = '0';
            onCategorySelect(category.name);
        }
    });
}

function onCategoryClickHandler() {
    const categoryElems = document.querySelectorAll('.overley-category-and-icon-container');
    const categoryNameElem = document.querySelector('.category-name-js');
    categoryElems.forEach((category) => {
        category.addEventListener('click', (event) => {
            let categorynName = event.target.dataset.categoryId;
            // categoryNameElem.textContent = event.dataset
        });
    });

}
function categoriesgenerator() {
    const categoriesElem = document.querySelector('.overley-categories-list');
    let categoriesHTML = '';
    let categoiesTooShow = [];

    categoiesTooShow.push(categoryFinder({ categoryName: 'Tasks' }));
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
function getPosition(element) {
    const rect = element.getBoundingClientRect();
    const pos = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    }
    return pos
}