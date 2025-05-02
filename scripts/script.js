import { sidebarCategoriesRender, categoryClickEvent, newList } from "./sidebar.js";
import { todoPageRender } from './todoPage.js';
import { hashDecoder } from './component/hashDecoder.js';
import { categoryFinder } from './categories.js';
import { getCategoryName } from "./component/getCategoryName.js";

const runApp = () => {
    const hashLocation = getCategoryName()

    if (hashLocation && categoryFinder({ hashLocation: hashLocation })) {
        todoPageRender()
    } else {
        todoPageRender('My Day')
    }

    sidebarCategoriesRender()

    categoryClickEvent()



    newList()

};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runApp);
} else {
    runApp();
}
