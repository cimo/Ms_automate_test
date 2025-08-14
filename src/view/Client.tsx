import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewClient = (variableObject: modelIndex.Ivariable): IvirtualNode => {
    return (
        <table class="table_client">
            <tbody>
                <tr class="row not_hover">
                    <td class="cell">
                        <p>Client connected:</p>
                        <ul class="item" data-bind="clientList">
                            {(() => {
                                const result: IvirtualNode[] = [];

                                for (const [key, value] of Object.entries(variableObject.userList.state)) {
                                    result.push(
                                        <li key={key}>
                                            <i class="mdc-button__icon material-icons" aria-hidden="true">
                                                person
                                            </i>
                                            <p>{value}</p>
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
