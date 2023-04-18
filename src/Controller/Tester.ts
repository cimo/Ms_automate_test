import Express from "express";
//import Path from "path";
//import { exec } from "child_process";

// Source

export const execute = (app: Express.Express): void => {
    app.post("/msautomatetest/execute", (request: Express.Request, response: Express.Response) => {
        void (async () => {
            //...
        })();
    });
};
