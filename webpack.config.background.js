const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const SRC = path.join(__dirname, "src");

module.exports = {
  mode: "production",
  entry: {
    background: path.join(SRC, "background.ts"),
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: ["public"],
    }),
  ],
};
