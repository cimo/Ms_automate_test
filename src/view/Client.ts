import { Iview } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";

// Source
import { IvariableList } from "../model/Index";

const viewClient = (variableList: IvariableList): Iview => {
    const clientListState = variableList.clientList.state;

    const template = String.raw`
    <table class="table_client">
        <tbody>
            <tr class="row not_hover">
                <td class="cell">
                    <p>
                        Client connected:
                    </p>
                    <ul class="item" data-section-bind="clientList">
                        ${(() => {
                            const result: string[] = [];

                            for (const [, value] of Object.entries(clientListState)) {
                                result.push(`<li>
                                    <i class="mdc-button__icon material-icons" aria-hidden="true">person</i>
                                    <p>${value}</p>
                                </li>`);
                            }

                            return result.join("");
                        })()}
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>`;

    return {
        template
    };
};

export default viewClient;
