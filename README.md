# YouTube Party

YouTube Party is a real-time web application allowing multiple users to watch YouTube videos together with the playback synchronised across all the users' devices.

## Project Overview

The repository is a monorepo powered by [Yarn workspaces](https://yarnpkg.com/features/workspaces). _(Which means that you need [yarn](https://yarnpkg.com) to develop this project)_ 

All the sub-packages are stored inside the `packages` folder. As of now, the project structure looks like this:

```
- root
  - packages
    - client (Client-side web app)
    - common (Common interfaces and types)
    - server (Server-side web app)
```

The client-side web app is a [SolidJS](https://www.solidjs.com) client built with [Vite](https://vitejs.dev). The server-side web app is a [Fastify](https://www.fastify.io) [Node](https://nodejs.dev) app built with [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html). The common package exposes interfaces and types which are used by both the client and the server.

The entire project is built with TypeScript and follows the [Google Typescript Style Guide](https://google.github.io/styleguide/tsguide.html) enforced with the [gts](https://www.npmjs.com/package/gts) npm module.
