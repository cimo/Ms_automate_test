exports.checkEnv = (key, value) => {
    if (value === undefined) {
        throw new Error(`HelperWebpack.js - checkEnv()": ${key} is not defined!`);
    }

    return value;
};
