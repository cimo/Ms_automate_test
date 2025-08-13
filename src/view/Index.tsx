import { IvirtualNode, variableHook, jsxFactory } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";

const viewIndex = (controllerName: string, variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    /*return `${viewLoader(variableObject)}
    ${viewAlert()}
    ${viewDialog()}
    <div class="page_container view_index">
        <div class="header"></div>
        <div class="left">
            ${viewSpecFile(variableObject)}
        </div>
        <div class="right">
           ${viewClientTemplate}
           ${viewVideoTemplate}
           ${viewUploadTemplate}
       </div>
    </div>`;*/

    const onClick = () => {
        variableObject.listState.state.reverse();
    };

    const onInput = (event: Event | null, item: { id: string; label: string; value: string }) => {
        if (event) {
            item.value = (event.target as HTMLInputElement).value;
        }
    };

    const name = variableHook("stateName", "Simone", controllerName);

    return (
        <div data-jsmvcfw-controllerName="Index">
            {viewLoader(variableObject)}
            <aside data-jsmvcfw-controllerName="Alert" />
            <aside data-jsmvcfw-controllerName="Dialog" />
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">{viewSpecFile(variableObject)}</div>
                <div class="right">
                    {/*viewClientTemplate(variableObject)*/}
                    {/*viewVideoTemplate(variableObject)*/}
                    {/*viewUploadTemplate(variableObject)*/}
                    <button onclick={onClick}>Inverti ordine</button>
                    <div class="test-list">
                        {(() => {
                            const result: IvirtualNode[] = [];

                            for (let a = 0; a < variableObject.listState.state.length; a++) {
                                const item = variableObject.listState.state[a];

                                result.push(
                                    <div key={item.id} className="test-item">
                                        <label>{item.label}</label>
                                        <input type="text" value={item.value} onInput={(event: Event) => onInput(event, item)} />
                                    </div>
                                );
                            }

                            return result;
                        })()}
                    </div>
                    <div>
                        <p>Test1 {name.state}</p>
                        <input
                            type="text"
                            name="name1"
                            value={name.state}
                            onInput={(event: Event) => name.setState((event.target as HTMLInputElement).value)}
                        />
                    </div>
                    <div>
                        <p>Test2 {variableObject.name.state}</p>
                        <input
                            type="text"
                            name="name2"
                            value={variableObject.name.state}
                            onInput={(event: Event) => methodObject.onInputUpdateName(event)}
                        />
                        <p>{variableObject.count.state}</p>
                        <button onClick={methodObject.onClickCount}>Count</button>
                        <button onClick={methodObject.onClickOpen}>Open</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
