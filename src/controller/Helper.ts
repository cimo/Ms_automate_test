import Express from "express";
import Fs from "fs";
import { exec } from "child_process";

// Source
import * as ModelHelper from "../model/Helper";

const checkEnv = (key: string, value: string | undefined): string => {
    if (value === undefined) {
        writeLog("Helper.ts - checkEnv()", `${key} is not defined!`);
    }

    return value as string;
};

const pidTime = 60;

export const ENV_NAME = checkEnv("ENV_NAME", process.env.ENV_NAME);
export const DOMAIN = checkEnv("DOMAIN", process.env.DOMAIN);
export const TIMEZONE = checkEnv("TIMEZONE", process.env.TIMEZONE);
export const SERVER_PORT = checkEnv("SERVER_PORT", process.env.SERVER_PORT);
export const DEBUG = checkEnv("MS_AT_DEBUG", process.env.MS_AT_DEBUG);
export const NODE_ENV = checkEnv("MS_AT_DEBUG", process.env.MS_AT_NODE_ENV);
export const CORS_ORIGIN_URL = checkEnv("MS_AT_CORS_ORIGIN_URL", process.env.MS_AT_CORS_ORIGIN_URL);
export const MIME_TYPE = checkEnv("MS_AT_MIME_TYPE", process.env.MS_AT_MIME_TYPE);
export const FILE_SIZE_MB = checkEnv("MS_AT_FILE_SIZE_MB", process.env.MS_AT_FILE_SIZE_MB);
export const PATH_CERTIFICATE_KEY = checkEnv("MS_AT_PATH_CERTIFICATE_KEY", process.env.MS_AT_PATH_CERTIFICATE_KEY);
export const PATH_CERTIFICATE_CRT = checkEnv("MS_AT_PATH_CERTIFICATE_CRT", process.env.MS_AT_PATH_CERTIFICATE_CRT);
export const PATH_STATIC = checkEnv("MS_AT_PATH_STATIC", process.env.MS_AT_PATH_STATIC);
export const PATH_LOG = checkEnv("MS_AT_PATH_LOG", process.env.MS_AT_PATH_LOG);
export const PATH_FILE_INPUT = checkEnv("MS_AT_PATH_FILE_INPUT", process.env.MS_AT_PATH_FILE_INPUT);
export const PATH_FILE_OUTPUT = checkEnv("MS_AT_PATH_FILE_OUTPUT", process.env.MS_AT_PATH_FILE_OUTPUT);
export const PATH_FILE_PID = checkEnv("MS_AT_PATH_FILE_PID", process.env.MS_AT_PATH_FILE_PID);
export const PUBLIC_FILE_OUTPUT = checkEnv("MS_AT_PUBLIC_FILE_OUTPUT", process.env.MS_AT_PUBLIC_FILE_OUTPUT);

export const writeLog = (tag: string, value: string | Error) => {
    if (DEBUG === "true" && PATH_LOG) {
        Fs.appendFile(`${PATH_LOG}debug.log`, `${tag}: ${value.toString()}\n`, () => {
            // eslint-disable-next-line no-console
            console.log(`WriteLog => ${tag}: `, value);
        });
    }
};

export const serverTime = (): string => {
    const currentDate = new Date();

    const month = currentDate.getMonth() + 1;
    const monthOut = month < 10 ? `0${month}` : `${month}`;

    const day = currentDate.getDate();
    const dayOut = day < 10 ? `0${day}` : `${day}`;

    const date = `${currentDate.getFullYear()}/${monthOut}/${dayOut}`;

    const minute = currentDate.getMinutes();
    const minuteOut = minute < 10 ? `0${minute}` : `${minute}`;

    const second = currentDate.getSeconds();
    const secondOut = second < 10 ? `0${second}` : `${second}`;

    const time = `${currentDate.getHours()}:${minuteOut}:${secondOut}`;

    const result = `${date} ${time}`;

    return result;
};

export const fileWriteStream = (filePath: string, buffer: Buffer): Promise<void> => {
    return new Promise((resolve, reject) => {
        const writeStream = Fs.createWriteStream(filePath);

        writeStream.on("open", () => {
            writeStream.write(buffer);
            writeStream.end();
        });

        writeStream.on("finish", () => {
            resolve();
        });

        writeStream.on("error", (error: Error) => {
            reject(error);
        });
    });
};

export const fileReadStream = (filePath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunkList: Buffer[] = [];

        const readStream = Fs.createReadStream(filePath);

        readStream.on("data", (chunk: Buffer) => {
            chunkList.push(chunk);
        });

        readStream.on("end", () => {
            const result = Buffer.concat(chunkList);

            resolve(result);
        });

        readStream.on("error", (error: Error) => {
            reject(error);
        });
    });
};

export const fileRemove = (path: string): Promise<NodeJS.ErrnoException | boolean> => {
    return new Promise((resolve, reject) => {
        Fs.unlink(path, (error: NodeJS.ErrnoException | null) => {
            if (error) {
                reject(error);
            } else {
                resolve(true);
            }
        });
    });
};

export const checkMymeType = (value: string): boolean => {
    if (MIME_TYPE && MIME_TYPE.includes(value)) {
        return true;
    }

    return false;
};

export const checkFileSize = (value: string): boolean => {
    const fileSizeMb = parseInt(FILE_SIZE_MB ? FILE_SIZE_MB : "0") * 1024 * 1024;

    if (fileSizeMb >= parseInt(value)) {
        return true;
    }

    return false;
};

export const responseBody = (stdoutValue: string, stderrValue: string | Error, response: Express.Response, mode: number) => {
    const responseBody: ModelHelper.IresponseBody = { response: { stdout: stdoutValue, stderr: stderrValue } };

    response.status(mode).send(responseBody);
};

export const checkJson = (json: string) => {
    if (
        /^[\],:{}\s]*$/.test(
            json
                .replace(/\\["\\/bfnrtu]/g, "@")
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\\-]?\d+)?/g, "]")
                .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
        )
    ) {
        return true;
    }

    return false;
};

export const startPid = (name: string, callback: ModelHelper.IcallbackExec) => {
    const fullPath = `${PATH_FILE_PID}${name}.pid`;
    const createFielWithDate = `touch ${fullPath} && echo $(date +%s) > ${fullPath}`;

    if (Fs.existsSync(fullPath)) {
        const content = Fs.readFileSync(fullPath).toString();

        if (content !== "") {
            const date1 = new Date(parseInt(content, 10) * 1000);
            const date2 = new Date();

            const difference = (date2.getTime() - date1.getTime()) / 1000;

            if (difference > pidTime) {
                endPid(name);

                exec(createFielWithDate, () => {
                    callback(true);
                });

                return;
            }
        }

        callback(false);

        return;
    } else {
        exec(createFielWithDate, () => {
            callback(true);
        });

        return;
    }
};

export const endPid = (name: string) => {
    exec(`rm ${PATH_FILE_PID}${name}.pid`);
};

export const removeCookie = (name: string, response: Express.Response) => {
    response.setHeader("Set-Cookie", `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`);
};

export const keepProcess = () => {
    for (const event of ["uncaughtException", "unhandledRejection"]) {
        process.on(event, (error: Error) => {
            writeLog("Helper.ts - keepProcess()", `Event: ${event} - Error: ${error.toString()}`);
        });
    }
};
