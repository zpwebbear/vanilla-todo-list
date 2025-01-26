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

export { InputItem };
