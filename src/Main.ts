import { route } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import ControllerIndex from "./controller/Index";

route([
    {
        title: "Index",
        path: "/",
        controller: () => new ControllerIndex()
    }
]);
