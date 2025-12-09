import { setUrlRoot, setAppLabel, route } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as helperSrc from "./HelperSrc";
import ControllerIndex from "./controller/Index";

setUrlRoot(helperSrc.URL_ROOT);
setAppLabel(helperSrc.LABEL);

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    }
]);
