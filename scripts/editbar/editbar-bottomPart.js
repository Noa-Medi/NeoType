import { categoryFinder } from "../categories.js";
import { cleanupEditbar } from "./editbar-datePart.js";
import { bodySizeChanger, editbarTrigger } from "./editbar.js";
import { todosRender } from "../todoPage.js";

export function bottomPartSetup(todo) {
    const timestampTextElem = document.querySelector('.timestamp-text');
    const deleteIconContainer = document.querySelector('.delete-icon-container');
    renderTimestamp(todo, timestampTextElem);

    deleteIconContainer.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling

        const category = categoryFinder({ categoryName: todo.catName });

        // 1. Immediately remove from data model
        category.removeTodo(todo.todo_id);
        console.log('Todo removed from model', category.todos);

        // 2. Close editbar and clean up
        editbarTrigger(todo, false);
        cleanupEditbar();
        bodySizeChanger();

        // 3. Force a fresh render
        todosRender();

        // 4. Optional: Ensure category is still valid
        console.log('Current category state:', category);
    });

}

function renderTimestamp(todo, timestampTextElem) {
    console.log(todo);
    const timestamp = todo.timeStamp;
    console.log(`timestamp : ${timestamp}`);

    const now = dayjs().toISOString();
    const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
    if (diff < 60) {
        timestampTextElem.textContent = ` Created ${diff} seconds ago`;
        const interval = setInterval(() => {
            const now = dayjs().toISOString();
            const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
            timestampTextElem.textContent = ` Created ${diff} seconds ago`;
            if (diff >= 60) {
                clearInterval(interval);
            }
        }, 1000);
        return;
    } if (diff > 60 && diff < 3600) {
        const diffInMinutes = Math.floor(diff / 60);
        timestampTextElem.textContent = ` Created ${diffInMinutes} minutes ago`;
        const interval = setInterval(() => {
            const now = dayjs().toISOString();
            const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
            const diffInMinutes = Math.floor(diff / 60);
            timestampTextElem.textContent = ` Created ${diffInMinutes} minutes ago`;
            if (diff >= 3600) {
                clearInterval(interval);
            }
        }, 60000);
        return;
    } if (diff >= 3600) {
        const diffInHours = Math.floor(diff / 60 / 60);
        timestampTextElem.textContent = ` Created ${diffInHours} hours ago`;
        const interval = setInterval(() => {
            const now = dayjs().toISOString();
            const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
            const diffInHours = Math.floor(diff / 60 / 60);
            timestampTextElem.textContent = ` Created ${diffInHours} hours ago`;
            if (diff >= 3600) {
                clearInterval(interval);
            }
        }, 3600000);
        return;
    }



    setInterval(() => {
        const now = dayjs().toISOString();

        const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
        console.log(`diff : ${diff}`);

        if (diff < 60) {
            timestampTextElem.textContent = ` Created ${diff} seconds ago`
            return;
        } else if (diff > 3600) {
            const diffInHours = Math.floor(diff / 60 / 60);
            console.log(`diffInHours : ${diffInHours}`);
            timestampTextElem.textContent = ` Created ${diffInHours} hours ago`
            return;

        }
        const diffInMinutes = Math.floor(diff / 60);
        console.log(`diffInMinutes : ${diffInMinutes}`);
        timestampTextElem.textContent = ` Created ${diffInMinutes} minutes ago`
    }, 1000);
}