const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  const config = {
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "build"),
      publicPath: "/",
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "public/chat-widget-js/chat-interface-client.js",
            to: "chat-widget-js/chat-interface-client.js",
          },
          {
            from: "public/favicon.png",
            to: "favicon.png",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "public", "index.html"),
      }),
      isDevelopment
        ? new Dotenv()
        : new webpack.DefinePlugin({
            "process.env.REACT_APP_AWS_REGION": JSON.stringify(
              process.env.REACT_APP_AWS_REGION
            ),
            "process.env.REACT_APP_AWS_ACCESS_KEY_ID": JSON.stringify(
              process.env.REACT_APP_AWS_ACCESS_KEY_ID
            ),
            "process.env.REACT_APP_AWS_SECRET_ACCESS_KEY": JSON.stringify(
              process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
            ),
            "process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID": JSON.stringify(
              process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID
            ),
            "process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID": JSON.stringify(
              process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID
            ),
            "process.env.REACT_APP_AWS_SES_EMAIL_ID": JSON.stringify(
              process.env.REACT_APP_AWS_SES_EMAIL_ID
            ),
            "process.env.REACT_APP_SHOW_DELETE_BUTTON": JSON.stringify(
              process.env.REACT_APP_SHOW_DELETE_BUTTON
            ),
            "process.env.REACT_APP_TO_EMAIL_ID": JSON.stringify(
              process.env.REACT_APP_TO_EMAIL_ID
            ),
            "process.env.REACT_APP_AWS_S3_FILES": JSON.stringify(
              process.env.REACT_APP_AWS_S3_FILES
            ),
            "process.env.REACT_APP_AWS_S3_BUCKET_NAME": JSON.stringify(
              process.env.REACT_APP_AWS_S3_BUCKET_NAME
            ),
            "process.env.MIDDLEWARE_API_URL": JSON.stringify(
              process.env.MIDDLEWARE_API_URL
            ),
            "process.env.MIDDLEWARE_API_USERNAME": JSON.stringify(
              process.env.MIDDLEWARE_API_USERNAME
            ),
            "process.env.MIDDLEWARE_API_PASSWORD": JSON.stringify(
              process.env.MIDDLEWARE_API_PASSWORD
            ),
            "process.env.AI_API_URL": JSON.stringify(process.env.AI_API_URL),
            "process.env.AI_API_USERNAME": JSON.stringify(
              process.env.AI_API_USERNAME
            ),
            "process.env.AI_API_PASSWORD": JSON.stringify(
              process.env.AI_API_PASSWORD
            ),
            "process.env.INSIGHTBOT_FORNTEND_URL": JSON.stringify(
              process.env.INSIGHTBOT_FORNTEND_URL
            ),
          }),
    ],

    devServer: {
      historyApiFallback: true,
      static: {
        directory: path.join(__dirname, "build"),
      },
      port: 3000,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.less$/,
          use: ["style-loader", "css-loader", "less-loader"],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        // {
        //   test: /\.(woff|woff2|eot|ttf|otf)$/i,
        //   type: "asset/resource",
        //   generator: {
        //     filename: "fonts/[name].[ext]",
        //   },
        // },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          loader: "file-loader",
          options: {
            name(resourcePath, resourceQuery) {
              return "assets/images/[name].[ext]";
            },
          },
        },
      ],
    },
    // pass all js files through Babel
    resolve: {
      extensions: ["*", ".js", ".js"],
    },
  };

  return config;
};
