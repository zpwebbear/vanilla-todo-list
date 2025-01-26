import { List } from "./List.js";
import { InputItem } from "./InputItem.js";
import { TodoListMediator } from "./TodoListMediator.js";

class App {
  constructor() {
    const mediator = new TodoListMediator();
    const inputItem = new InputItem(mediator);
    const children = [inputItem];
    this.rootList = new List(mediator, children);
    mediator.setList(this.rootList);
  }
  render() {
    return this.rootList.render();
  }
}

export { App };
