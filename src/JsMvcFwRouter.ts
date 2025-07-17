import { Irouter, Icontroller } from "./JsMvcFwInterface";
import { writeLog, getUrlRoot, getElementRoot, renderTemplate } from "./JsMvcBase";

let routerList: Irouter[] = [];
let controller: Icontroller;

const routerHistoryPush = (nextUrl: string, soft: boolean, title = "", parameterListValue?: Record<string, unknown>): void => {
    let url = nextUrl.startsWith("/") ? nextUrl.slice(1) : nextUrl;
    if (url === "") url = "/";

    const [path, queryString] = url.split("?");
    const queryStringCleanedList: string[] = [];

    if (queryString) {
        const params = queryString.split("&");
        params.forEach((param) => {
            const [key, value] = param.split("=");
            if (value) {
                const cleanedValue = encodeURIComponent(decodeURIComponent(value));
                queryStringCleanedList.push(`${key}=${cleanedValue}`);
            } else {
                queryStringCleanedList.push(key);
            }
        });
    }

    const urlCleaned = path + (queryStringCleanedList.length > 0 ? "?" + queryStringCleanedList.join("&") : "");

    window.history.pushState(
        {
            prevUrl: window.location.pathname,
            parameterList: parameterListValue
        },
        title,
        urlCleaned
    );

    if (!soft) {
        window.location.href = urlCleaned;
    }
};

const populatePage = (
    isHistoryPushEnabled: boolean,
    nextUrl: string,
    soft: boolean,
    parameterList?: Record<string, unknown>,
    parameterSearch?: string
): void => {
    let isNotFound = true;

    const urlRoot = getUrlRoot();
    const elementRoot = getElementRoot();

    if (!elementRoot) {
        throw new Error("JsMvcFwRouter.ts => Element root not found!");
    }

    for (const route of routerList) {
        if (route.path === nextUrl) {
            controller = route.controller();

            controller.variable();

            if (urlRoot && isHistoryPushEnabled) {
                routerHistoryPush(`${urlRoot.replace(/\/+$/, "")}${nextUrl}`, soft, route.title, parameterList);

                if (parameterSearch) {
                    window.location.search = parameterSearch;
                }
            }

            if (!isHistoryPushEnabled || soft) {
                document.title = route.title;

                renderTemplate(() => controller.view());
            }

            controller.event();

            isNotFound = false;

            break;
        }
    }

    if (isNotFound) {
        if (isHistoryPushEnabled) {
            routerHistoryPush("/404", soft, "404", parameterList);
        }

        if (!isHistoryPushEnabled || soft) {
            document.title = "404";
            elementRoot.innerHTML = "Route not found!";
        }
    }
};

export const routerInit = (routerListValue: Irouter[]): void => {
    routerList = routerListValue;

    window.onload = (event: Event) => {
        writeLog("JsMvcFwRouter.ts => onload()", window.location.pathname);

        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onpopstate = (event: PopStateEvent) => {
        writeLog("JsMvcFwRouter.ts => onpopstate()", window.location.pathname);

        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onbeforeunload = (event: Event) => {
        writeLog("JsMvcFwRouter.ts => onbeforeunload()", { event });

        if (controller) {
            controller.destroy();
        }
    };
};

export const navigateTo = (nextUrl: string, soft = false, parameterList?: Record<string, unknown>, parameterSearch?: string): void => {
    writeLog("JsMvcFwRouter.ts => navigateTo()", { nextUrl, parameterList, parameterSearch });

    populatePage(true, nextUrl, soft, parameterList, parameterSearch);
};
