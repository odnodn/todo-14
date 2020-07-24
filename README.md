![Banner](https://user-images.githubusercontent.com/19797697/88070955-3ad4e400-cbae-11ea-886a-d0c93c2eb092.gif)

<p align="center">A To Do web application similar to <a href="https://github.com/features/project-management">GitHub Project</a></p>

<h3 align="center">
  <a href="https://todo.woowahan.dev">https://todo.woowahan.dev</a>
</h3>

---

**To Do** software merely does simple jobs. We create tasks, receive alerts, and mark them complete. But crafting an interactive user interface and user experience is a different story. It could not be done without lots of careful thoughts. When it comes to the animation, it becomes much harder than before where all the elements move instantly without exposing any state changes. This project aims to create an elaborate UI and UX without compromising the features that essentially required by the guidelines.

## Event-driven

We use an approach somewhat analogous to the [Event-driven programming](https://en.wikipedia.org/wiki/Event-driven_programming). We have **zero class** and every script is independent and less dependent to each other. If they share the same functionalities or code blocks, we separate them as small, micro-serving functions to make them universal. Since we delegate the software hierarchy and data to the DOM tree, sometimes it could be more vulnerable, fragile, and we should give a much effort to security concerns. However, scripting following the flow of users using the program is more natural, and we think it is more like doing in a **vanilla** way.

## Design

### [Resource (Figma)](https://www.figma.com/file/MXVVUZmgoY4NPO2BO0nfLq/%EC%9A%B0%EC%95%84%ED%95%9C-%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84?node-id=60%3A0)

All the UI and UX were entirely designed by the maintainers of this project. All the designs included inside the link above are prototypal where the production version may not look the same as the initial design. Every pixel and color are tuned while developing.

### Dark Mode

In this project, we design and implement a dark mode. Dark mode is a trending alternative design along with the opposing light mode. We did this to leverage the power of **CSS** and **Sass**. They help us easily develop the color schemes(themes).

![color-scheme](https://user-images.githubusercontent.com/19797697/88361089-dc2c8780-cdb2-11ea-848c-71199be978a8.png)

> In this project we use CSS `var()` to modularize UI components and dynamically update the values at appropriate situation

### Animation

Animation and transition technologies inform easy concepts and unfortunately they don't provide any magical APIs that you might expected. **How** you can implement the animations or transitions is less important than **what** you want to make.

> Research the technology only after you come up with a thing you want to create.

It is best to have a great designer colleague if you don't have any sense of design. Truth to be told, we, developers don't have to be a designer.

## Database

### [Transaction](https://www.tutorialspoint.com/mysql/mysql-transactions)

In this project, cards and columns are implemented similar to linked-lists. When they are dragged and dropped somewhere, we must update the affected cards or columns' previous pointers. Since we did not implement the real-time sync yet, it could be easily broken by multiple users at the same time. So we use transaction to ensure that all linked operations are atomically completed. It guarantees that all the cards and columns are linked properly in any situation without a single dangling pointer. We've done a lot of e2e tests.

![linked-list](https://user-images.githubusercontent.com/19797697/88360969-793af080-cdb2-11ea-9fe9-33ffc8c58316.png)

## Other documentation

- [Features and Terms](https://github.com/woowa-techcamp-2020/todo-14/issues/2)
- [API](https://github.com/woowa-techcamp-2020/todo-14/issues/13)
- Drag and drop feature in this project was implemented without using the existing browser **Drag and Drop API**. For more information and tutorials, check out the [dedicated doc](./doc/Drag-and-Drop-with-Animation.md).

## Development

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Config

Copy and paste `src/config/index.example.ts` at the same directory, then rename it to `index.ts`. Fill with your database information.

> Currently we provide DB schema only with the [TypeScript declarations](https://github.com/woowa-techcamp-2020/todo-14/tree/main/src/types/schema). You have to manually migrate your own storage.

### npm scripts

Install dependencies

```zsh
% npm install
```

Run dev

```zsh
% npm run dev
```

Build production artifacts

```zsh
% npm run build
```

Start the application using built product

```zsh
% npm start
```

(Optional) Start with [PM2](https://pm2.keymetrics.io/)

```zsh
% npm run pm2:start
```

## License

MIT License

Copyright (c) 2020 [jhaemin](https://github.com/jhaemin), [dnacu](https://github.com/dnacu)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
