import path from 'path';
import nodeExternals from 'webpack-node-externals';

const externals = [
  'firebase-admin',
  'firebase-functions'
];

module.exports = {
  target: 'node',
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    libraryTarget: 'this' // <-- Important
  },
  plugins: [
  ],
  resolve: {
    modules: ['node_modules'],
  },
  externals: [nodeExternals()] 
};
