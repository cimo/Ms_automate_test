import { route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as helperSrc from "./HelperSrc";
import ControllerIndex from "./controller/Index";

route([
    {
        title: "Index",
        path: `${helperSrc.URL_ROOT}/`,
        controller: () => new ControllerIndex()
    }
]);
