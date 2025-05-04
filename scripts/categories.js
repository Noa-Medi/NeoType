import { Todo, Category } from './models.js';



export let neo_todo_pre_made_categories = [
    {
        categoryName: 'My Day',
        categoryID: 'rmpfdcj',
        todos: [],
        categoryIcon: '../assets/icons/sun.png',

    }, {
        categoryName: 'Important',
        categoryID: 'o9xaf5h',
        todos: [],
        categoryIcon: '../assets/icons/star.png',

    }, {
        categoryName: 'Tasks',
        categoryID: 'famwsff',
        todos: [{
            text: 'This is the First task',
            todo_id: '98sd4f9s8df',
            isCompleted: false,
            date: null,
            reminder: null,

        }, {
            text: 'This is the Second task',
            todo_id: 'oi23890erfh4',
            isCompleted: false,
            date: null,
            reminder: null,
        }, {
            text: 'This is the Third task',
            todo_id: 'jf983q2yajhf',
            isCompleted: false,
            date: null,
            reminder: null,
        }, {
            text: 'This is the Forth task',
            todo_id: 'ajw983jfwse3',
            isCompleted: true,
            date: null,
            reminder: null,
        }, {
            text: 'This is the Fifth task',
            todo_id: 'ajw983jfasdfewse3',
            isCompleted: true,
            date: null,
            reminder: null,
        },],
        categoryIcon: '../assets/icons/home.png',

    }
].map((item) => {
    const category = new Category(item.categoryName, item.categoryIcon);
    item.todos.forEach((todoItem) => {
        const todo = new Todo(todoItem.text, todoItem.todo_id, todoItem.isCompleted, todoItem.date, todoItem.reminder)
        category.addTodo(todo);
    });
    return category;
});

function myDaySetup() {
    // neo_todo_pre_made_categories.categoryFinder('Tasks').findTodosByDate();
    // neo_todo_pre_made_categories.categoryFinder('My Day').todos = 
}

export let neo_todo_user_made_categories = [
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
].map((item) => {
    const category = new Category(item.categoryName, item.categoryIcon);
    item.todos.forEach((todoItem) => {
        const todo = new Todo(todoItem.text, todoItem.todo_id, todoItem.isCompleted, todoItem.date, todoItem.reminder)
        category.addTodo(todo);
    });
    return category;
})


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
            return null;
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
            return null;
        }
    }

}

export function todoFinder(categoryName, todoId) {
    const todo = categoryFinder({ categoryName }).findTodoById(todoId);
    return todo;
}