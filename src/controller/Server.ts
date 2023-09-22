import Express from "express";
import Fs from "fs";
import * as Https from "https";
import CookieParser from "cookie-parser";
import Cors from "cors";
import { TwingEnvironment, TwingLoaderFilesystem } from "twing";
import { SioServer } from "@cimo/websocket";

// Source
import * as ControllerHelper from "../controller/Helper";
import * as ControllerTester from "../controller/Tester";
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
    auto_reload: ControllerHelper.DEBUG ? true : false
});

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
        key: Fs.readFileSync(ControllerHelper.PATH_CERTIFICATE_FILE_KEY),
        cert: Fs.readFileSync(ControllerHelper.PATH_CERTIFICATE_FILE_CRT)
    },
    app
);

SioServer.execute(server, {}, "ms_automatetest", ["upload", "run", "download"]);

server.listen(ControllerHelper.SERVER_PORT, () => {
    const serverTime = ControllerHelper.serverTime();

    ControllerHelper.writeLog("Server.ts - server.listen", `Port ${ControllerHelper.SERVER_PORT || ""} - Time: ${serverTime}`);

    ControllerTester.execute(app);

    app.get("/", (_request: Express.Request, response: Express.Response) => {
        const testList = ControllerTester.testList();

        void twing.render("index.twig", { testList: testList }).then((output) => {
            response.end(output);
        });
    });
});
