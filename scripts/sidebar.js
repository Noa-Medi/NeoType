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
        console.log('initialzed')

        console.log(sidebar_pages_Elems.length);
        sidebar_pages_Elems.forEach((pagesElem) => {
            pagesElem.addEventListener('click', (event) => {

                sidebar_pages_Elems.forEach((elem) => {
                    elem.classList.remove('selected-category');
                    pagesElem.classList.add('selected-category')
                })

            });
        });

    });
}