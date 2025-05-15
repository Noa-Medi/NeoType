import { sidebarCategoriesRender, categoryClickEvent, newList } from "./sidebar.js";
import { todoPageRender } from './todoPage.js';
import { hashDecoder } from './component/hashDecoder.js';
import { categoryFinder } from './categories.js';
import { getCategoryName } from "./component/getCategoryName.js";
import { loadFromLocalStorage } from "./categories.js";




const runApp = () => {
    const hashLocation = getCategoryName()
    loadFromLocalStorage()


    if (hashLocation && categoryFinder({ categoryName: hashLocation })) {
        todoPageRender()
    } else {
        todoPageRender('My Day')
    }

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
