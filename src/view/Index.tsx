//import { variableState } from "../JsMvcFw";
import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const viewIndex = (variableList: ModelIndex.Ivariable, methodList: ModelIndex.Imethod): IvirtualNode => {
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

    const onClick = () => {
        variableList.listState.state.reverse();
    };

    const onInput = (item: { id: string; label: string; value: string }) => {
        return (e: Event) => {
            item.value = (e.target as HTMLInputElement).value;
        };
    };

    return (
        <div data-jsmvcfw-controllerName="index">
            {viewLoader(variableList)}
            <aside data-jsmvcfw-controllerName="alert" />
            <aside data-jsmvcfw-controllerName="dialog" />
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">{viewSpecFile(variableList)}</div>
                <div class="right">
                    {/*viewClientTemplate(variableList)*/}
                    {/*viewVideoTemplate(variableList)*/}
                    {/*viewUploadTemplate(variableList)*/}

                    <button onclick={onClick}>Inverti ordine</button>

                    <div class="test-list">
                        {variableList.listState.state.map((item) => (
                            <div key={item.id} class="test-item">
                                <label>{item.label}</label>
                                <input type="text" value={item.value} oninput={onInput(item)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
