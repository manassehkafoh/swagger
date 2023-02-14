# SwaggerEditor

SwaggerEditor is using **forked** Create React App as it's building infrastructure.

## Table of Contents

- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setting up](#setting-up)
  - [npm scripts](#npm-scripts)
  - [Build artifacts](#build-artifacts)
  - [Package mapping](#package-mapping)
- [Documentation](#documentation)
- [Docker](#docker)
- [License](#license)

## Getting started

### Prerequisites

These prerequisites are required both for installing SwaggerEditor as a npm package and local development setup.

- [node-gyp](https://www.npmjs.com/package/node-gyp) with [Python 3.x](https://www.python.org/downloads/)
- [GLIBC](https://www.gnu.org/software/libc/) `>=2.29`
- [emscripten](https://emscripten.org/docs/getting_started/downloads.html) or [docker](https://www.docker.com/) needs to be installed, we recommend going with a docker option


### Installation

Assuming [prerequisites](#prerequisites) are already installed, SwaggerEditor npm package is installable and works with `Node.js >= 12.22.0`.
SwaggerEditor npm package is currently hosted on [GitHub packages registry](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).

You can authenticate to GitHub Packages with npm by either editing your per-user *~/.npmrc*
file to include your personal access token (classic) or by logging in to npm on the command line using your username and personal access token.

To authenticate by adding your personal access token (classic) to your *~/.npmrc* file,
edit the *~/.npmrc* file for your project to include the following line,
replacing TOKEN with your personal access token. Create a new *~/.npmrc* file if one doesn't exist.
You can find more information about authenticating to GitHub Packages in [GitHub documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

Last step is to include a line to the *.npmrc* file, specifying GitHub Packages URL and the namespace *(@swagger-api)* where the package is hosted.

```
@swagger-api:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=TOKEN
```

You can now install SwaggerEditor package using `npm`:

```sh
 $ npm install @swagger-api/swagger-editor
````

For more information about installing npm packages from GitHub packages registry please visit [Installing a package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)
section in GitHub documentation.

### Usage

Install the package:

```sh
 $ npm install @swagger-api/swagger-editor
````

Use the package in you application:

**index.js**:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SwaggerEditor from '@swagger-api/swagger-editor';
import '@swagger-api/swagger-editor/swagger-editor.css';

const url = "https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml";

const MyApp = () => (
  <div>
    <h1>SwaggerEditor Integration</h1>
    <SwaggerEditor url={url} />
  </div>
);

self.MonacoEnvironment = {
  /**
   * We're building into the dist/ folder. When application starts on
   * URL=https://example.com then SwaggerEditor will look for
   * `apidom.worker.js` on https://example.com/dist/apidom.worker.js and
   * `editor.worker` on https://example.com/dist/editor.worker.js.
   */
  baseUrl: `${document.baseURI || location.href}dist/`,
}

ReactDOM.render(<MyApp />, document.getElementById('swagger-editor'));
```

**webpack.config.js** (webpack@5)

Install dependencies needed for webpack@5 to properly build SwaggerEditor.

```sh
 $ npm i stream-browserify --save-dev
 $ npm i process --save-dev
 $ npm i https-browserify --save-dev
 $ npm i stream-http --save-dev
 $ npm i util --save-dev
```

```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
    'apidom.worker': '@swagger-api/swagger-editor/apidom.worker',
    'editor.worker': '@swagger-api/swagger-editor/editor.worker',
  },
  output: {
    globalObject: 'self',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      http: require.resolve('stream-http'), // required for asyncapi parser
      https: require.resolve('https-browserify'), // required for asyncapi parser
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      zlib: false,
    },
    alias: {
      // This alias doesn't pull any languages into bundles and works as monaco-editor-core was installed
      'monaco-editor$': 'monaco-editor/esm/vs/editor/edcore.main.js',
      // This alias make sure we don't pull two different versions of monaco-editor
      'monaco-editor': '/node_modules/monaco-editor',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      /**
       * The default way in which webpack loads wasm files won’t work in a worker,
       * so we will have to disable webpack’s default handling of wasm files and
       * then fetch the wasm file by using the file path that we get using file-loader.
       *
       * Resource: https://pspdfkit.com/blog/2020/webassembly-in-a-web-worker/
       *
       * Alternatively, WASM file can be bundled directly into JavaScript bundle as data URLs.
       * This configuration reduces the complexity of WASM file loading
       * but increases the overal bundle size:
       *
       * {
       *   test: /\.wasm$/,
       *   type: 'asset/inline',
       * }
       */
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto', // this disables webpacks default handling of wasm
      },
    ]
  }
};
```

Alternative **webpack.config.js** (webpack@5)

We've already built Web Workers fragments for you, and they're located inside our npm distribution
package in `dist/umd/` directory. In order to avoid complexity of building the Web Worker fragments you can
use those fragments directly. This setup will work both for **production** and **development** (webpack-dev-server)
and will significantly shorten your build process.

Install `copy-webpack-plugin` and other needed dependencies.

```sh
 $ npm i copy-webpack-plugin --save-dev
 $ npm i stream-browserify --save-dev
 $ npm i process --save-dev
 $ npm i https-browserify --save-dev
 $ npm i stream-http --save-dev
 $ npm i util --save-dev
```

```js
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    app: './index.js',
  },
  output: {
    globalObject: 'self',
    filename: 'static/js/[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      http: require.resolve('stream-http'), // required for asyncapi parser
      https: require.resolve('https-browserify'), // required for asyncapi parser
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util'),
      zlib: false,
    },
    alias: {
      // This alias doesn't pull any languages into bundles and works as monaco-editor-core was installed
      'monaco-editor$': 'monaco-editor/esm/vs/editor/edcore.main.js',
      // This alias make sure we don't pull two different versions of monaco-editor
      'monaco-editor': '/node_modules/monaco-editor',
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'node_modules/@swagger-api/swagger-editor/dist/umd/apidom.worker.js',
          to: 'static/js',
        },
        {
          from: 'node_modules/@swagger-api/swagger-editor/dist/umd/editor.worker.js',
          to: 'static/js',
        }
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
```

## Development

### Prerequisites

Assuming [prerequisites](#prerequisites) are already installed, [Node.js](https://nodejs.org/) `>=16.13.0` and `npm >=8.1.0`
are the minimum required versions that this repo runs on, but we recommend using the latest version of Node.js@16

### Setting up

If you use [nvm](https://github.com/nvm-sh/nvm), running following command inside this repository
will automatically pick the right Node.js version for you:

```sh
 $ nvm use
```

This repository is using npm packages from [https://www.npmjs.com/](npmjs.com) and [GitHub packages registry](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).
To successfully install npm packages that SwaggerEditor requires, you need to [Authenticate to GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

You can authenticate to GitHub Packages with npm by either editing your per-user *~/.npmrc*
file to include your personal access token (classic) or by logging in to npm on the command line using your username and personal access token.

To authenticate by adding your personal access token (classic) to your *~/.npmrc* file,
edit the *~/.npmrc* file for your project to include the following line,
replacing TOKEN with your personal access token. Create a new *~/.npmrc* file if one doesn't exist.
You can find more information about authenticating to GitHub Packages in [GitHub documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-to-github-packages).

```
//npm.pkg.github.com/:_authToken=TOKEN
```


Alternatively, to authenticate by logging in to npm, use the `npm login` command,
replacing USERNAME with your GitHub username, TOKEN with your personal access token (classic),
and PUBLIC-EMAIL-ADDRESS with your email address.

```sh
$ npm login --scope=@swagger-api --registry=https://npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC-EMAIL-ADDRESS
```

Run the following commands to set up the repository for local development:

```sh
 $ git clone https://github.com/swagger-api/swagger-editor.git
 $ cd swagger-editor
 $ git checkout next
 $ git submodule init
 $ git submodule update
 $ npm i
 $ npm start
```

### npm scripts

**Lint**

```sh
 $ npm run lint
```

**Runs unit and integration tests**

```sh
 $ npm test
```

**Runs E2E Cypress tests**

Usage in **development** environment:

```sh
 $ npm run cy:dev
```

Usage in **Continuos Integration (CI)** environment:

```sh
 $ npm run cy:ci
```

**Build**

```sh
 $ npm run build
````

This script will build all the SwaggerEditor build artifacts - `app`, `esm` and `umd`.

### Build artifacts

After building artifacts, every two new directories will be created: `build/` and `dist/`.

**build/**

```sh
$ npm run build:app
$ npm run build:app:serve
```

Builds and serves standalone SwaggerEditor application and all it's assets on `http://localhost:3050/`.

**dist/esm/**

```sh
$ npm run build:bundle:esm
```

This bundle is suited for consumption by 3rd parties,
which want to use SwaggerEditor as a library in their own applications and have their own build process.

**dist/umd/**

```sh
$ npm run build:bundle:umd
```

SwaggerEditor UMD bundle exports SwaggerEditor symbol on global object.
It's bundled with React defined as external. This allows consumer to use his own version of React + ReactDOM and mount SwaggerEditor lazily.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta
    name="description"
    content="SwaggerEditor"
  />
  <title>SwaggerEditor</title>
  <link rel="stylesheet" href="./swagger-editor.css" />
</head>
<body>
  <div id="swagger-editor"></div>
  <script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
  <script src="./dist/umd/swagger-editor.js"></script>
  <script>
    const props = {
      url: 'https://raw.githubusercontent.com/asyncapi/spec/v2.2.0/examples/streetlights-kafka.yml',
    };
    const element = React.createElement(SwaggerEditor, props);
    const domContainer = document.querySelector('#swagger-editor');

    ReactDOM.render(element, domContainer);
  </script>
</body>
</html>
```

**npm**

SwaggerEditor is released as `@swagger-api/swagger-editor` npm package on [GitHub packages registry](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).
Package can also be produced manually by running following commands (assuming you're already followed [setting up](#setting-up) steps):

```sh
 $ npm run build:bundle:esm
 $ npm run build:bundle:umd
 $ npm pack
```

### Package mapping

SwaggerEditor maps its [build artifacts](#build-artifacts) in `package.json` file in following way:

```json
"unpkg": "./dist/umd/swagger-editor.js",
"module": "./dist/esm/swagger-editor.js",
"browser": "./dist/esm/swagger-editor.js",
"jsnext:main": "./dist/esm/swagger-editor.js",
"exports": {
  "./package.json": "./package.json",
  "./swagger-editor.css": "./dist/esm/swagger-editor.css",
  ".": {
    "browser": "./dist/esm/swagger-editor.js"
  },
  "./apidom.worker": {
    "browser": "./dist/esm/apidom.worker.js"
  },
  "./editor.worker": {
    "browser": "./dist/esm/editor.worker.js"
  }
}
```

To learn more about these fields please refer to [webpack mainFields documentation](https://webpack.js.org/configuration/resolve/#resolvemainfields)
or to [Node.js Modules: Packages documentation](https://nodejs.org/docs/latest-v16.x/api/packages.html).

## Documentation

### Customization

- [Plug points](./docs/customization/plug-points/README.md)

### Environment Variables

It is possible to use an environment variable to specify a local JSON/YAML file or a remote URL for SwaggerEditor to load on startup.
These environment variables will get baked in during build time into build artifacts.

Environment variables currently available:

| Variable name               |                                                Description                                                 |
|-----------------------------|:----------------------------------------------------------------------------------------------------------:|
 | `REACT_APP_DEFINITION_FILE` | Specifies a local file path, and the specified file must also be present in the `/public/static` directory |
 | `REACT_APP_DEFINITION_URL`  | Specifies a remote URL. This environment variable currently takes precedence over `REACT_APP_SWAGGER_FILE` |
| `REACT_APP_VERSION`         |              Specifies the version of this app. The version is read from `package.json` file.              |

Sample environment variable values can be found in `.env` file. For more information about using
environment variables, please refer to [adding Custom Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
section of Create React App documentation.

### Using preview plugins in SwaggerUI

SwaggerEditor comes with number of `preview` plugins that are responsible for rendering
the definition that's being created in the editor. These plugins include:

- **EditorPreviewAsyncAPIPlugin** - AsyncAPI specification rendering support
- **EditorPreviewAPIDesignSystemsPlugin** - API Design Systems rendering support

With a bit of adapting, we can use these plugins with SwaggerUI to provide ability
to render AsyncAPI or API Design Systems definitions with SwaggerUI.

```js
import React from 'react';
import ReactDOM from 'react-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import SwaggerEditor from '@swagger-api/swagger-editor';

const plugins = [
  SwaggerEditor.plugins.EditorContentType,
  SwaggerEditor.plugins.EditorPreviewAsyncAPI,
  SwaggerEditor.plugins.EditorPreviewAPIDesignSystems,
  SwaggerEditor.plugins.SwaggerUIAdapter,
];

ReactDOM.render(
  <SwaggerUI
    plugins={plugins}
    url="https://raw.githubusercontent.com/asyncapi/spec/v2.4.0/examples/streetlights-kafka.yml"
  />,
  document.getElementById('swagger-ui')
);
```

The key here is `SwaggerUIAdapter` plugin which adapts SwaggerEditor plugins to use
directly with SwaggerUI.

## Docker

### Pre-built DockerHub image

SwaggerEditor is available as a pre-built docker image hosted on [DockerHub](https://hub.docker.com/r/swaggerapi/swagger-editor/tags?page=1&name=next-v5).

```sh
$ docker pull swaggerapi/swagger-editor:next-v5
$ docker run -d -p 8080:80 swaggerapi/swagger-editor:next-v5
```

### Building locally

**Privileged image**:

```sh
 $ npm run build:app
 $ docker build . -t swaggerapi/swagger-editor:next-v5
 $ docker run -d -p 8080:80 swaggerapi/swagger-editor:next-v5
```

Now open your browser at `http://localhost:8080/`.

**Unprivileged image**:

```sh
 $ npm run build:app
 $ docker build . -f Dockerfile.unprivileged -t swaggerapi/swagger-editor:next-v5-unprivileged
 $ docker run -d -p 8080:8080 swaggerapi/swagger-editor:next-v5-unprivileged
```

Now open your browser at `http://localhost:8080/`.


> **No** custom environment variables are currently supported by SwaggerEditor.

## License

SwaggerEditor is licensed under [Apache 2.0 license](https://github.com/swagger-api/swagger-editor/blob/next/LICENSES/Apache-2.0.txt).
SwaggerEditor comes with an explicit [NOTICE](https://github.com/swagger-api/apidom/blob/next/NOTICE) file
containing additional legal notifications and information.

This project uses [REUSE specification](https://reuse.software/spec/) that defines a standardized method
for declaring copyright and licensing for software projects.
