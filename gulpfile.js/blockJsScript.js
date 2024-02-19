const { src, dest } = require('gulp');
const named = require('vinyl-named');
const webpack = require('webpack-stream');
const livereload = require('gulp-livereload');
const compiler = require('webpack');

const blockJsScript = (sources, block, dev = false) => {
  const srcArray = sources.constructor === Array ? sources : [sources];

  return src(srcArray)
    .pipe(named())
    .pipe(
      webpack(
        {
          devtool: dev ? 'eval-cheap-module-source-map' : 'source-map',
          mode: dev ? 'development' : 'production',
          output: {
            filename: dev ? `${block}/[name].js` : `${block}/[name].min.js`,
          },
          module: {
            rules: [
              {
                test: /\.js$/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                      [
                        '@babel/plugin-transform-react-jsx',
                        {
                          pragma: 'h',
                          pragmaFrag: 'Fragment',
                        },
                      ],
                    ],
                  },
                },
                exclude: /node_modules/,
              },
              {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
              },
            ],
          },
          resolve: {
            alias: {
              react: 'preact/compat',
              'react-dom/test-utils': 'preact/test-utils',
              'react-dom': 'preact/compat', // Must be below test-utils
              'react/jsx-runtime': 'preact/jsx-runtime',
            },
          },
        },
        compiler
      )
    )
    .pipe(dest('dist/'))
    .pipe(livereload());
};

module.exports = blockJsScript;
