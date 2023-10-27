import Express from "express";
import Fs from "fs";
import * as Https from "https";
import CookieParser from "cookie-parser";
import Cors from "cors";
import { TwingEnvironment, TwingLoaderFilesystem } from "twing";
import { Ca } from "@cimo/authentication";
import { CwsServer } from "@cimo/websocket";
import { Cp } from "@cimo/pid";

// Source
import * as ControllerHelper from "./Helper";
import * as ControllerTester from "./Tester";
import * as ModelServer from "../model/Server";

const corsOption: ModelServer.Icors = {
    originList: ControllerHelper.CORS_ORIGIN_URL,
    methodList: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

const loader = new TwingLoaderFilesystem("/home/root/src/view/");
const twing = new TwingEnvironment(loader, {
    cache: "/home/root/src/view/cache/",
    auto_reload: ControllerHelper.DEBUG === "true" ? true : false
});

const cp = new Cp(5);

const app = Express();
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.static(ControllerHelper.PATH_STATIC));
app.use(CookieParser());
app.use(
    Cors({
        origin: corsOption.originList,
        methods: corsOption.methodList,
        optionsSuccessStatus: corsOption.optionsSuccessStatus
    })
);

const server = Https.createServer(
    {
        key: Fs.readFileSync(ControllerHelper.PATH_CERTIFICATE_KEY),
        cert: Fs.readFileSync(ControllerHelper.PATH_CERTIFICATE_CRT)
    },
    app
);

server.listen(ControllerHelper.SERVER_PORT, () => {
    const serverTime = ControllerHelper.serverTime();

    ControllerHelper.writeLog("Server.ts - server.listen()", `Port ${ControllerHelper.SERVER_PORT || ""} - Time: ${serverTime}`);

    app.get("/", (_request: Express.Request, response: Express.Response) => {
        ControllerHelper.responseBody("ms_automate_test", "", response, 200);
    });

    app.get("/login", (_request: Express.Request, response: Express.Response) => {
        Ca.generateCookie("ms_at_authentication", response);

        response.redirect("/ui");
    });

    app.get("/logout", Ca.authenticationMiddleware, (_request: Express.Request, response: Express.Response) => {
        ControllerHelper.removeCookie("ms_at_authentication", response);

        response.redirect("/");
    });

    app.get("/ui", Ca.authenticationMiddleware, (_request: Express.Request, response: Express.Response) => {
        const specList = ControllerTester.specList();

        twing
            .render("index.twig", { specList: specList })
            .then((output) => {
                response.end(output);
            })
            .catch((error: Error) => {
                ControllerHelper.writeLog("Tester.ts - server.listen() - twing.render() - catch()", error);
            });
    });

    ControllerTester.api(app, Ca.authenticationMiddleware, cp);
});

const cwsServer = new CwsServer();
cwsServer.create(server);

ControllerTester.websocket(cwsServer, cp);

ControllerHelper.keepProcess();
