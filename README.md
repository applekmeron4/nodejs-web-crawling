# nodejs-web-crawling

Node.js Boilerplate with Babel and Webpack
---

> Node.js Boilerplate Package

### Usage

* Install the local packages using `npm install` or `yarn install`
* Run using `npm run dev`
  * It starts webpack to package the app.js
  * Build with webpack `webpack --config webpack.config.babel.js` 
  * Then it starts both:
       * `webpack --watch` to check for any source changes and rebuild the package.
       * `nodemon` to grab any js changes and restart the Node app.

* Build using `npm run build`
* Start the built Process `npm start`
