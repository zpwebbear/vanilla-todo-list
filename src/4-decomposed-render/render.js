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

const registerApp = (App, rootSelector) => {
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

export { registerApp };
