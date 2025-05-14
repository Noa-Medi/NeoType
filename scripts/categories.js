import { Todo, Category } from './models.js';



export let neo_todo_pre_made_categories = [
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
            note: '12312312312312312312312123123123123123123123123123123123 '

        }, {
            text: 'This is the Second task',
            todo_id: 'oi23890erfh4',
            isCompleted: false,
            date: '2025-05-06T07:18:39.986Z',
            reminder: null,
            isImportant: true,
        }, {
            text: 'This is the Third task',
            todo_id: 'jf983q2yajhf',
            isCompleted: false,
            date: null,
            reminder: null,
            isImportant: false,
        }, {
            text: 'This is the Forth task',
            todo_id: 'ajw983jfwse3',
            isCompleted: true,
            date: '2025-05-06T07:18:39.986Z',
            reminder: null,
            isImportant: true,
        }, {
            text: 'This is the Fifth task',
            todo_id: 'ajw983jfasdfewse3',
            isCompleted: true,
            date: '2025-05-06T07:18:39.986Z',
            reminder: null,
            isImportant: false,
        },],
        categoryIcon: '../assets/icons/home.png',
        isCompletedCollapsed: true

    }
].map((item) => {
    const category = new Category({
        name: item.categoryName,
        icon: item.categoryIcon,
        isCompletedCollapsed: item.isCompletedCollapsed
    });
    item.todos.forEach((todoItem) => {
        const todo = new Todo({
            text: todoItem.text,
            todo_id: todoItem.todo_id,
            isCompleted: todoItem.isCompleted,
            date: todoItem.date,
            reminder: todoItem.reminder,
            timeStamp: undefined,
            isImportant: todoItem.isImportant,
            catName: category.name,
            note: todoItem.note,
        });
        category.addTodo(todo);

    });
    return category;
});



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
    const category = new Category({
        name: item.categoryName,
        icon: item.categoryIcon,
        isCompletedCollapsed: item.isCompletedCollapsed
    });
    item.todos.forEach((todoItem) => {
        const todo = new Todo({
            text: todoItem.text,
            todo_id: todoItem.todo_id,
            isCompleted: todoItem.isCompleted,
            date: todoItem.date,
            reminder: todoItem.reminder,
            timeStamp: undefined,
            isImportant: todoItem.isImportant,
            catName: category.name,
            note: todoItem.note,
        });
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
