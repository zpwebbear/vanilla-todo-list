import "./style.css";
import { mountHtmlApp } from "./4-decomposed-render/mountHtmlApp.js";
import { mountMarkdownString } from "./4-decomposed-render/mountMarkdownString.js";
import { domRender } from "./4-decomposed-render/renders/dom.js";
import { markdownRender } from "./4-decomposed-render/renders/markdown.js";
import { App } from "./4-decomposed-render/App.js";

mountHtmlApp(domRender, App, { rootSelector: "#app" });
//mountMarkdownString(markdownRender, App, { rootSelector: "#app" });

