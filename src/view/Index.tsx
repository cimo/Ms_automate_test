import { variableState } from "../JsMvcFw";
import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";

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

    const onInput = (event: Event | null, item: { id: string; label: string; value: string }) => {
        if (event) {
            item.value = (event.target as HTMLInputElement).value;
        }
    };

    const name = variableState("Simone", "index");

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
                                <input type="text" value={item.value} oninput={(event: Event) => onInput(event, item)} />
                            </div>
                        ))}
                    </div>
                    <div>
                        <p>Test1 {name.value}</p>
                        <input
                            type="text"
                            name="name1"
                            value={name.value}
                            onInput={(event: Event) => name.setValue((event.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <p>Test2 {variableList.name.state}</p>
                        <input
                            type="text"
                            name="name2"
                            value={variableList.name.state}
                            onInput={(event: Event) => methodList.onInputUpdateName(event)}
                        />
                        <p>{variableList.count.state}</p>
                        <button onClick={methodList.onClickCount}>Count</button>
                        <button onClick={methodList.onClickOpen}>Open</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
