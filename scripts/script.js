import { sidebarCategoriesRender, categoryClickEvent, newList } from "./sidebar.js";
import { todoPageRender } from './todoPage.js';
import { hashDecoder } from './component/hashDecoder.js';
import { todoCategoryFinder } from './categories.js';

const runApp = () => {
    const hashLocation = hashDecoder(window.location.hash);

    sidebarCategoriesRender()

    categoryClickEvent()

    if (hashLocation && todoCategoryFinder(hashLocation)) {
        // console.log(`hashlocation : ${hashLocation} , todocategoryFinder : ${todoCategoryFinder(hashLocation)}`)
        todoPageRender(hashLocation)
    } else {
        // console.log(`hashlocation : ${hashLocation} , todocategoryFinder : ${todoCategoryFinder(hashLocation)}`)
        todoPageRender('My Day')
    }

    newList()

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runApp);
} else {
    runApp();
}
