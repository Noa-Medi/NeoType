import { idGenerator } from "./component/idGenerator.js"
import { toLocalDate } from './component/dateHelper.js';

export class Todo {
    constructor({ text, todo_id = idGenerator(), isCompleted = false, date = null, reminder = null, timeStamp = Date.now(), isImportant = false, catName = null, note }) {
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
    }

    setTodoList(todolist) {
        this.todos = todolist;
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(t => t.todo_id !== todoId);
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
