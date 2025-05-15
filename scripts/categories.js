import { Todo, Category } from './models.js';
import { idGenerator } from './component/idGenerator.js';

export let neo_todo_pre_made_categories = [];
export let neo_todo_user_made_categories = [];

export function loadFromLocalStorage() {
    // Helper to revive Todo instances
    const reviveTodo = (todoData) => {
        return new Todo({
            text: todoData.text,
            todo_id: todoData.todo_id || idGenerator(),
            isCompleted: todoData.isCompleted || false,
            date: todoData.date || null,
            reminder: todoData.reminder || null,
            timeStamp: todoData.timeStamp || new Date().toISOString(),
            isImportant: todoData.isImportant || false,
            catName: todoData.catName,
            note: todoData.note || ''
        });
    };

    // Helper to revive Category instances
    const reviveCategory = (catData) => {
        const category = new Category({
            name: catData.name || catData.categoryName,
            id: catData.id || catData.categoryID || idGenerator(),
            icon: catData.icon || catData.categoryIcon,
            isCompletedCollapsed: catData.isCompletedCollapsed !== undefined
                ? catData.isCompletedCollapsed
                : true
        });

        // Revive todos and add to category
        if (catData.todos) {
            category.todos = catData.todos.map(reviveTodo);
        }
        return category;
    };

    // Load pre-made categories
    if (localStorage.getItem('neo_todo_pre_made_categories')) {
        try {
            const savedData = JSON.parse(localStorage.getItem('neo_todo_pre_made_categories'));
            neo_todo_pre_made_categories = savedData.map(reviveCategory);
        } catch (e) {
            console.error('Error loading pre-made categories:', e);
            neo_todo_pre_made_categories = getDefaultPreMadeCategories();
        }
    } else {
        neo_todo_pre_made_categories = getDefaultPreMadeCategories();
        localStorage.setItem('neo_todo_pre_made_categories', JSON.stringify(neo_todo_pre_made_categories));
    }

    // Load user-made categories
    if (localStorage.getItem('neo_todo_user_made_categories')) {
        try {
            const savedData = JSON.parse(localStorage.getItem('neo_todo_user_made_categories'));
            neo_todo_user_made_categories = savedData.map(reviveCategory);
        } catch (e) {
            console.error('Error loading user-made categories:', e);
            neo_todo_user_made_categories = getDefaultUserMadeCategories();
        }
    } else {
        neo_todo_user_made_categories = getDefaultUserMadeCategories();
        localStorage.setItem('neo_todo_user_made_categories', JSON.stringify(neo_todo_user_made_categories));
    }
}

function getDefaultPreMadeCategories() {
    return [
        {
            name: 'My Day',
            icon: '../assets/icons/sun.png',
            isCompletedCollapsed: true,
            todos: []
        },
        {
            name: 'Important',
            icon: '../assets/icons/star.png',
            isCompletedCollapsed: true,
            todos: []
        },
        {
            name: 'Tasks',
            icon: '../assets/icons/home.png',
            isCompletedCollapsed: true,
            todos: [
                {
                    text: 'This is the First task',
                    isCompleted: false,
                    isImportant: true,
                    note: '12312312312312312312312123123123123123123123123123123123'
                },
                {
                    text: 'This is the Second task',
                    isCompleted: false,
                    date: '2025-05-06T07:18:39.986Z',
                    isImportant: true
                },
                {
                    text: 'This is the Third task',
                    isCompleted: false,
                    isImportant: false
                },
                {
                    text: 'This is the Forth task',
                    isCompleted: true,
                    date: '2025-05-06T07:18:39.986Z',
                    isImportant: true
                },
                {
                    text: 'This is the Fifth task',
                    isCompleted: true,
                    date: '2025-02-06T07:18:39.986Z'
                }
            ].map((todo, index) => ({
                ...todo,
                todo_id: `default_task_${index}`,
                timeStamp: new Date().toISOString(),
                catName: 'Tasks'
            }))
        }
    ].map(cat => {
        const category = new Category(cat);
        category.todos = cat.todos.map(t => new Todo(t));
        return category;
    });
}

function getDefaultUserMadeCategories() {
    return [
        {
            name: 'Goals',
            icon: '../assets/icons/hamburger-menu.png',
            todos: []
        },
        {
            name: 'Grocery list',
            icon: '../assets/icons/hamburger-menu.png',
            todos: []
        }
    ].map(cat => new Category(cat));
}

export function saveInLocalStorage() {
    // console.log(neo_todo_user_made_categories);
    const serializeCategory = (category) => ({
        ...category,
        todos: category.todos.map(todo => ({
            ...todo,
            // Ensure we only save the data, not methods
            catName: category.name
        }))
    });

    localStorage.setItem(
        'neo_todo_pre_made_categories',
        JSON.stringify(neo_todo_pre_made_categories.map(serializeCategory))
    );
    localStorage.setItem(
        'neo_todo_user_made_categories',
        JSON.stringify(neo_todo_user_made_categories.map(serializeCategory))
    );
}

export function categoryFinder({ categoryName, categoryId }) {
    const allCategories = [...neo_todo_pre_made_categories, ...neo_todo_user_made_categories];

    let category;
    if (categoryName) {
        category = allCategories.find(c => c.name === categoryName);
    } else if (categoryId) {
        category = allCategories.find(c => c.id === categoryId);
    }

    if (!category) {
        console.error('Category not found:', categoryName || categoryId);
        console.debug('Available categories:', allCategories.map(c => ({
            name: c.name,
            id: c.id,
            todoCount: c.todos.length
        })));
        return null;
    }

    // ✅ Just return the original instance directly
    return category;
}

export function todoFinder(categoryName, todoId) {
    const category = categoryFinder({ categoryName });
    if (!category) return null;

    const todo = category.todos.find(t => t.todo_id === todoId);
    if (!todo) {
        console.error(`Todo ${todoId} not found in category ${categoryName}`);
        return null;
    }

    return todo instanceof Todo ? todo : new Todo(todo);
}