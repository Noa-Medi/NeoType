import { neo_todo_pre_made_categories, neo_todo_user_made_categories } from './categories.js';
import { Category } from './models.js';
import { idGenerator } from "./component/idGenerator.js";
import { hashDecoder } from './component/hashDecoder.js';
import { todoPageRender } from './todoPage.js';
import { getCategoryName } from './component/getCategoryName.js';
import { categoryFinder } from './categories.js';
import { saveInLocalStorage } from "./categories.js";



export function sidebarCategoriesRender() {
    let categoriesHTML = '';
    let sidebar_categories_element = document.querySelector('.sidebar-categories')
    const categoryName = getCategoryName()
    neo_todo_pre_made_categories.forEach((category) => {

        categoriesHTML += `
    <div class="sidebar-item ${category.name === categoryName ? 'selected-category' : ''}" data-category="${category.name}" data-category-id="${category.categoryID}">
                        <div class="icon-container"><img src="${category.icon}" alt="" class="category-icon"></div>
                        <div class="category-name">${category.name}</div>
                    </div>`;
    });
    categoriesHTML += `<div class="divider-container">
                        <div class="half-divider"></div>
                    </div>`

    neo_todo_user_made_categories.forEach((category) => {
        categoriesHTML += `
                    <div class="sidebar-item ${category.name === categoryName ? 'selected-category' : ''}" data-category="${category.name}" data-category-id="${category.categoryID}">
                                        <div class="icon-container"><img src="${category.icon}" alt="" class="category-icon"></div>
                                        <div class="category-name">${category.name}</div>
                                    </div>`;
    });
    sidebar_categories_element.innerHTML = categoriesHTML;
}


export function categoryClickEvent() {
    const sidebar = document.querySelector('.sidebar-categories');

    sidebar.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.sidebar-item');
        if (!clickedItem) return;

        // Remove from all, add to clicked
        removeSelectionFromCategory()
        clickedItem.classList.add('selected-category');

        const category = clickedItem.dataset.category;
        window.location.hash = category;
    });

    window.addEventListener('hashchange', () => {
        const categoryName = hashDecoder(window.location.hash);
        todoPageRender(categoryName);
    });
}
function removeSelectionFromCategory() {
    document.querySelectorAll('.sidebar-item').forEach((item) => {
        item.classList.remove('selected-category');
    });
}



export function newList() {
    const newListElement = document.querySelector('.new-list-button-container');

    newListElement.addEventListener('click', (event) => {
        // Don't do anything if we're already in input mode
        if (newListElement.classList.contains('new-list-inputer')) return;

        // Set up input mode
        newListElement.classList.add('new-list-inputer');
        newListElement.innerHTML = `<div class="icon-container">
            <img src="assets/icons/add.png" alt="" class="category-icon">
          </div>
          <input type="text" name="new-category" placeholder="Category name" class="new-list-input" autofocus>`;

        const input = newListElement.querySelector('input');
        input.focus();

        // Handle click on the add icon
        newListElement.querySelector('.icon-container').addEventListener('click', (event) => {
            if (input.value) {
                createNewCategory(input.value);
                cleanupInput();
            }
        });

        // Handle Enter key
        input.addEventListener('keydown', (event) => {
            if (event.key === "Enter" && input.value) {
                createNewCategory(input.value);
                cleanupInput();
            }
        });

        // Handle clicks outside the input/button
        const outsideClickListener = (e) => {
            // Check if click was outside our component
            if (!newListElement.contains(e.target)) {
                cleanupInput();
                removeOutsideClickListener();
            }
        };

        // Add the listener after a small delay to avoid immediately catching the current click
        setTimeout(() => {
            document.addEventListener('click', outsideClickListener);
        }, 0);

        // Cleanup function for the outside click listener
        const removeOutsideClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        };

        // Cleanup function for the input
        const cleanupInput = () => {
            newListElement.classList.remove('new-list-inputer');
            newListElement.innerHTML = `
                <div class="icon-container">
                    <img src="assets/icons/add.png" alt="" class="category-icon">
                </div>
                <div class="category-name">New list</div>`;
            removeOutsideClickListener();
        };

        // Helper function to create new category
        const createNewCategory = (name) => {
            if (categoryFinder({ categoryName: name })) {
                alert('Category already exists');
                return;
            }
            let newCategory = new Category({
                name: name,
                icon: '../assets/icons/hamburger-menu.png'
            });
            neo_todo_user_made_categories.push(newCategory);

            const category = newCategory.name;
            window.location.hash = category;
            saveInLocalStorage()
            sidebarCategoriesRender();
            removeSelectionFromCategory();
            lastCategorySelector();
            todoPageRender(category);
        };
    });
}

function lastCategorySelector() {
    let sidebar_categories_elem = document.querySelector('.sidebar-categories');
    sidebar_categories_elem.lastChild.classList.add('selected-category');
}

