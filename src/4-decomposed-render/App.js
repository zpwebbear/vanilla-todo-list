import { List } from "./List.js";
import { InputItem } from "./InputItem.js";
import { TodoItem } from "./TodoItem.js";
import { TodoListMediator } from "./TodoListMediator.js";

class App {
  constructor() {
    const mediator = new TodoListMediator();
    const inputItem = new InputItem(mediator);
    const todoItem1 = new TodoItem(mediator, "Item 1");
    const todoItem2 = new TodoItem(mediator, "Item 2");
    const children = [todoItem1, todoItem2, inputItem];
    this.rootList = new List(mediator, children);
    mediator.setList(this.rootList);
  }
  render() {
    return this.rootList.render();
  }
}

export { App };
