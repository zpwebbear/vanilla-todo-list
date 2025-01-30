export const mountMarkdownString = (render, App, { rootSelector }) => {
  const root = document.querySelector(rootSelector);
  const app = new App();
  const nodeTree = app.render();
  const markdownString = render(nodeTree);
  const pre = document.createElement("pre");
  pre.innerText = markdownString;
  root.appendChild(pre);
};
