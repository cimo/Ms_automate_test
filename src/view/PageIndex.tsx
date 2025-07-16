import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Soruce
import * as ModelIndex from "../model/Index";
import viewLoader from "./Loader";
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
            <div id="subViewAlert">{subViewList.alert}</div>
            <div id="subViewDialog">{subViewList.dialog}</div>
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">
                    <button onClick={methodList.onClickTest}>Click</button>
                </div>
                <div class="right">{variableList.userList.state}</div>
            </div>
        </div>
    );
};

export default viewPageIndex;
