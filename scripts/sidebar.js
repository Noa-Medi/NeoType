import { neo_todo_categories } from './categories.js'


export function sidebarCategoriesRender() {
    let categoriesHTML = '';
    let sidebar_categories_element = document.querySelector('.sidebar-categories')
    neo_todo_categories.forEach((category) => {
        categoriesHTML += `
    <div class="sidebar-item " data-category="${category.categoryName}" data-category-id="${category.categoryID}">
                        <div class="icon-container"><img src="${category.categoryIcon}" alt="" class="category-icon"></div>
                        <div class="category-name">${category.categoryName}</div>
                    </div>`;
    });
    sidebar_categories_element.innerHTML = categoriesHTML;
}


export function categoryClickEvent() {

    let sidebar_pages_Elems = document.querySelectorAll('.sidebar-item');
    document.addEventListener('DOMContentLoaded', () => {
        sidebar_pages_Elems.forEach((pageElem) => {
            pageElem.addEventListener('click', (event) => {


                sidebar_pages_Elems.forEach((elem) => {
                    elem.classList.remove('selected-category');
                })
                pageElem.classList.add('selected-category');
                const category = pageElem.dataset.category;
                window.location.hash = category;
            });
        });

    });

    // Handle initial load or hash change
    window.addEventListener('hashchange', () => {
        const category = window.location.hash.substring(1);
        todoPageRender(category); // You define this function
    });
}

