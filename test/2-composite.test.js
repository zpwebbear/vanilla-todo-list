/**
 * Write tests for the Todo List implementation
 * based on the composite pattern.
 * Implementation is stored in 2-composite.js
 */

import { JSDOM } from "jsdom";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { List, TodoItem, InputItem } from "./../src/2-composite.js";

describe("Todo List", () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><div id="app"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  it("List should accept children in constructor", () => {
    const list = new List([InputItem]);
    assert.strictEqual(list.children.length, 1);
  });

  it("List should add an item with proper name", () => {
    const list = new List([InputItem]);
    list.addItem("test");
    assert.strictEqual(list.children.length, 2);
    assert.strictEqual(list.children[0].name, "test");
  });

  it("List should move an item up", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    list.moveUp(list.children[1]);
    assert.strictEqual(list.children[0].name, "test2");
  });

  it("List should move an item down", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    list.moveDown(list.children[0]);
    assert.strictEqual(list.children[0].name, "test2");
  });

  it("List should remove an item", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    list.remove(list.children[0]);
    assert.strictEqual(list.children.length, 2);
    assert.strictEqual(list.children[0].name, "test2");
  });

});

describe("Render", () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><div id="app"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  it("List should render all children", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    const ul = list.render();
    assert.strictEqual(ul.children.length, 3);
    assert.strictEqual(ul.children[0].children[0].innerText, "test1");
    assert.strictEqual(ul.children[1].children[0].innerText, "test2");
  });

  it("Single TodoItem in the list should be rendered without up and down arrow buttons", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    const ul = list.render();
    assert.strictEqual(ul.children[0].children[1].innerText, "Add sublist");
  });

  it("First TodoItem in the list should be rendered only with down arrow button", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    const ul = list.render();
    assert.strictEqual(ul.children[0].children[1].innerHTML, "↓");
  });

  it("Last TodoItem in the list should should be rendered only with up arrow button", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    const ul = list.render();
    assert.strictEqual(ul.children[1].children[1].innerHTML, "↑");
  });

  it("Middle TodoItem in the list should should be rendered with up and down buttons", () => {
    const list = new List([InputItem]);
    list.addItem("test1");
    list.addItem("test2");
    list.addItem("test3");
    const ul = list.render();
    assert.strictEqual(ul.children[1].children[1].innerHTML, "↑");
    assert.strictEqual(ul.children[1].children[2].innerHTML, "↓");
  });
});

describe("Todo Item", () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><div id="app"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });

  it("TodoItem should have a proper name", () => {
    const item = new TodoItem(null, "test");
    assert.strictEqual(item.name, "test");
  });

});
