import { Irouter, Icontroller } from "./JsMvcFwInterface";
import { getElementRoot, getUrlRoot, renderTemplate } from "./JsMvcBase";

let routerList: Irouter[] = [];
let controller: Icontroller;

const routerHistoryPush = (nextUrl: string, soft: boolean, title = "", parameterListValue?: Record<string, unknown>): void => {
    let url = nextUrl;

    if (nextUrl.charAt(0) === "/") {
        url = nextUrl.slice(1);
    }

    const [path, queryString] = url.split("?");
    const queryStringCleanedList: string[] = [];

    if (queryString) {
        const params = queryString.split("&");

        params.forEach((param) => {
            const [key, value] = param.split("=");

            const keyCleaned = encodeURIComponent(
                decodeURIComponent(key.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"))
            );

            if (value) {
                const valueCleaned = encodeURIComponent(
                    decodeURIComponent(value.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"))
                );

                queryStringCleanedList.push(`${keyCleaned}=${valueCleaned}`);
            } else {
                queryStringCleanedList.push(keyCleaned);
            }
        });
    }

    const pathCleaned = path.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    const urlCleaned = pathCleaned + (queryStringCleanedList.length > 0 ? "?" + queryStringCleanedList.join("&") : "");

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

                renderTemplate(() => controller.view(), controller.scopeId());
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
        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onpopstate = (event: PopStateEvent) => {
        if (event) {
            populatePage(false, window.location.pathname, false);
        }
    };

    window.onbeforeunload = () => {
        if (controller) {
            controller.destroy();
        }
    };
};

export const navigateTo = (nextUrl: string, soft = false, parameterList?: Record<string, unknown>, parameterSearch?: string): void => {
    populatePage(true, nextUrl, soft, parameterList, parameterSearch);
};
