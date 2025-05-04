import { sidebarCategoriesRender, categoryClickEvent, newList } from "./sidebar.js";
import { todoPageRender } from './todoPage.js';
import { hashDecoder } from './component/hashDecoder.js';
import { categoryFinder } from './categories.js';

const runApp = () => {
    const hashLocation = hashDecoder(window.location.hash);

    sidebarCategoriesRender()

    categoryClickEvent()

    if (hashLocation && categoryFinder({ categoryName: hashLocation })) {
        todoPageRender(hashLocation)
    } else {
        todoPageRender('My Day')
    }

    newList()

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runApp);
} else {
    runApp();
}
