import { IvirtualNode } from "../JsMvcFwInterface";
import { stateVariable } from "../JsMvcBase";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";
import viewLoader from "../view/Loader";

const viewIndex = (
    variableList: ModelIndex.IvariableList,
    methodList: ModelIndex.ImethodList
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
    </div>`;

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
    );*/

    const [name, onInputUpdateName] = stateVariable("Simone", "index");

    return (
        <div data-jsmvcfw-controllerName="index">
            {viewLoader(variableList)}
            <aside data-jsmvcfw-controllerName="alert"/>
            <aside data-jsmvcfw-controllerName="dialog"/>
            <div>
                <p>Test1 {name}</p>
                <input type="text" name="name1" value={name} onInput={(e) => onInputUpdateName((e.target as HTMLInputElement).value)} />
            </div>
            <div>
                <p>Test2 {variableList.name.state}</p>
                <input
                    type="text"
                    name="name2"
                    value={variableList.name.state}
                    onInput={(e) => methodList.onInputUpdateName((e.target as HTMLInputElement).value)}
                />
                <p>{variableList.count.state}</p>
                <button onClick={methodList.onClickCount}>Count</button>
                <button onClick={methodList.onClickOpen}>Open</button>
            </div>
            <div>
                <h3>List</h3>
                <ul>
                    {(() => {
                        const result: IvirtualNode[] = [];

                        for (const user of variableList.userList.state) {
                            result.push(<li>{user}</li>);
                        }

                        return result;
                    })()}
                </ul>
            </div>
        </div>
    );
};

export default viewIndex;
