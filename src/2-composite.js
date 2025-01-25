class DocumentRender {
  dispatchRender() {
    document.dispatchEvent(new Event("Render"));
  }
}

class List extends DocumentRender {
  children = [];
  constructor(children = []) {
    super();
    children.forEach((Child) => {
      this.children.push(new Child(this));
    });
  }
  render() {
    const ul = document.createElement("ul");
    const childrenCount = this.children.length;
    this.children.forEach((item, index) => {
      const position = this.calculateChildPosition(index);
      ul.appendChild(item.render(position));
    });
    return ul;
  }
  calculateChildPosition(index) {
    const childrenCount = this.children.length;
    // 2 because we always have a last element with input;
    let position = childrenCount === 2 ? "single" : "middle";
    if (position !== "single") {
      if (index === 0) position = "start";
      // 2 because we always have a last element with input;
      if (index === childrenCount - 2) position = "end";
    }
    return position;
  }
  remove(element) {
    const index = this.children.findIndex((item) => item === element);
    this.children.splice(index, 1);
    this.dispatchRender();
  }
  moveUp(element) {
    const index = this.children.findIndex((item) => item === element);
    const [item] = this.children.splice(index, 1);
    const place = index - 1;
    this.children.splice(place, 0, item);
    this.dispatchRender();
  }
  moveDown(element) {
    const index = this.children.findIndex((item) => item === element);
    const [item] = this.children.splice(index, 1);
    const place = index + 1;
    this.children.splice(place, 0, item);
    this.dispatchRender();
  }
  addItem(name) {
    const item = new TodoItem(this, name);
    const place = this.children.length - 1;
    this.children.splice(place, 0, item);
    this.dispatchRender();
  }
}

class InputItem extends DocumentRender {
  index = Infinity;
  parent = null;
  name = "";
  constructor(parent) {
    super();
    this.parent = parent;
  }
  onInputHandler(name) {
    this.name = name;
  }
  addItem() {
    this.parent.addItem(this.name);
    this.name = "";
  }
  addFakeItem() {
    this.parent.addFakeItem();
  }
  render() {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.addEventListener("input", (e) => this.onInputHandler(e.target.value));
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

class TodoItem extends DocumentRender {
  parent = null;
  list = null;
  name = null;
  constructor(parent, name) {
    super();
    this.parent = parent;
    this.name = name;
  }
  addSublist() {
    if (this.list !== null) return;
    this.list = new List([InputItem]);
    this.dispatchRender();
  }
  removeSublist() {
    this.list = null;
    this.dispatchRender();
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
        buttonUp.addEventListener("click", () => this.parent.moveUp(this));
        renderList.push(buttonUp);
      }

      // BUTTON DOWN
      if (position !== "end") {
        const buttonDown = document.createElement("button");
        buttonDown.innerHTML = "&darr;";
        buttonDown.addEventListener("click", () => this.parent.moveDown(this));
        renderList.push(buttonDown);
      }
    }

    // BUTTON ADD SUBLIST
    if (this.list === null) {
      const buttonAddSublist = document.createElement("button");
      buttonAddSublist.innerText = "Add sublist";
      buttonAddSublist.addEventListener("click", () => this.addSublist());
      renderList.push(buttonAddSublist);
    }

    // BUTTON REMOVE SUBLIST
    if (this.list !== null) {
      const buttonRemoveSublist = document.createElement("button");
      buttonRemoveSublist.innerText = "Remove sublist";
      buttonRemoveSublist.addEventListener("click", () => this.removeSublist());
      renderList.push(buttonRemoveSublist);
    }

    // BUTTON REMOVE
    const buttonRemove = document.createElement("button");
    buttonRemove.innerText = "Remove";
    buttonRemove.addEventListener("click", () => this.parent.remove(this));
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

const children = [InputItem];
const list = new List(children);

const registerTodoList = (rootSelector) => {
  document.addEventListener("DOMContentLoaded", (e) => {
    console.log("DOMContentLoaded", e);
    const root = document.querySelector(rootSelector);
    root.appendChild(list.render());

    document.addEventListener("Render", () => {
      root.replaceChildren(list.render());
    });
  });
};

export { registerTodoList };
