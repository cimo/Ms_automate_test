"use strict";

exports.checkEnv = (key, value) => {
    if (value === undefined) {
        throw new Error(`HelperEnv.js - checkEnv()": ${key} is not defined!`);
    }

    return value;
};
