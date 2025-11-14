const Path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { Ce } = require("@cimo/environment/dist/src/Main");

const ENV_NAME = Ce.checkVariable("ENV_NAME");

const ceObject = Ce.loadFile(`./env/${ENV_NAME}.env`);

Ce.checkVariable("DOMAIN");
Ce.checkVariable("TIME_ZONE");
Ce.checkVariable("LANG");
Ce.checkVariable("SERVER_PORT");
const PATH_ROOT = Ce.checkVariable("PATH_ROOT");
const NAME = Ce.checkVariable("MS_AT_NAME");
Ce.checkVariable("MS_AT_LABEL");
Ce.checkVariable("MS_AT_IS_DEBUG");
const NODE_ENV = Ce.checkVariable("MS_AT_NODE_ENV");
const URL_ROOT = Ce.checkVariable("MS_AT_URL_ROOT");
Ce.checkVariable("MS_AT_URL_CORS_ORIGIN");
Ce.checkVariable("MS_AT_URL_TEST");
Ce.checkVariable("MS_AT_PATH_CERTIFICATE_KEY");
Ce.checkVariable("MS_AT_PATH_CERTIFICATE_CRT");
Ce.checkVariable("MS_AT_PATH_FILE");
Ce.checkVariable("MS_AT_PATH_LOG");
Ce.checkVariable("MS_AT_PATH_PUBLIC");
Ce.checkVariable("MS_AT_PATH_SCRIPT");
Ce.checkVariable("MS_AT_MIME_TYPE");
Ce.checkVariable("MS_AT_FILE_SIZE_MB");
Ce.checkVariable("MS_AT_WS_ADDRESS");
Ce.checkVariable("MS_AT_WS_KEY");

module.exports = {
    target: "web",
    devtool: "source-map",
    mode: NODE_ENV,
    entry: Path.resolve(__dirname, "src/Main.ts"),
    output: {
        filename: "[name].js",
        path: Path.resolve(__dirname, "public/asset/js"),
        publicPath: "/asset/js/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        fallback: {
            fs: false
        }
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: [
                    {
                        loader: "esbuild-loader",
                        options: {
                            loader: "ts",
                            tsconfig: Path.resolve(__dirname, "tsconfig.json")
                        }
                    }
                ],
                include: /(src)/,
                exclude: /(dist|node_modules|public)/
            },
            {
                test: /\.(tsx)$/,
                use: [
                    {
                        loader: "esbuild-loader",
                        options: {
                            loader: "tsx",
                            tsconfig: Path.resolve(__dirname, "tsconfig.json")
                        }
                    }
                ],
                include: /(src\/view)/,
                exclude: /(dist|node_modules|public)/
            }
        ]
    },
    performance: {
        hints: false
    },
    optimization: {
        minimize: NODE_ENV === "development" ? false : true,
        minimizer: [
            new TerserPlugin({
                exclude: /(dist|node_modules|public)/,
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
        new webpack.DefinePlugin(ceObject),
        new HtmlWebpackPlugin({
            template: Path.resolve(__dirname, "template_index.html"),
            filename: Path.resolve(__dirname, "public/index.html"),
            inject: false,
            minify: false,
            templateParameters: {
                name: NAME,
                urlRoot: URL_ROOT,
                dateNow: Date.now()
            }
        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.(js|jsx|css|html)$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
