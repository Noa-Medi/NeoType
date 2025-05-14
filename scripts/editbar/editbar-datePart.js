import { toFormattedDate } from "../component/dateHelper.js";
import { todosRender } from "../todoPage.js";

export function datePartSetup(todo) {
    // Initial render
    renderDateParts(todo);

    // Set up event listeners only once
    const datePartContainerElem = document.querySelector('.date-information-container');
    if (!datePartContainerElem.dataset.initialized) {
        datePartContainerElem.addEventListener('click', (event) => {
            const calendarAndTextElem = event.target.closest('.calendar-and-text-container');
            const calendarRemoveElem = event.target.closest('.calendar-remove-icon');
            const reminderAndTextElem = event.target.closest('.reminder-and-text-container');
            const reminderRemoveElem = event.target.closest('.reminder-remove-icon');


            if (calendarAndTextElem) {
                console.log('calendarAndTextElem clicked:', calendarAndTextElem);
                setupDatePicker(calendarAndTextElem, (date) => todo.date = date);

            }

            if (calendarRemoveElem) {
                console.log('calendarRemoveElem clicked:', calendarRemoveElem);
                todo.date = null;
                renderDateParts(todo);
                todosRender();
                return;
            }

            if (reminderAndTextElem) {
                console.log('reminderAndTextElem clicked:', reminderAndTextElem);
                setupReminder(reminderAndTextElem, (reminder) => todo.reminder = reminder);
                todosRender();
            }

            if (reminderRemoveElem) {
                console.log('reminderRemoveElem clicked:', reminderRemoveElem);
                todo.reminder = null;
                renderDateParts(todo);
                todosRender();
                return;
            }
        });
        datePartContainerElem.dataset.initialized = true;
    }
}

function renderDateParts(todo) {
    renderCalendarPart(todo);
    renderReminderPart(todo);
}

function renderCalendarPart(todo) {
    const calendarPartElem = document.querySelector('.calendar-part-container');
    const textElem = calendarPartElem.querySelector('.date-text-part');
    const removeIconElem = calendarPartElem.querySelector('.remove-data-icon-container');

    if (!todo.date) {
        calendarPartElem.classList.add('off');
        textElem.textContent = 'Add due date';
        removeIconElem.classList.add('icon-hidden');
    } else {
        calendarPartElem.classList.remove('off');
        textElem.textContent = toFormattedDate(todo.date);
        removeIconElem.classList.remove('icon-hidden');
    }
}

function renderReminderPart(todo) {
    const reminderPartElem = document.querySelector('.reminder-part-container');
    const textElem = reminderPartElem.querySelector('.date-text-part');
    const removeIconElem = reminderPartElem.querySelector('.remove-data-icon-container');

    if (!todo.reminder) {
        reminderPartElem.classList.add('off');
        textElem.textContent = 'Remind me';
        removeIconElem.classList.add('icon-hidden');
    } else {
        reminderPartElem.classList.remove('off');
        textElem.textContent = toFormattedDate(todo.reminder);
        removeIconElem.classList.remove('icon-hidden');
    }
}


let calendarPickerInstance = null;
function setupDatePicker(elem, callback) {


    // Destroy previous instance if exists
    if (calendarPickerInstance) {
        calendarPickerInstance.destroy();
    }
    const datePickedDateElem = elem.querySelector('.date-text-part');

    let currentDate = null; // Start with no date selected
    const today = dayjs().toISOString();
    calendarPickerInstance = flatpickr("#editbar-calendar-picker", {
        dateFormat: "d.m.Y",
        clickOpens: true,
        position: 'above',
        defaultDate: today,
        onValueUpdate: (dates) => {
            const dayObject = dayjs(dates[0]);
            currentDate = dayObject.toISOString();
            datePickedDateElem.textContent =
                dayObject.format('dddd, D.MMMM');
            callback(currentDate);
            todosRender();
            console.log(elem.closest('.calendar-part-container').classList);

            if (elem.closest('.calendar-part-container').classList.contains('off')) {
                elem.closest('.calendar-part-container').classList.remove('off');
                elem.closest('.calendar-part-container').querySelector('.remove-data-icon-container').classList.remove('icon-hidden');
            }

        }
    });
    calendarPickerInstance.open();



    // Wait for Flatpickr to finish its initial positioning
    setTimeout(() => {
        const calendarContainer = calendarPickerInstance.calendarContainer;
        console.log(calendarPickerInstance.calendarContainer)
        const position = getPosition(elem);

        // Important CSS overrides
        calendarContainer.style.position = 'fixed';
        calendarContainer.style.top = '';
        calendarContainer.style.left = '';
        calendarContainer.style.right = '';
        calendarContainer.style.bottom = '';

        // Set your custom position
        calendarContainer.style.top = `${position.top - 0}px`;
        calendarContainer.style.left = `${position.left - 300}px`;
        calendarContainer.style.transform = 'none'; // Remove any transform Flatpickr applied
    }, 10);
}

let reminderPickerInstance = null;
function setupReminder(elem, callback) {

    // Destroy previous instance if exists
    if (reminderPickerInstance) {
        reminderPickerInstance.destroy();
    }
    let currentDate = null;
    const reminderPickedDateElem = elem.querySelector('.date-text-part');


    reminderPickerInstance = flatpickr("#editbar-reminder-picker", {

        dateFormat: "d.m.Y",
        enableTime: true,
        clickOpens: true,
        position: 'above',
        onValueUpdate: (dates) => {
            const dayObject = dayjs(dates[0]);
            currentDate = dayObject.toISOString();
            reminderPickedDateElem.textContent =
                dayObject.format('dddd, D.MMMM');
            if (reminderPickedDateElem.textContent.length > 0) {
                reminderPickedDateElem.style.marginRight = '8px';
            }
            callback(currentDate);
            todosRender();

            if (elem.closest('.reminder-part-container').classList.contains('off')) {
                elem.closest('.reminder-part-container').classList.remove('off');
                elem.closest('.reminder-part-container').querySelector('.remove-data-icon-container').classList.remove('icon-hidden');
            }
        }
    });
    reminderPickerInstance.open();

    // Wait for Flatpickr to finish its initial positioning
    setTimeout(() => {
        const reminderContainer = reminderPickerInstance.calendarContainer;
        console.log(reminderPickerInstance.calendarContainer)
        const position = getPosition(elem);

        // Important CSS overrides
        reminderContainer.style.position = 'fixed';
        reminderContainer.style.top = '';
        reminderContainer.style.left = '';
        reminderContainer.style.right = '';
        reminderContainer.style.bottom = '';

        // Set your custom position
        reminderContainer.style.top = `${position.top - 0}px`;
        reminderContainer.style.left = `${position.left - 300}px`;
        reminderContainer.style.transform = 'none'; // Remove any transform Flatpickr applied
    }, 10);
}

function getPosition(element) {
    const rect = element.getBoundingClientRect();
    const pos = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    }
    console.log(pos)
    return pos
}