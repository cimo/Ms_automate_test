import { setUrlRoot, route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as helperSrc from "./HelperSrc";
import ControllerIndex from "./controller/Index";

setUrlRoot(helperSrc.URL_ROOT);

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    }
]);
