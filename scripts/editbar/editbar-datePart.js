import { saveInLocalStorage } from "../categories.js";
import { toFormattedDate } from "../component/dateHelper.js";
import { todosRender } from "../todoPage.js";

let calendarPickerInstance = null;
let reminderPickerInstance = null;

export function datePartSetup(todo, saveHandler) {
    const newContainer = document.querySelector('.date-information-container').cloneNode(true);
    document.querySelector('.date-information-container').replaceWith(newContainer);

    renderDateParts(todo, newContainer);

    newContainer.addEventListener('click', (event) => {
        const calendarAndTextElem = event.target.closest('.calendar-and-text-container');
        const calendarRemoveElem = event.target.closest('.calendar-remove-icon');
        const reminderAndTextElem = event.target.closest('.reminder-and-text-container');
        const reminderRemoveElem = event.target.closest('.reminder-remove-icon');

        if (calendarAndTextElem) {
            setupDatePicker(calendarAndTextElem, (date) => {
                todo.date = date;
                saveHandler.saveChanges();
                saveInLocalStorage();
                renderDateParts(todo);
                todosRender();
            });
        }

        if (calendarRemoveElem) {
            todo.date = null;
            saveHandler.saveChanges();
            saveInLocalStorage();
            renderDateParts(todo);
            todosRender();
        }

        if (reminderAndTextElem) {
            setupReminder(reminderAndTextElem, (reminder) => {
                todo.reminder = reminder;
                saveHandler.saveChanges();
                saveInLocalStorage();
                renderDateParts(todo);
                todosRender();
            });
        }

        if (reminderRemoveElem) {
            todo.reminder = null;
            saveHandler.saveChanges();
            saveInLocalStorage();
            renderDateParts(todo);
            todosRender();
        }
    });
}

function renderDateParts(todo) {
    renderCalendarPart(todo);
    renderReminderPart(todo);
}

function renderCalendarPart(todo) {
    const calendarPartElem = document.querySelector('.calendar-part-container');
    const textElem = calendarPartElem.querySelector('.date-text-part');
    const removeIconElem = calendarPartElem.querySelector('.remove-data-icon-container');

    const hasDate = Boolean(todo.date);
    calendarPartElem.classList.toggle('off', !hasDate);
    textElem.textContent = hasDate ? toFormattedDate(todo.date) : 'Add due date';
    removeIconElem.classList.toggle('icon-hidden', !hasDate);
}

function renderReminderPart(todo) {
    const reminderPartElem = document.querySelector('.reminder-part-container');
    const textElem = reminderPartElem.querySelector('.date-text-part');
    const removeIconElem = reminderPartElem.querySelector('.remove-data-icon-container');

    const hasReminder = Boolean(todo.reminder);
    reminderPartElem.classList.toggle('off', !hasReminder);
    textElem.textContent = hasReminder ? toFormattedDate(todo.reminder) : 'Remind me';
    removeIconElem.classList.toggle('icon-hidden', !hasReminder);
}

export function cleanupEditbar() {
    if (calendarPickerInstance) {
        calendarPickerInstance.destroy();
        calendarPickerInstance = null;
    }

    if (reminderPickerInstance) {
        reminderPickerInstance.destroy();
        reminderPickerInstance = null;
    }

    const highestIntervalId = setTimeout(() => { }, 0);
    for (let i = 1; i < highestIntervalId; i++) {
        clearInterval(i);
    }

    ['top-part-todo-container', 'date-information-container', 'note-part-container'].forEach(className => {
        const elem = document.querySelector(`.${className}`);
        if (elem) {
            elem.removeAttribute('data-initialized');
        }
    });

    const editbarContainer = document.querySelector('.editbar-container');
    if (editbarContainer) {
        editbarContainer.currentTodo = null;
        editbarContainer.dataset.todoId = '';
    }
}

function setupDatePicker(elem, callback) {
    calendarPickerInstance?.destroy();

    const datePickedDateElem = elem.querySelector('.date-text-part');
    const today = dayjs().toISOString();

    calendarPickerInstance = flatpickr("#editbar-calendar-picker", {
        dateFormat: "d.m.Y",
        clickOpens: true,
        position: 'above',
        defaultDate: today,
        onValueUpdate: (dates) => {
            const selectedDate = dayjs(dates[0]).toISOString();
            datePickedDateElem.textContent = dayjs(dates[0]).format('dddd, D.MMMM');
            callback(selectedDate);
            todosRender();

            const container = elem.closest('.calendar-part-container');
            if (container.classList.contains('off')) {
                container.classList.remove('off');
                container.querySelector('.remove-data-icon-container').classList.remove('icon-hidden');
            }
        }
    });

    calendarPickerInstance.open();

    setTimeout(() => {
        const calendarContainer = calendarPickerInstance.calendarContainer;
        const position = getPosition(elem);
        Object.assign(calendarContainer.style, {
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left - 300}px`,
            transform: 'none',
        });
    }, 10);
}

function setupReminder(elem, callback) {
    reminderPickerInstance?.destroy();

    const reminderPickedDateElem = elem.querySelector('.date-text-part');

    reminderPickerInstance = flatpickr("#editbar-reminder-picker", {
        dateFormat: "d.m.Y",
        enableTime: true,
        clickOpens: true,
        position: 'above',
        onValueUpdate: (dates) => {
            const selectedDate = dayjs(dates[0]).toISOString();
            reminderPickedDateElem.textContent = dayjs(dates[0]).format('dddd, D.MMMM');
            if (reminderPickedDateElem.textContent.length > 0) {
                reminderPickedDateElem.style.marginRight = '8px';
            }
            callback(selectedDate);
            todosRender();

            const container = elem.closest('.reminder-part-container');
            if (container.classList.contains('off')) {
                container.classList.remove('off');
                container.querySelector('.remove-data-icon-container').classList.remove('icon-hidden');
            }
        }
    });

    reminderPickerInstance.open();

    setTimeout(() => {
        const reminderContainer = reminderPickerInstance.calendarContainer;
        const position = getPosition(elem);
        Object.assign(reminderContainer.style, {
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left - 300}px`,
            transform: 'none',
        });
    }, 10);
}

function getPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
    };
}

