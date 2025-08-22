import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewClient = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_client">
            <thead class="filter">
                <tr className="row filter_action"></tr>
                <tr class="row not_hover">
                    <th class="cell column_title">Client connected</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row not_hover">
                    <td class="cell">
                        <ul class="item">
                            {(() => {
                                const result: IvirtualNode[] = [];

                                for (const [key, value] of Object.entries(variableObject.clientList.state)) {
                                    const index = parseInt(key);

                                    result.push(
                                        <li key={key}>
                                            <div class="clientId_container">
                                                <i class="mdc-button__icon material-icons" aria-hidden="true">
                                                    person
                                                </i>
                                                <p
                                                    class={`${variableObject.clientCurrentId.state === value ? "exclude" : ""}`}
                                                    onclick={() => {
                                                        methodObject.onClickClient(index, value);
                                                    }}
                                                >
                                                    {variableObject.clientCurrentId.state === value ? "You" : value}
                                                </p>
                                            </div>

                                            {(() => {
                                                const result: IvirtualNode[] = [];

                                                if (variableObject.clientCurrentId.state === value && !variableObject.isClientConnected.state) {
                                                    result.push(
                                                        <button
                                                            class="mdc-button mdc-button--raised mdc-button--leading button_primary"
                                                            onclick={() => {
                                                                methodObject.onClickConnect();
                                                            }}
                                                        >
                                                            <span class="mdc-button__ripple"></span>
                                                            <span class="mdc-button__label">
                                                                <i class="mdc-button__icon material-icons" aria-hidden="true">
                                                                    lan
                                                                </i>
                                                            </span>
                                                        </button>
                                                    );
                                                }

                                                return result;
                                            })()}
                                        </li>
                                    );
                                }

                                return result;
                            })()}
                        </ul>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default viewClient;
