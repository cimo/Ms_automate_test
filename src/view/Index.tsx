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

    /*const listState = variableState(
        [
            { id: "a", label: "Elemento A", value: "" },
            { id: "b", label: "Elemento B", value: "" },
            { id: "c", label: "Elemento C", value: "" }
        ],
        "index"
    );*/

    /*function handleInput(item: { id?: string; label?: string; value: unknown }) {
        return (e: Event) => {
            item.value = (e.target as HTMLInputElement).value;
        };
    }*/

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

                    <button
                        onclick={() => {
                            variableList.listState.state.reverse();
                        }}
                    >
                        Inverti ordine
                    </button>

                    <div class="test-list">
                        {variableList.listState.state.map((item) => (
                            <div key={item.id} class="test-item">
                                <label>{item.label}</label>
                                <input
                                    type="text"
                                    value={item.value}
                                    oninput={() => {
                                        return (e: Event) => {
                                            item.value = (e.target as HTMLInputElement).value;
                                        };
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
