"use strict"
const dotenv = require("dotenv")
const path = require("path")
const webpack = require("webpack")

module.exports = () => {
    const env = dotenv.config().parsed

    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    }, {})

    return {
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
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin(envKeys)
        ]
    }
}
