"use strict";

exports.checkEnv = (key, value) => {
    if (value === undefined) {
        throw new Error(`${key} is not defined!`);
    }

    return value;
};
