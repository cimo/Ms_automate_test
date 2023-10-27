import Express from "express";
import Fs from "fs";
import { Cfdp, CfdpInterface } from "@cimo/form-data_parser";

// Source
import * as ControllerHelper from "./Helper";

export const execute = (request: Express.Request, isFileExists: boolean): Promise<CfdpInterface.Iinput[]> => {
    return new Promise((resolve, reject) => {
        const chunkList: Buffer[] = [];

        request.on("data", (data: Buffer) => {
            chunkList.push(data);
        });

        request.on("end", () => {
            void (async () => {
                const buffer = Buffer.concat(chunkList);
                const formDataList = Cfdp.readInput(buffer, request.headers["content-type"]);

                const checkRequestResult = checkRequest(formDataList);

                if (checkRequestResult) {
                    for (const value of formDataList) {
                        if (value.name === "file" && value.filename && value.buffer) {
                            const input = `${ControllerHelper.PATH_FILE_INPUT}${value.filename}`;

                            if (isFileExists && Fs.existsSync(input)) {
                                reject("File exists.");

                                break;
                            } else {
                                await ControllerHelper.fileWriteStream(input, value.buffer)
                                    .then(() => {
                                        resolve(formDataList);
                                    })
                                    .catch((error: Error) => {
                                        ControllerHelper.writeLog(
                                            "Upload.ts - execute() - request.on('end') - ControllerHelper.fileWriteStream() - catch()",
                                            error
                                        );

                                        reject(error);
                                    });

                                break;
                            }
                        }
                    }
                } else {
                    reject("Wrong parameters.");
                }
            })();
        });

        request.on("error", (error: Error) => {
            reject(error);
        });
    });
};

const checkRequest = (formDataList: CfdpInterface.Iinput[]): boolean => {
    const parameterList: string[] = [];
    let fileProblem = "";
    let parameterNotFound = "";

    for (const value of formDataList) {
        if (value.name === "file") {
            if (value.filename === "" || value.mimeType === "" || value.size === "") {
                fileProblem = "empty";
            } else if (!ControllerHelper.checkMymeType(value.mimeType)) {
                fileProblem = "mimeType";
            } else if (!ControllerHelper.checkFileSize(value.size)) {
                fileProblem = "size";
            }
        }

        parameterList.push(value.name);
    }

    if (!parameterList.includes("file_name")) {
        parameterNotFound = "file_name";
    }

    if (!parameterList.includes("file")) {
        parameterNotFound = "file";
    }

    if (!parameterList.includes("action_number")) {
        parameterNotFound = "action_number";
    }

    // Result
    const result = fileProblem === "" && parameterNotFound === "" ? true : false;

    if (!result) {
        ControllerHelper.writeLog("Upload.ts - checkRequest()", `fileProblem: ${fileProblem} - parameterNotFound: ${parameterNotFound}`);
    }

    return result;
};
