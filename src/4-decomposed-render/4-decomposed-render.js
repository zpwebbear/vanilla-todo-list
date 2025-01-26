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
    return {
      tag: "ul",
      children: this.children.map((item, index) => {
        const position = this.calculateChilPosition(index);
        return item.render({ position });
      }),
    };
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
  render(props) {
    return {
      tag: "li",
      children: [
        {
          tag: "input",
          props: {
            oninput: (e) => this.onInputHandler(e.target.value),
            classList: this.error ? ["error"] : [],
          },
        },
        {
          tag: "button",
          props: {
            innerText: "Add",
            onclick: () => this.addItem(),
          },
        },
      ],
    };
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
  render(props) {
    const renderUpButton =
      props.position !== "single" && props.position !== "start";
    const renderDownButton =
      props.position !== "single" && props.position !== "end";
    const renderAddSublistButton = this.list === null;
    const renderRemoveSublistButton = this.list !== null;
    const renderList = this.list !== null;

    return {
      tag: "li",
      children: [
        {
          tag: "span",
          props: {
            innerText: this.name,
          },
        },
        renderUpButton && {
          tag: "button",
          props: {
            innerHTML: "&uarr;",
            onclick: () => this.mediator.action(this, "moveUp"),
          },
        },
        renderDownButton && {
          tag: "button",
          props: {
            innerHTML: "&darr;",
            onclick: () => this.mediator.action(this, "moveDown"),
          },
        },
        renderAddSublistButton && {
          tag: "button",
          props: {
            innerText: "Add sublist",
            onclick: () => this.mediator.action(this, "addSublist"),
          },
        },
        renderRemoveSublistButton && {
          tag: "button",
          props: {
            innerText: "Remove sublist",
            onclick: () => this.mediator.action(this, "removeSublist"),
          },
        },
        {
          tag: "button",
          props: {
            innerText: "Remove",
            onclick: () => this.mediator.action(this, "removeItem"),
          },
        },
        renderList && this.list.render(),
      ],
    };
  }
}

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

const commonInterpreter = (tag) => {
  return (props) => {
    const element = document.createElement(tag);
    const { classList, innerText, innerHTML, onclick, oninput } = props ?? {};
    if (classList) {
      classList.forEach((className) => element.classList.add(className));
    }
    if (innerText) {
      element.innerText = innerText;
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    if (onclick) {
      element.addEventListener("click", onclick);
    }
    if (oninput) {
      element.addEventListener("input", oninput);
    }
    return element;
  };
};

const interpretators = {
  div: commonInterpreter("div"),
  ul: commonInterpreter("ul"),
  li: commonInterpreter("li"),
  span: commonInterpreter("span"),
  input: commonInterpreter("input"),
  button: commonInterpreter("button"),
};

const getInterpretator = (tag) => {
  return interpretators[tag] ?? ((props) => null);
};

const createDomTree = (element) => {
  const { tag, props, children = [] } = element;
  const interpretator = getInterpretator(tag);
  const el = interpretator(props);
  if (!el) return null;
  children.filter(Boolean).forEach((child) => {
    el.appendChild(createDomTree(child));
  });
  return el;
};

const registerTodoList = (App, rootSelector) => {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(rootSelector);
    const app = new App();
    const elementTree = app.render();
    const domTree = createDomTree(elementTree);
    root.appendChild(domTree);
    document.addEventListener("Render", () => {
      const elementTree = app.render();
      const domTree = createDomTree(elementTree);
      root.replaceChildren(domTree);
    });
  });
};

export { registerTodoList, App, TodoListMediator, List, InputItem, TodoItem };
