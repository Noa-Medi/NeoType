import { idGenerator } from "./component/idGenerator.js"


export class Todo {
    constructor(text, todo_id = idGenerator(), isCompleted = false, date = null, reminder = null, timeStamp = Date.now()) {
        this.text = text;
        this.todo_id = todo_id;
        this.isCompleted = isCompleted;
        this.date = date;
        this.reminder = reminder;
        this.timeStamp = timeStamp;
    }
}

export class Category {
    constructor(name, icon, todos = []) {
        this.name = name;
        this.id = idGenerator();
        this.icon = icon;
        this.todos = todos;
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    removeTodo(todoId) {
        this.todos = this.todos.filter(t => t.todo_id !== todoId);
    }

    findTodoById(todoId) {
        return this.todos.find(t => t.todo_id === todoId);
    }
}
