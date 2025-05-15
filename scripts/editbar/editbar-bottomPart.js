import { categoryFinder } from "../categories.js";
import { cleanupEditbar } from "./editbar-datePart.js";
import { bodySizeChanger, editbarTrigger } from "./editbar.js";
import { todosRender } from "../todoPage.js";
import { saveInLocalStorage } from "../categories.js";

export function bottomPartSetup(todo, saveHandler) {
    const timestampTextElem = document.querySelector('.timestamp-text');
    const deleteIconContainer = document.querySelector('.delete-icon-container');

    // Clone to remove old listeners
    const newDeleteIcon = deleteIconContainer.cloneNode(true);
    deleteIconContainer.replaceWith(newDeleteIcon);

    renderTimestamp(todo, timestampTextElem);

    newDeleteIcon.addEventListener('click', async (e) => {
        e.stopPropagation();

        // 1. Close editbar first
        editbarTrigger(todo, false);
        bodySizeChanger();
        cleanupEditbar();

        // 2. Remove from model
        const category = categoryFinder({ categoryName: todo.catName });
        if (!category) {
            console.error('Category not found:', todo.catName);
            return;
        }

        // 4. Actually remove
        category.removeTodo(todo.todo_id);
        console.log('Current category todos:', category.todos);

        // 5. Save updated state AFTER removal
        saveInLocalStorage();

        // 6. Force complete re-render
        await new Promise(resolve => setTimeout(resolve, 50));
        todosRender();
    });
}
function renderTimestamp(todo, timestampTextElem) {
    console.log('renderTimestamp called');

    const timestamp = todo.timeStamp;


    const now = dayjs().toISOString();
    const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');
    if (diff < 60) {
        timestampTextElem.textContent = ` Created ${diff} seconds ago`;
        const interval = setInterval(() => {
            console.log('interval triggered');
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
            console.log('interval triggered');
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
            console.log('interval triggered');
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
        console.log('interval triggered');
        const now = dayjs().toISOString();

        const diff = dayjs(now).diff(dayjs(timestamp), 'seconds');

        if (diff < 60) {
            timestampTextElem.textContent = ` Created ${diff} seconds ago`
            return;
        } else if (diff > 3600) {
            const diffInHours = Math.floor(diff / 60 / 60);
            timestampTextElem.textContent = ` Created ${diffInHours} hours ago`
            return;

        }
        const diffInMinutes = Math.floor(diff / 60);
        timestampTextElem.textContent = ` Created ${diffInMinutes} minutes ago`
    }, 1000);
}
