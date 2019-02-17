const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  MiniCssExtractPlugin = require("mini-css-extract-plugin"),
  PrettierPlugin = require("prettier-webpack-plugin"),
  webpack = require("webpack");

const sass = {
  test: /\.(sass|scss)$/,
  include: path.resolve("src"),
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {}
    },

    {
      loader: "css-loader",
      options: {
        sourceMap: true,
        url: false
      }
    },

    {
      loader: "postcss-loader",
      options: {
        ident: "postcss",
        sourceMap: true,
        plugins: [
          require("cssnano")({
            preset: ["default", { discardComments: { removeAll: true } }]
          }),

          require("autoprefixer")({
            cascade: false,
            browsers: ["last 4 version", "IE >= 8"]
          })
        ]
      }
    },

    {
      loader: "sass-loader",
      options: { sourceMap: true }
    }
  ]
};

const pug = {
  test: /\.pug$/,
  use: ["html-loader?attrs=false", "pug-html-loader"]
};

const js = {
  test: /\.js$/,
  loader: "babel-loader"
};

const config = {
  entry: ["./src/dev/main.js", "./src/dev/style.sass"],
  output: {
    path: path.resolve("docs/dev"),
    filename: "[name].min.js"
  },

  devServer: {
    disableHostCheck: true,
    overlay: true
  },

  module: { rules: [pug, sass, js] },
  plugins: [
    new PrettierPlugin({
      printWidth: 90,
      tabWidth: 2,
      useTabs: true,
      semi: true,
      encoding: "utf-8",
      extensions: [".js"],
      trailingComma: "all",
      arrowParens: "always"
    }),

    new MiniCssExtractPlugin({
      filename: "style.min.css"
    }),

    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/dev/index.pug",
      inject: false
    })
  ]
};

module.exports = (env, options) => {
  const isProd = options.mode === "production";

  config.devtool = isProd ? false : "cheap-module-eval-source-map";

  config.plugins.push(
    new webpack.DefinePlugin({ PROD_MODE: JSON.stringify(isProd) })
  );

  return config;
};
