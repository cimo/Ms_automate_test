// Soruce
import * as ModelIndex from "../model/Index";
import viewLoader from "./Loader";
import viewAlert from "./Alert";
import viewDialog from "./Dialog";
import viewSpecFile from "./SpecFile";

const viewPageIndex = (variableList: ModelIndex.IvariableList): string => {
    return `${viewLoader()}
    ${viewAlert()}
    ${viewDialog()}
    <div class="page_container view_index">
        <div class="header"></div>
        <div class="left">
            ${viewSpecFile(variableList)}
        </div>
        <div class="right">
            ${/*viewClientTemplate*/ ""}
            ${/*viewVideoTemplate*/ ""}
            ${/*viewUploadTemplate*/ ""}
        </div>
    </div>`;
};

export default viewPageIndex;
