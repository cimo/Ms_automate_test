/*import { IvirtualNode } from "../JsMvcFwInterface";
import h from "../JsMvcFwJsx";

// Soruce
import * as ModelIndex from "../model/Index";
import viewLoader from "./Loader";
//import viewSpecFile from "./SpecFile";

const viewPageIndex = (
    variableList: ModelIndex.IvariableList,
    methodList: ModelIndex.ImethodList,
    subViewList: ModelIndex.IsubViewList
): IvirtualNode => {
    //return `${viewLoader(variableList)}
    //${viewAlert()}
    //${viewDialog()}
    //<div class="page_container view_index">
    //    <div class="header"></div>
    //    <div class="left">
    //        ${viewSpecFile(variableList)}
    //    </div>
    //    <div class="right">
    //       ${viewClientTemplate}
    //       ${viewVideoTemplate}
    //       ${viewUploadTemplate}
    //   </div>
    //</div>`;

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

export default viewPageIndex;*/

import { IvirtualNode } from "../JsMvcFwInterface";
import { useState } from "../FwBase";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";

const viewPageIndex = (variableList: ModelIndex.Itest, methodList: ModelIndex.ImethodList): IvirtualNode => {
    const [name, updateName] = useState("Simone");

    return (
        <div>
            <div>
                <p>Test1 {name}</p>
                <input type="text" name="name1" value={name} onInput={(e) => updateName((e.target as HTMLInputElement).value)} />
            </div>
            <div>
                <p>Test2 {variableList.name.state}</p>
                <input
                    type="text"
                    name="name2"
                    value={variableList.name.state}
                    onInput={(e) => methodList.updateName((e.target as HTMLInputElement).value)}
                />
                <button onClick={methodList.onClickTest}>Click</button>
            </div>
        </div>
    );
};

export default viewPageIndex;
