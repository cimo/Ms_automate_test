import { IrouterA, IcontrollerA } from "./JsFwInterface";
import { writeLog, renderTemplate, getUrlRoot, getElementRoot } from "./JsFw";

let routerList: IrouterA[] = [];
let controller: IcontrollerA | null = null;

const routerHistoryPush = (nextUrl: string, soft: boolean, title = "", parameterListValue?: Record<string, unknown>): void => {
    let url = nextUrl;

    if (nextUrl.charAt(0) === "/") {
        url = nextUrl.slice(1);
    }

    if (url === "") {
        url = "/";
    }

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
    let isNotFound = false;

    const urlRoot = getUrlRoot();
    const elementRoot = getElementRoot();

    if (elementRoot) {
        for (const [, value] of routerList.entries()) {
            if (value.path === nextUrl) {
                controller = value.controller();

                if (Object.keys(controller).length > 0) {
                    controller.variable();
                }

                if (urlRoot && isHistoryPushEnabled) {
                    const urlRootReplace = urlRoot.replace(/\/+$/, "");

                    routerHistoryPush(`${urlRootReplace}${nextUrl}`, soft, value.title, parameterList);

                    if (parameterSearch) {
                        window.location.search = parameterSearch;
                    }
                }

                if (!isHistoryPushEnabled || soft) {
                    document.title = value.title;

                    if (controller && Object.keys(controller).length > 0) {
                        const template = controller.view();

                        renderTemplate(template());
                    } else {
                        elementRoot.innerHTML = "";
                    }
                }

                if (controller && Object.keys(controller).length > 0) {
                    controller.event();
                }

                isNotFound = false;

                break;
            } else {
                isNotFound = true;
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
    } else {
        throw new Error("@cimo/jsmvcfw => JsMvcFwRouter.ts => Element root not found!");
    }
};

export const routerInit = (routerListValue: IrouterA[]): void => {
    routerList = routerListValue;

    window.onload = (event: Event) => {
        writeLog("@cimo/jsmvcfw => JsMvcFwRouter.ts => onload()", window.location.pathname);

        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onpopstate = (event: PopStateEvent) => {
        writeLog("@cimo/jsmvcfw => JsMvcFwRouter.ts => onpopstate()", window.location.pathname);

        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onbeforeunload = (event: Event) => {
        writeLog("@cimo/jsmvcfw => JsMvcFwRouter.ts => onbeforeunload()", { event });

        if (event && controller && Object.keys(controller).length > 0) {
            controller.destroy();
        }
    };
};

export const navigateTo = (nextUrl: string, soft = false, parameterList?: Record<string, unknown>, parameterSearch?: string): void => {
    writeLog("@cimo/jsmvcfw => JsMvcFwRouter.ts => navigateTo()", { nextUrl, parameterList, parameterSearch });

    populatePage(true, nextUrl, soft, parameterList, parameterSearch);
};
