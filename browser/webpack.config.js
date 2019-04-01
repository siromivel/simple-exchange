"use strict";
const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: path.resolve(__dirname, "src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
                include: path.resolve(__dirname)
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx",]
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "dist/",
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
