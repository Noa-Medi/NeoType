export function notePartSetup(todo) {
    // Initial render
    renderNotePart(todo);

    // Set up event listeners only once
    const noteTextContainerElem = document.querySelector('.note-part-container');
    if (!noteTextContainerElem.dataset.initialized) {
        noteTextContainerElem.addEventListener('click', (event) => {
            const noteTextElem = event.target.closest('.note-taxt-content');

            if (noteTextElem) {
                console.log('noteTextElem clicked:', noteTextElem);
                // Add your note editing logic here
            }
        });

        // Mark as initialized to prevent duplicate listeners
        noteTextContainerElem.dataset.initialized = true;
    }
}

function renderNotePart(todo) {
    const noteTextElem = document.querySelector('.note-taxt-content');
    const noteTextContainerElem = document.querySelector('.note-part-container');

    if (!todo.note) {
        noteTextContainerElem.classList.add('off');
        noteTextElem.textContent = 'Add note';
    } else {
        noteTextContainerElem.classList.remove('off');
        noteTextElem.textContent = todo.note;
    }
}