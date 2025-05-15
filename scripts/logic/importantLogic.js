import { categoryFinder, neo_todo_pre_made_categories, neo_todo_user_made_categories } from "../categories.js";


export function getImportantTodos() {
    const allCategoreis = [
        categoryFinder({ categoryName: 'Tasks' }),
        ...neo_todo_user_made_categories,
    ];
    let todoList = [];
    allCategoreis.forEach((category) => {
        category.filterTodosByImportant().forEach((t) => {

            // let todo = new Todo({ text: t.text, })
            todoList.push(t);
        });
    });
    categoryFinder({ categoryName: 'Important' }).setTodoList(todoList);



}