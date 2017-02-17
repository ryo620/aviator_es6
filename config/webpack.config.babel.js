import webpack from 'webpack';
import path from 'path';
const current = process.cwd();

module.exports = {

  entry: {
    'index':   './app/develop/js/index.js',
  },

  output: {
    path: './app/public/assets/js',
    filename: 'bundle.js'
  },

  resolve: {
    root: [
      path.join(current, 'app/develop/js/'),
      path.join(current, 'app/develop/js/lib/')
    ]
  },

  module: {

    loaders: [
      {
        test: /pixi.js/,
        loader: 'transform?brfs'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },

  plugins: [
//    new webpack.optimize.UglifyJsPlugin({
//      compress: {
//        warnings: false
//      }
//    })
  ]
};
