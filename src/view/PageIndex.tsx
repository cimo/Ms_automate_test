import { IvirtualNode } from "../JsMvcFwInterface";
/** @jsx createVirtualNodeFromJsx */
import createVirtualNodeFromJsx from "../JsMvcFwJsx";

// Soruce
import * as ModelIndex from "../model/Index";
//import viewLoader from "./Loader";
/*import viewAlert from "./Alert";
import viewDialog from "./Dialog";
import viewSpecFile from "./SpecFile";*/

const viewPageIndex = (variableList: ModelIndex.IvariableList, methodList: ModelIndex.ImethodList): IvirtualNode => {
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
            <p>Ciao cimo.</p>
            {/*viewLoader(variableList)*/}
            <button onClick={methodList.onClickTest}>Click</button>
        </div>
    );
};

export default viewPageIndex;
