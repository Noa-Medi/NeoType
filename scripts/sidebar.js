import { neo_todo_pre_made_categories, neo_todo_user_made_categories } from './categories.js'
import { idGenerator } from "./idGenerator.js"


export function sidebarCategoriesRender() {
    let categoriesHTML = '';
    let sidebar_categories_element = document.querySelector('.sidebar-categories')
    neo_todo_pre_made_categories.forEach((category) => {
        categoriesHTML += `
    <div class="sidebar-item ${category.categoryName === 'My Day' ? 'selected-category' : ''}" data-category="${category.categoryName}" data-category-id="${category.categoryID}">
                        <div class="icon-container"><img src="${category.categoryIcon}" alt="" class="category-icon"></div>
                        <div class="category-name">${category.categoryName}</div>
                    </div>`;
    });
    categoriesHTML += `<div class="divider-container">
                        <div class="half-divider"></div>
                    </div>`

    neo_todo_user_made_categories.forEach((category) => {
        categoriesHTML += `
                    <div class="sidebar-item " data-category="${category.categoryName}" data-category-id="${category.categoryID}">
                                        <div class="icon-container"><img src="${category.categoryIcon}" alt="" class="category-icon"></div>
                                        <div class="category-name">${category.categoryName}</div>
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
        const category = window.location.hash.substring(1);
        // todoPageRender(category);
    });
}
function removeSelectionFromCategory() {
    document.querySelectorAll('.sidebar-item').forEach((item) => {
        item.classList.remove('selected-category');
    });
}



export function newList() {
    const newListElement = document.querySelector('.new-list-button-container');

    newListElement.addEventListener('click', () => {
        if (newListElement.classList.contains('new-list-inputer')) return;

        newListElement.classList.add('new-list-inputer');
        newListElement.innerHTML = `<div class="icon-container">
            <img src="assets/icons/add.png" alt="" class="category-icon">
          </div>
          <input type="text" name="new-category" placeholder="Category name" class="new-list-input" autofocus>`;

        const input = newListElement.querySelector('input');

        input.focus();

        input.addEventListener('blur', () => {
            newListElement.classList.remove('new-list-inputer');
            newListElement.innerHTML = `
          <div class="icon-container">
            <img src="assets/icons/add.png" alt="" class="category-icon">
          </div>
          <div class="category-name">New list</div>`;
        });

        input.addEventListener('keydown', (event) => {


            if (event.key === "Enter") {
                let newCategory = {
                    categoryName: input.value,
                    categoryID: idGenerator(),
                    todos: [],
                    categoryIcon: '../assets/icons/hamburger-menu.png',

                };
                neo_todo_user_made_categories.push(newCategory)
                newListElement.classList.remove('new-list-inputer');
                newListElement.innerHTML = `
          <div class="icon-container">
            <img src="assets/icons/add.png" alt="" class="category-icon">
          </div>
          <div class="category-name">New list</div>`;

                const category = newCategory.categoryName;
                window.location.hash = category;
                sidebarCategoriesRender()
                removeSelectionFromCategory()
                lastCategorySelector()

            }

        });
    });
}

function lastCategorySelector() {
    let sidebar_categories_elem = document.querySelector('.sidebar-categories');


}