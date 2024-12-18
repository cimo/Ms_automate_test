const Path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EsLintPlugin = require("eslint-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { Ce } = require("@cimo/environment");

const ENV_NAME = Ce.checkVariable("ENV_NAME");

const ceList = Ce.loadFile(`./env/${ENV_NAME}.env`);

Ce.checkVariable("DOMAIN");
Ce.checkVariable("TIMEZONE");
Ce.checkVariable("SERVER_PORT");
Ce.checkVariable("SERVER_LOCATION");
const PATH_ROOT = Ce.checkVariable("PATH_ROOT");
const NAME = Ce.checkVariable("MS_AT_NAME");
Ce.checkVariable("MS_AT_LABEL");
Ce.checkVariable("MS_AT_DEBUG");
const NODE_ENV = Ce.checkVariable("MS_AT_NODE_ENV");
const URL_ROOT = Ce.checkVariable("MS_AT_URL_ROOT");
Ce.checkVariable("MS_AT_URL_CORS_ORIGIN");
Ce.checkVariable("MS_AT_URL_TEST");
Ce.checkVariable("MS_AT_PATH_CERTIFICATE_KEY");
Ce.checkVariable("MS_AT_PATH_CERTIFICATE_CRT");
Ce.checkVariable("MS_AT_PATH_PUBLIC");
Ce.checkVariable("MS_AT_PATH_LOG");
Ce.checkVariable("MS_AT_PATH_FILE_INPUT");
Ce.checkVariable("MS_AT_PATH_FILE_OUTPUT");
Ce.checkVariable("MS_AT_PATH_FILE_DOWNLOAD");
Ce.checkVariable("MS_AT_PATH_FILE_SCRIPT");
Ce.checkVariable("MS_AT_MIME_TYPE");
Ce.checkVariable("MS_AT_FILE_SIZE_MB");
Ce.checkVariable("MS_AT_WS_ADDRESS");
Ce.checkVariable("MS_AT_SECRET_KEY");

module.exports = {
    target: "web",
    devtool: "source-map",
    mode: NODE_ENV,
    entry: `${PATH_ROOT}src/view/Main.ts`,
    output: {
        filename: "main.js",
        sourceMapFilename: "main.js.map",
        path: Path.resolve(__dirname, "public/js"),
        publicPath: URL_ROOT
    },
    resolve: {
        extensions: [".ts", ".js"],
        fallback: {
            fs: false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /(node_modules)/
            }
        ]
    },
    performance: {
        hints: false
    },
    optimization: {
        minimize: ENV_NAME === "local" ? false : true,
        minimizer: [
            new TerserPlugin({
                exclude: /(node_modules)/,
                parallel: true,
                terserOptions: {
                    ecma: undefined,
                    parse: {},
                    compress: {},
                    mangle: true,
                    module: false
                }
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin(ceList),
        new HtmlWebpackPlugin({
            template: `${Path.resolve(__dirname)}/template_index.html`,
            filename: `${Path.resolve(__dirname, "public")}/index.html`,
            inject: false,
            templateParameters: {
                name: NAME,
                urlRoot: URL_ROOT
            }
        }),
        new EsLintPlugin({
            extensions: ["ts", "js"],
            configType: "flat",
            overrideConfigFile: `${Path.resolve(__dirname)}/eslint.config.js`,

        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
