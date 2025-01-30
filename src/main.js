import "./style.css";
//import { registerTodoList } from "./2-composite.js";
//import { registerTodoList } from "./3-mediator.js";
import { mountHtmlApp } from "./4-decomposed-render/mountHtmlApp.js";
import { htmlRender } from "./4-decomposed-render/renders/html.js";
import { App } from "./4-decomposed-render/App.js";

//registerTodoList("#app");
mountHtmlApp(htmlRender, App, {rootSelector: "#app"});
