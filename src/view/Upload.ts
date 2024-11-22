import { Iview } from "../jsmvcfw/JsMvcFwInterface";

// Source

const viewUpload = (): Iview => {
    const template = String.raw`
    <table class="table_upload">
        <tbody>
            <tr class="row not_hover">
                <td class="cell">
                    <p>
                        Upload:<br /><br />
                        This is a temporary file and will be delete on deploy
                        phase.<br />If you need a stable file you need
                        create a PR.
                    </p>
                    <div class="field_container">
                        <button class="mdc-button mdc-button--raised mdc-button--leading button_primary button_input_upload_fake">
                            Choose file
                        </button>
                        <input class="input_upload" type="file" value="" />
                    </div>
                    <div class="mdc-touch-target-wrapper">
                        <button class="mdc-button mdc-button--raised mdc-button--leading button_primary button_upload">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">
                                <i class="mdc-button__icon material-icons"
                                    aria-hidden="true">
                                    upload
                                </i> Upload
                            </span>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>`;

    return {
        template
    };
};

export default viewUpload;
