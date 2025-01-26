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

export { List };
