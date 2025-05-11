import { toFormattedDate } from "../component/dateHelper.js";

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
                // Add calendar date picker logic here
                return;
            }

            if (calendarRemoveElem) {
                console.log('calendarRemoveElem clicked:', calendarRemoveElem);
                todo.date = null;
                renderDateParts(todo);
                return;
            }

            if (reminderAndTextElem) {
                console.log('reminderAndTextElem clicked:', reminderAndTextElem);
                // Add reminder date picker logic here
                return;
            }

            if (reminderRemoveElem) {
                console.log('reminderRemoveElem clicked:', reminderRemoveElem);
                todo.reminder = null;
                renderDateParts(todo);
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