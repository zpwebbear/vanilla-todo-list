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

class List {
  children = [];
  mediator = null;
  constructor(mediator, children = []) {
    this.mediator = mediator;
    this.children = children;
  }
  get todoItemsCount() {
    return this.children.length - 1;
  }
  getItemIndex(item) {
    return this.children.findIndex((child) => child === item);
  }
  removeItemByIndex(index) {
    this.children.splice(index, 1);
  }
  insertItemByIndex(index, item) {
    this.children.splice(index, 0, item);
  }
  render() {
    const ul = document.createElement("ul");
    this.children.forEach((item, index) => {
      const position = this.calculateChilPosition(index);
      ul.appendChild(item.render(position));
    });
    return ul;
  }
  calculateChilPosition(index) {
    const todoItemsCount = this.todoItemsCount;
    let position = todoItemsCount === 1 ? "single" : "middle";
    if (position !== "single") {
      if (index === 0) position = "start";
      if (index === todoItemsCount - 1) position = "end";
    }
    return position;
  }
}

class InputItem {
  index = Infinity;
  mediator = null;
  name = "";
  error = false;
  constructor(mediator) {
    this.mediator = mediator;
  }
  setError(error) {
    this.error = error;
  }
  onInputHandler(name) {
    this.name = name;
  }
  addItem() {
    this.mediator.action(this, "addItem");
    this.name = "";
  }
  render() {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.addEventListener("input", (e) => this.onInputHandler(e.target.value));
    if (this.error) {
      input.classList.add("error");
    }
    const button = document.createElement("button");
    button.innerText = "Add";
    button.addEventListener("click", () => this.addItem());

    const renderList = [input, button];
    renderList.forEach((el) => {
      li.appendChild(el);
    });
    return li;
  }
}

class TodoItem {
  mediator = null;
  list = null;
  name = null;
  constructor(mediator, name) {
    this.mediator = mediator;
    this.name = name;
  }
  render(position) {
    const li = document.createElement("li");
    const renderList = [];
    // TEXT
    const span = document.createElement("span");
    span.innerText = this.name;
    renderList.push(span);

    if (position !== "single") {
      // BUTTON UP
      if (position !== "start") {
        const buttonUp = document.createElement("button");
        buttonUp.innerHTML = "&uarr;";
        buttonUp.addEventListener("click", () =>
          this.mediator.action(this, "moveUp")
        );
        renderList.push(buttonUp);
      }

      // BUTTON DOWN
      if (position !== "end") {
        const buttonDown = document.createElement("button");
        buttonDown.innerHTML = "&darr;";
        buttonDown.addEventListener("click", () =>
          this.mediator.action(this, "moveDown")
        );
        renderList.push(buttonDown);
      }
    }

    // BUTTON ADD SUBLIST
    if (this.list === null) {
      const buttonAddSublist = document.createElement("button");
      buttonAddSublist.innerText = "Add sublist";
      buttonAddSublist.addEventListener("click", () =>
        this.mediator.action(this, "addSublist")
      );
      renderList.push(buttonAddSublist);
    }

    // BUTTON REMOVE SUBLIST
    if (this.list !== null) {
      const buttonRemoveSublist = document.createElement("button");
      buttonRemoveSublist.innerText = "Remove sublist";
      buttonRemoveSublist.addEventListener("click", () =>
        this.mediator.action(this, "removeSublist")
      );
      renderList.push(buttonRemoveSublist);
    }

    // BUTTON REMOVE
    const buttonRemove = document.createElement("button");
    buttonRemove.innerText = "Remove";
    buttonRemove.addEventListener("click", () =>
      this.mediator.action(this, "removeItem")
    );
    renderList.push(buttonRemove);

    // SUBLIST
    if (this.list !== null) {
      renderList.push(this.list.render());
    }

    // COMPOSE COMPONENT
    renderList.forEach((item) => {
      li.appendChild(item);
    });
    return li;
  }
}

const registerTodoList = (rootSelector) => {
  const mediator = new TodoListMediator();
  const children = [InputItem];
  const list = new List(mediator, children);
  mediator.setList(list);
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(rootSelector);
    root.appendChild(list.render());
    document.addEventListener("Render", () => {
      root.replaceChildren(list.render());
    });
  });
};

export { registerTodoList, TodoListMediator, List, InputItem, TodoItem };
