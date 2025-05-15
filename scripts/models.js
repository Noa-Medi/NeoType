import { idGenerator } from "./component/idGenerator.js"
import { toLocalDate } from './component/dateHelper.js';
import { loadFromLocalStorage, saveInLocalStorage } from './categories.js';

export class Todo {
    constructor({ text, todo_id = idGenerator(), isCompleted = false, date = null, reminder = null, timeStamp = dayjs().toISOString(), isImportant = false, catName = null, note }) {
        this.text = text;
        this.todo_id = todo_id;
        this.isCompleted = isCompleted;
        this.date = date;
        this.reminder = reminder;
        this.timeStamp = timeStamp;
        this.isImportant = isImportant;
        this.catName = catName;
        this.note = note;
    }
}

export class Category {
    constructor({ name, icon, todos = [], isCompletedCollapsed = true }) {
        this.name = name;
        this.id = idGenerator();
        this.icon = icon;
        this.todos = todos;
        this.isCompletedCollapsed = isCompletedCollapsed;
    }

    addTodo(todo) {
        this.todos.push(todo);
        saveInLocalStorage();
    }

    setTodoList(todolist) {
        this.todos = todolist;
        saveInLocalStorage();
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(t => t.todo_id !== todoId);
        console.log(`removed todo with id ${todoId}`)
        console.log(this.todos)
        saveInLocalStorage();
    }


    findTodoById(todoId) {
        return this.todos.find(t => t.todo_id === todoId);
    }

    filterTodosByDate(date) {
        if (!date) return [];
        date = toLocalDate(date)
        let todos = this.todos.filter(t => toLocalDate(t.date)?.slice(0, 10) === date?.slice(0, 10))
        return todos;
    }

    filterTodosByImportant() {

        let todos = this.todos.filter(t => t.isImportant === true);

        return todos;
    }
}
