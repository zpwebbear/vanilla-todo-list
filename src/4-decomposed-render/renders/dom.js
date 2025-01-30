const commonInterpreter = (tag) => {
  return (props) => {
    const element = document.createElement(tag);
    const { classList, innerText, innerHTML, onclick, oninput, value } = props ?? {};
    if (classList) {
      classList.forEach((className) => element.classList.add(className));
    }
    if (innerText) {
      element.innerText = innerText;
    }
    if (innerHTML) {
      element.innerHTML = innerHTML;
    }
    if (value) {
      element.value = value;
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

export const domRender = (node) => {
  const { tag, props, children = [] } = node;
  const interpretator = getInterpretator(tag);
  const el = interpretator(props);
  if (!el) return null;
  children.filter(Boolean).forEach((child) => {
    el.appendChild(domRender(child));
  });
  return el;
};
