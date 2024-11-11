const Path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const EsLintPlugin = require("eslint-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

// Source
const helperWebpack = require("./src/HelperWebpack");

const ENV_NAME = helperWebpack.checkEnv("ENV_NAME", process.env.ENV_NAME);

require("dotenv").config({ path: `./env/${ENV_NAME}.env` });

const DOMAIN = helperWebpack.checkEnv("DOMAIN", process.env.DOMAIN);
const TIMEZONE = helperWebpack.checkEnv("TIMEZONE", process.env.TIMEZONE);
const SERVER_PORT = helperWebpack.checkEnv("SERVER_PORT", process.env.SERVER_PORT);
const PATH_ROOT = helperWebpack.checkEnv("PATH_ROOT", process.env.PATH_ROOT);
const MS_AT_NAME = helperWebpack.checkEnv("MS_AT_NAME", process.env.MS_AT_NAME);
const MS_AT_LABEL = helperWebpack.checkEnv("MS_AT_LABEL", process.env.MS_AT_LABEL);
const MS_AT_DEBUG = helperWebpack.checkEnv("MS_AT_DEBUG", process.env.MS_AT_DEBUG);
const MS_AT_NODE_ENV = helperWebpack.checkEnv("MS_AT_NODE_ENV", process.env.MS_AT_NODE_ENV);
const MS_AT_URL_ROOT = helperWebpack.checkEnv("MS_AT_URL_ROOT", process.env.MS_AT_URL_ROOT);
const MS_AT_URL_CORS_ORIGIN = helperWebpack.checkEnv("MS_AT_URL_CORS_ORIGIN", process.env.MS_AT_URL_CORS_ORIGIN);
const MS_AT_URL_TEST = helperWebpack.checkEnv("MS_AT_URL_TEST", process.env.MS_AT_URL_TEST);
const MS_AT_PATH_CERTIFICATE_KEY = helperWebpack.checkEnv("MS_AT_PATH_CERTIFICATE_KEY", process.env.MS_AT_PATH_CERTIFICATE_KEY);
const MS_AT_PATH_CERTIFICATE_CRT = helperWebpack.checkEnv("MS_AT_PATH_CERTIFICATE_CRT", process.env.MS_AT_PATH_CERTIFICATE_CRT);
const MS_AT_PATH_PUBLIC = helperWebpack.checkEnv("MS_AT_PATH_PUBLIC", process.env.MS_AT_PATH_PUBLIC);
const MS_AT_PATH_LOG = helperWebpack.checkEnv("MS_AT_PATH_LOG", process.env.MS_AT_PATH_LOG);
const MS_AT_PATH_FILE_INPUT = helperWebpack.checkEnv("MS_AT_PATH_FILE_INPUT", process.env.MS_AT_PATH_FILE_INPUT);
const MS_AT_PATH_FILE_OUTPUT = helperWebpack.checkEnv("MS_AT_PATH_FILE_OUTPUT", process.env.MS_AT_PATH_FILE_OUTPUT);
const MS_AT_PATH_FILE_SCRIPT = helperWebpack.checkEnv("MS_AT_PATH_FILE_SCRIPT", process.env.MS_AT_PATH_FILE_SCRIPT);
const MS_AT_MIME_TYPE = helperWebpack.checkEnv("MS_AT_MIME_TYPE", process.env.MS_AT_MIME_TYPE);
const MS_AT_FILE_SIZE_MB = helperWebpack.checkEnv("MS_AT_FILE_SIZE_MB", process.env.MS_AT_FILE_SIZE_MB);
const MS_AT_WS_ADDRESS = helperWebpack.checkEnv("MS_AT_WS_ADDRESS", process.env.MS_AT_WS_ADDRESS);

module.exports = {
    target: "web",
    devtool: "source-map",
    mode: MS_AT_NODE_ENV,
    entry: `${PATH_ROOT}src/view/Main.ts`,
    output: {
        filename: "main.js",
        sourceMapFilename: "main.js.map",
        path: Path.resolve(__dirname, "public/js"),
        publicPath: MS_AT_URL_ROOT
    },
    resolve: {
        extensions: [".ts", ".js"]
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
        new webpack.DefinePlugin({
            "process.env": JSON.stringify({
                ENV_NAME,
                DOMAIN,
                TIMEZONE,
                SERVER_PORT,
                PATH_ROOT,
                MS_AT_NAME,
                MS_AT_LABEL,
                MS_AT_DEBUG,
                MS_AT_NODE_ENV,
                MS_AT_URL_ROOT,
                MS_AT_URL_CORS_ORIGIN,
                MS_AT_URL_TEST,
                MS_AT_PATH_CERTIFICATE_KEY,
                MS_AT_PATH_CERTIFICATE_CRT,
                MS_AT_PATH_PUBLIC,
                MS_AT_PATH_LOG,
                MS_AT_PATH_FILE_INPUT,
                MS_AT_PATH_FILE_OUTPUT,
                MS_AT_PATH_FILE_SCRIPT,
                MS_AT_MIME_TYPE,
                MS_AT_FILE_SIZE_MB,
                MS_AT_WS_ADDRESS
            })
        }),
        new HtmlWebpackPlugin({
            template: `${PATH_ROOT}template_index.html`,
            filename: `${PATH_ROOT}src/view/main.twig`,
            inject: false,
            templateParameters: {
                name: MS_AT_NAME,
                urlRoot: MS_AT_URL_ROOT
            }
        }),
        new EsLintPlugin({
            extensions: ["ts", "js"],
            exclude: ["node_modules"],
            fix: true
        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
