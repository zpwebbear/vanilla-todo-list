export const mountHtmlApp = (render, App, { rootSelector }) => {
  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(rootSelector);
    const app = new App();
    const nodeTree = app.render();
    const domTree = render(nodeTree);
    root.appendChild(domTree);
    document.addEventListener("Render", () => {
      const nodeTree = app.render();
      const domTree = render(nodeTree);
      root.replaceChildren(domTree);
    });
  });
};
