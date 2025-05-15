import { saveInLocalStorage } from "../categories.js";
import { todosRender } from "../todoPage.js";

export function notePartSetup(todo) {

    const editbar = document.querySelector('.editbar-container');
    const container = editbar.querySelector('.note-part-container');
    const noteInput = editbar.querySelector('.note-text-content');

    // Always render current todo's note
    renderNotePart(todo, container, noteInput);

    // ❗ Remove old listeners to prevent duplicates
    noteInput.replaceWith(noteInput.cloneNode(true));
    const newNoteInput = editbar.querySelector('.note-text-content');

    // Re-render again after clone
    renderNotePart(todo, container, newNoteInput);

    let latestNoteText = "";

    newNoteInput.addEventListener('keyup', () => {
        newNoteInput.style.height = 'auto';
        newNoteInput.style.height = `${newNoteInput.scrollHeight}px`;
        latestNoteText = newNoteInput.value.trim();
    });

    newNoteInput.addEventListener("blur", () => {

        if (todo.note !== latestNoteText) {
            todo.note = latestNoteText;
            saveInLocalStorage();
            renderNotePart(todo, container, newNoteInput);

            todosRender();
        }
    });

    newNoteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            newNoteInput.blur();
        }
    });

    container.dataset.initialized = true;
}


function renderNotePart(todo, container, noteInput) {

    const hasNote = !!todo.note?.trim();
    container.classList.toggle('off', !hasNote);

    noteInput.value = hasNote ? todo.note : 'Add note';

    noteInput.style.height = 'auto';
    noteInput.style.height = `${noteInput.scrollHeight}px`;

}


