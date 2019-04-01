"use strict";
const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: path.resolve(__dirname, "browser/src/index.tsx"),
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader",
                exclude: path.resolve(__dirname, 'server')
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
        contentBase: path.resolve(__dirname, "browser/"),
        port: 3000,
        publicPath: "http://localhost:3000/dist/",
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}
