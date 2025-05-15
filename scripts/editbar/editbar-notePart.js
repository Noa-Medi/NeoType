import { saveInLocalStorage } from "../categories.js";
import { todosRender } from "../todoPage.js";

export function notePartSetup(todo, saveHandler) {

    const editbar = document.querySelector('.editbar-container');
    const container = editbar.querySelector('.note-part-container');

    // Clone to remove old listeners
    const newContainer = container.cloneNode(true);
    container.replaceWith(newContainer);

    const noteInput = newContainer.querySelector('.note-text-content');
    renderNotePart(todo, newContainer, noteInput);

    let latestNoteText = todo.note || '';

    noteInput.addEventListener('input', () => {
        noteInput.style.height = 'auto';
        noteInput.style.height = noteInput.scrollHeight + 'px';
        latestNoteText = noteInput.value.trim();
    });

    noteInput.addEventListener('blur', () => {
        if (todo.note !== latestNoteText) {
            todo.note = latestNoteText;
            saveHandler.saveChanges();
            saveInLocalStorage();
            todosRender();
        }
    });

    noteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            noteInput.blur();
        }
    });
}

function renderNotePart(todo, container, noteInput) {
    const hasNote = !!todo.note?.trim();
    container.classList.toggle('off', !hasNote);
    noteInput.value = hasNote ? todo.note : 'Add note';
    noteInput.style.height = 'auto';
    noteInput.style.height = noteInput.scrollHeight + 'px';
}

