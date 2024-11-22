import { Iview } from "../jsmvcfw/JsMvcFwInterface";

// Source

const viewClient = (): Iview => {
    const template = String.raw`
    <table class="table_client">
        <tbody>
            <tr class="row not_hover">
                <td class="cell">
                    <p>
                        Client connected:
                    </p>
                    <ul class="item"></ul>
                </td>
            </tr>
        </tbody>
    </table>`;

    return {
        template
    };
};

export default viewClient;
