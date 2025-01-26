import { TodoItem } from "./TodoItem.js";
import { List } from "./List.js";
import { InputItem } from "./InputItem.js";

class TodoListMediator {
  list = null;
  constructor() {}
  setList(list) {
    this.list = list;
  }
  action(sender, action, payload) {
    this[action](sender, payload);
  }
  addItem(sender) {
    const { name } = sender;
    if (name === "") {
      sender.setError(true);
      this.dispatchRender();
      return;
    }
    sender.setError(false);
    const item = new TodoItem(this, name);
    const place = this.list.todoItemsCount;
    this.list.insertItemByIndex(place, item);
    this.dispatchRender();
  }
  removeItem(item) {
    const index = this.list.getItemIndex(item);
    this.list.removeItemByIndex(index);
    this.dispatchRender();
  }
  moveUp(item) {
    const index = this.list.getItemIndex(item);
    this.move(item, index, index - 1);
    this.dispatchRender();
  }
  moveDown(item) {
    const index = this.list.getItemIndex(item);
    this.move(item, index, index + 1);
    this.dispatchRender();
  }
  move(item, fromIndex, toIndex) {
    this.list.removeItemByIndex(fromIndex);
    this.list.insertItemByIndex(toIndex, item);
  }
  addSublist(item) {
    const mediator = new TodoListMediator();
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [inputItem]);
    mediator.setList(list);
    item.list = list;
    this.dispatchRender();
  }
  removeSublist(item) {
    item.list = null;
    this.dispatchRender();
  }
  dispatchRender() {
    document.dispatchEvent(new window.Event("Render"));
  }
}

export { TodoListMediator };
