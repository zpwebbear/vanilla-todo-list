const divInterpreter = (props) => {
  return "\n\n";
};

const pInterpreter = (props) => {
  return "\n\n";
};

const ulInterpreter = (props) => {
  return "\n\n";
};

const liInterpreter = (props) => {
  return "\n* " + (props?.innerText ?? "");
};

const spanInterpreter = (props) => {
  return props?.innerText ?? "";
};

const inputInterpreter = (props) => {
  return "";
};

const buttonInterpreter = (props) => {
  return props?.innerText ?? "";
};

const interpretators = {
  div: divInterpreter,
  p: pInterpreter,
  ul: ulInterpreter,
  li: liInterpreter,
  span: spanInterpreter,
  input: inputInterpreter,
  button: buttonInterpreter,
};

const getInterpretator = (tag) => {
  return interpretators[tag] ?? ((props) => null);
};

export const markdownRender = (node) => {
  let markdown = "";
  const { tag, props, children = [] } = node;
  const interpretator = getInterpretator(tag);
  const r = interpretator(props);
  markdown += r;
  children.filter(Boolean).forEach((child) => {
    markdown += markdownRender(child);
  });
  return markdown;
};
