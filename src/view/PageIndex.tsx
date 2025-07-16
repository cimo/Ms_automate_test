import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Soruce
import * as ModelIndex from "../model/Index";
import viewLoader from "./Loader";
//import viewDialog from "./Dialog";
//import viewSpecFile from "./SpecFile";

const viewPageIndex = (
    variableList: ModelIndex.IvariableList,
    methodList: ModelIndex.ImethodList,
    subViewList: ModelIndex.IsubViewList
): IvirtualNode => {
    /*return `${viewLoader(variableList)}
    ${viewAlert()}
    ${viewDialog()}
    <div class="page_container view_index">
        <div class="header"></div>
        <div class="left">
            ${viewSpecFile(variableList)}
        </div>
        <div class="right">
            ${viewClientTemplate}
            ${viewVideoTemplate}
            ${viewUploadTemplate}
        </div>
    </div>`;*/

    return (
        <div>
            {viewLoader(variableList)}
            {subViewList.viewAlert}
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">
                    <button onClick={methodList.onClickTest}>Click</button>
                </div>
                <div class="right"></div>
            </div>
        </div>
    );
};

export default viewPageIndex;
