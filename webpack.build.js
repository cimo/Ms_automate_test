const Path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

// Source
const helperEnv = require("./src/HelperEnv");

const ENV_NAME = helperEnv.checkEnv("ENV_NAME", process.env.ENV_NAME);

require("dotenv").config({ path: `./env/${ENV_NAME}.env` });

helperEnv.checkEnv("DOMAIN", process.env.DOMAIN);
helperEnv.checkEnv("TIMEZONE", process.env.TIMEZONE);
helperEnv.checkEnv("SERVER_PORT", process.env.SERVER_PORT);
const DEBUG = helperEnv.checkEnv("MS_AT_DEBUG", process.env.MS_AT_DEBUG);
const NODE_ENV = helperEnv.checkEnv("MS_AT_NODE_ENV", process.env.MS_AT_NODE_ENV);
const PUBLIC_PATH = helperEnv.checkEnv("MS_AT_PUBLIC_PATH", process.env.MS_AT_PUBLIC_PATH);
helperEnv.checkEnv("MS_AT_CORS_ORIGIN_URL", process.env.MS_AT_CORS_ORIGIN_URL);
helperEnv.checkEnv("MS_AT_MIME_TYPE", process.env.MS_AT_MIME_TYPE);
helperEnv.checkEnv("MS_AT_FILE_SIZE_MB", process.env.MS_AT_FILE_SIZE_MB);
helperEnv.checkEnv("MS_AT_PATH_CERTIFICATE_KEY", process.env.MS_AT_PATH_CERTIFICATE_KEY);
helperEnv.checkEnv("MS_AT_PATH_CERTIFICATE_CRT", process.env.MS_AT_PATH_CERTIFICATE_CRT);
helperEnv.checkEnv("MS_AT_PATH_STATIC", process.env.MS_AT_PATH_STATIC);
helperEnv.checkEnv("MS_AT_PATH_LOG", process.env.MS_AT_PATH_LOG);
helperEnv.checkEnv("MS_AT_PATH_FILE_INPUT", process.env.MS_AT_PATH_FILE_INPUT);
helperEnv.checkEnv("MS_AT_PATH_FILE_OUTPUT", process.env.MS_AT_PATH_FILE_OUTPUT);
helperEnv.checkEnv("MS_AT_PATH_FILE_PID", process.env.MS_AT_PATH_FILE_PID);
helperEnv.checkEnv("MS_AT_PUBLIC_FILE_OUTPUT", process.env.MS_AT_PUBLIC_FILE_OUTPUT);

process.env["IGNORE_MOBX_MINIFY_WARNING"] = DEBUG;

module.exports = {
    target: "web",
    devtool: "source-map",
    mode: NODE_ENV,
    entry: "./src/view/Main.ts",
    output: {
        filename: "main.js",
        sourceMapFilename: "main.js.map",
        path: Path.resolve(__dirname, "public/js"),
        publicPath: PUBLIC_PATH
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
        minimize: true,
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
            "process.env": JSON.stringify(process.env)
        }),
        new CompressionPlugin({
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ]
};
