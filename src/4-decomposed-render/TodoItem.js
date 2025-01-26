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

export { TodoItem };
