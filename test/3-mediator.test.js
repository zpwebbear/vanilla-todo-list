/**
 * Write tests for the Todo List implementation
 * based on the mediator pattern.
 * Implementation is stored in 3-mediator.js
 */

import { JSDOM } from "jsdom";
import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { List, TodoItem, InputItem, TodoListMediator } from "./../src/3-mediator.js";

describe("Mediator: Todo List functionality", () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><div id="app"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });
  it('Should create a new list with children', () => {
    const mediator = new TodoListMediator();
    const todoItem = new TodoItem(mediator, "test");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem, inputItem]);
    mediator.setList(list);
    assert.strictEqual(list.children.length, 2);
    assert.strictEqual(list.children[0].name, "test");
  });
  it('Should add an item to the list', () => {
    const mediator = new TodoListMediator();
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [inputItem]);
    mediator.setList(list);
    inputItem.onInputHandler("test");
    mediator.action(inputItem, "addItem");
    assert.strictEqual(list.children.length, 2);   
    assert.strictEqual(list.children[0].name, "test");
  });
  it('Should remove an item from the list', () => {
    const mediator = new TodoListMediator();
    const todoItem = new TodoItem(mediator, "test");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem, inputItem]);
    mediator.setList(list);
    mediator.action(todoItem, "removeItem");
    assert.strictEqual(list.children.length, 1);   
  });
  it('Should move an item up in the list', () => {
    const mediator = new TodoListMediator();
    const todoItem1 = new TodoItem(mediator, "test1");
    const todoItem2 = new TodoItem(mediator, "test2");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem1, todoItem2, inputItem]);
    mediator.setList(list);
    mediator.action(todoItem2, "moveUp");
    assert.strictEqual(list.children[0].name, "test2");
  });
  it('Should move an item down in the list', () => {
    const mediator = new TodoListMediator();
    const todoItem1 = new TodoItem(mediator, "test1");
    const todoItem2 = new TodoItem(mediator, "test2");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem1, todoItem2, inputItem]);
    mediator.setList(list);
    mediator.action(todoItem1, "moveDown");
    assert.strictEqual(list.children[0].name, "test2");
  });
  it('Should add a sublist to an item', () => {
    const mediator = new TodoListMediator();
    const todoItem = new TodoItem(mediator, "test");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem, inputItem]);
    mediator.setList(list);
    mediator.action(todoItem, "addSublist");
    assert.notStrictEqual(todoItem.list, null);
    assert.strictEqual(todoItem.list.children.length, 1);
  });
  it('Should remove a sublist from an item', () => {
    const mediator = new TodoListMediator();
    const todoItem = new TodoItem(mediator, "test");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem, inputItem]);
    mediator.setList(list);
    mediator.action(todoItem, "addSublist");
    mediator.action(todoItem, "removeSublist");
    assert.strictEqual(todoItem.list, null);
  });
});

describe("Mediator: Render functionality", () => {
  beforeEach(() => {
    const dom = new JSDOM(`<!DOCTYPE html><div id="app"></div>`);
    global.document = dom.window.document;
    global.window = dom.window;
  });
  it('Should dispatch a render event', () => {
    const mediator = new TodoListMediator();
    const todoItem = new TodoItem(mediator, "test");
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [todoItem, inputItem]);
    mediator.setList(list);
    mediator.dispatchRender();
    document.addEventListener("Render", () => {
      assert.ok(true);
    });
  });
  it("List addItem should be called on 'Add' button click", (t) => {
    const mediator = new TodoListMediator();
    const inputItem = new InputItem(mediator);
    const list = new List(mediator, [inputItem]);
    mediator.setList(list);

    const ul = list.render();
    t.mock.method(mediator, "addItem");
    ul.children[0].children[1].click();
    assert.strictEqual(mediator.addItem.mock.callCount(), 1);
    const call = mediator.addItem.mock.calls[0];
    assert.deepStrictEqual(call.arguments, [inputItem, undefined]);
  });
});
