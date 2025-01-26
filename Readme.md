# This is an educational project that was inspired by course "Node.js Patterns 2024" by Timur Shemsedinov.

Here you can see an implementation of the client side Todo List that is written without any additional libraries or frameworks (except libraries for testing purposes and linting).

Implementation is simple and straightforward. It can be ehcnaced with additional features and styles but it still bound to the initial idea of Todo List and cannot be considered as an example of the framework or library usage.

The main idea is to show usage of the programming patterns in the wild.

## Composite pattern

The main pattern that is used in the project is the Composite pattern. It is used to create a tree-like structure of the Todo List. The tree is used to store the tasks and subtasks. The tree is used to render the tasks and subtasks in the DOM.

Implementation of the Composite pattern is located in the `src/2-composite.js` file.

## Mediator pattern

The Mediator pattern is used to decouple the components of the Todo List. The Mediator pattern is used to handle the communication between the components. The Mediator pattern is used to handle the events that are triggered by the components. 

It could be consireded as some kind of state management regarding to the terminology of the modern frontend development.

Implementation of the Mediator pattern is located in the `src/3-mediator.js` file.

## Usage

Just install dependencies and run the project:

```bash
npm install
npm run dev
```

To change the implementation please change import in the `main.js` file.
