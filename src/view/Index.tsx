import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";

const viewIndex = (variableList: ModelIndex.IvariableList, methodList: ModelIndex.ImethodList): IvirtualNode => {
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
        <div data-jsmvcfw-controllerName="index">
            {viewLoader(variableList)}
            <aside data-jsmvcfw-controllerName="alert"/>
            <aside data-jsmvcfw-controllerName="dialog"/>
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">
                    {viewSpecFile(variableList)}
                </div>
                <div class="right">
                    {/*viewClientTemplate(variableList)*/}
                    {/*viewVideoTemplate(variableList)*/}
                    {/*viewUploadTemplate(variableList)*/}
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
