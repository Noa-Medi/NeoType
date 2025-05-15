import { Todo, Category } from './models.js';

export let neo_todo_pre_made_categories = [];
export let neo_todo_user_made_categories = [];

export function loadFromLocalStorage() {
    // Helper function to revive a category
    const reviveCategory = (catData) => {
        const category = new Category({
            name: catData.name,
            icon: catData.icon,
            isCompletedCollapsed: catData.isCompletedCollapsed
        });

        // Revive todos as Todo instances
        category.todos = catData.todos.map(todoData => new Todo({
            text: todoData.text,
            todo_id: todoData.todo_id,
            isCompleted: todoData.isCompleted,
            date: todoData.date,
            reminder: todoData.reminder,
            timeStamp: todoData.timeStamp,
            isImportant: todoData.isImportant,
            catName: category.name,
            note: todoData.note
        }));

        return category;
    };

    // Load pre-made categories
    if (localStorage.getItem('neo_todo_pre_made_categories')) {
        const savedPreMade = JSON.parse(localStorage.getItem('neo_todo_pre_made_categories'));
        neo_todo_pre_made_categories = savedPreMade.map(reviveCategory);
    } else {
        // Initial setup (same as your existing code)
        neo_todo_pre_made_categories = [
            {
                categoryName: 'My Day',
                categoryID: 'rmpfdcj',
                todos: [],
                categoryIcon: '../assets/icons/sun.png',
                isCompletedCollapsed: true

            }, {
                categoryName: 'Important',
                categoryID: 'o9xaf5h',
                todos: [],
                categoryIcon: '../assets/icons/star.png',
                isCompletedCollapsed: true

            }, {
                categoryName: 'Tasks',
                categoryID: 'famwsff',
                todos: [{
                    text: 'This is the First task',
                    todo_id: '98sd4f9s8df',
                    isCompleted: false,
                    date: null,
                    reminder: null,
                    isImportant: true,
                    note: '12312312312312312312312123123123123123123123123123123123 ',
                    timeStamp: '2025-05-15T06:22:25.674Z'

                }, {
                    text: 'This is the Second task',
                    todo_id: 'oi23890erfh4',
                    isCompleted: false,
                    date: '2025-05-06T07:18:39.986Z',
                    reminder: null,
                    isImportant: true,
                    timeStamp: '2025-05-15T06:50:58.043Z'
                }, {
                    text: 'This is the Third task',
                    todo_id: 'jf983q2yajhf',
                    isCompleted: false,
                    date: null,
                    reminder: null,
                    isImportant: false,
                    timeStamp: '2025-05-15T05:53:58.043Z'
                }, {
                    text: 'This is the Forth task',
                    todo_id: 'ajw983jfwse3',
                    isCompleted: true,
                    date: '2025-05-06T07:18:39.986Z',
                    reminder: null,
                    isImportant: true,
                    timeStamp: '2025-05-15T01:53:58.043Z'
                }, {
                    text: 'This is the Fifth task',
                    todo_id: 'ajw983jfasdfewse3',
                    isCompleted: true,
                    date: '2025-02-06T07:18:39.986Z',
                    reminder: null,
                    isImportant: false,
                },],
                categoryIcon: '../assets/icons/home.png',
                isCompletedCollapsed: true

            }
        ].map(item => {
            const category = new Category({
                name: item.categoryName,
                categoryID: item.categoryID,
                icon: item.categoryIcon,
                todos: item.todos,
                isCompletedCollapsed: item.isCompletedCollapsed
            });
            item.todos.forEach(todoItem => {
                category.addTodo(new Todo({
                    text: todoItem.text,
                    todo_id: todoItem.todo_id,
                    isCompleted: todoItem.isCompleted,
                    date: todoItem.date,
                    reminder: todoItem.reminder,
                    timeStamp: todoItem.timeStamp,
                    isImportant: todoItem.isImportant,
                    catName: category.name,
                    note: todoItem.note,
                }));
            });
            return category;
        });
        localStorage.setItem('neo_todo_pre_made_categories', JSON.stringify(neo_todo_pre_made_categories));
    }

    // Load user-made categories
    if (localStorage.getItem('neo_todo_user_made_categories')) {
        const savedUserMade = JSON.parse(localStorage.getItem('neo_todo_user_made_categories'));
        neo_todo_user_made_categories = savedUserMade.map(reviveCategory);
    } else {
        // Initial setup (same as your existing code)
        neo_todo_user_made_categories = [
            {
                categoryName: 'Goals',
                categoryID: 'adsfefdcj',
                todos: [],
                categoryIcon: '../assets/icons/hamburger-menu.png'
            }, {
                categoryName: 'Grocery list',
                categoryID: 'hergf5h',
                todos: [],
                categoryIcon: '../assets/icons/hamburger-menu.png'
            },
        ].map(item => {
            const category = new Category({
                name: item.categoryName,
                categoryID: item.categoryID,
                icon: item.categoryIcon,
                todos: item.todos,
                isCompletedCollapsed: item.isCompletedCollapsed
            });
            item.todos.forEach(todoItem => {
                category.addTodo(new Todo({
                    text: todoItem.text,
                    todo_id: todoItem.todo_id,
                    isCompleted: todoItem.isCompleted,
                    date: todoItem.date,
                    reminder: todoItem.reminder,
                    timeStamp: todoItem.timeStamp,
                    isImportant: todoItem.isImportant,
                    catName: category.name,
                    note: todoItem.note,
                }));
            });
            return category;
        });
        localStorage.setItem('neo_todo_user_made_categories', JSON.stringify(neo_todo_user_made_categories));
    }


}

export function saveInLocalStorage() {
    localStorage.setItem('neo_todo_pre_made_categories', JSON.stringify(neo_todo_pre_made_categories));
    localStorage.setItem('neo_todo_user_made_categories', JSON.stringify(neo_todo_user_made_categories));
    loadFromLocalStorage()
}







export function categoryFinder({ categoryName, categoryId }) {

    if (categoryName) {
        let category = null; // Define it first

        neo_todo_pre_made_categories.forEach((cat) => {
            if (cat.name === categoryName) {
                category = cat;
            }
        });

        if (!category) {
            neo_todo_user_made_categories.forEach((cat) => {
                if (cat.name === categoryName) {
                    category = cat;
                }
            });
        }
        if (category) {
            return category;
        } else {
            console.log('Category not found:', categoryName);


        }

    } if (categoryId) {
        let category = null; // Define it first

        neo_todo_pre_made_categories.forEach((cat) => {
            if (cat.id === categoryId) {
                category = cat;
            }
        });

        if (!category) {
            neo_todo_user_made_categories.forEach((cat) => {
                if (cat.id === categoryId) {
                    category = cat;
                }
            });
        }
        if (category) {
            return category;
        } else {
            console.log('Category not found:', categoryId);


        }
    }

}

export function todoFinder(categoryName, todoId) {
    const todo = categoryFinder({ categoryName }).findTodoById(todoId);
    return todo;
}
