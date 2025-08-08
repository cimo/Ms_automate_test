import { Iview } from "../JsMvcFwInterface";

// Source

const viewVideo = (): Iview => {
    const template = String.raw`
    <table class="table_video">
        <tbody>
            <tr class="row not_hover">
                <td class="cell">
                    <p>
                        Video:<br /><br />
                        Will be avaliable after the execution test.<br />Write
                        the "Filename", present in the list, inside the
                        input and click on the button.<br />Click on the
                        generated list item for load the specific video.
                    </p>
                    <div class="field_container">
                        <label class="mdc-text-field mdc-text-field--outlined field_value input_video">
                            <span class="mdc-notched-outline">
                                <span class="mdc-notched-outline__leading">

                                </span>
                                <span class="mdc-notched-outline__notch">
                                    <span class="mdc-floating-label">
                                        Test name
                                    </span>
                                </span>
                                <span class="mdc-notched-outline__trailing">

                                </span>
                            </span>
                            <input type="text"
                                class="mdc-text-field__input" />
                        </label>
                    </div>
                    <div class="mdc-touch-target-wrapper">
                        <button class="mdc-button mdc-button--raised mdc-button--leading button_primary button_load">
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">
                                <i class="mdc-button__icon material-icons"
                                    aria-hidden="true">
                                    movie
                                </i> Load
                            </span>
                        </button>
                    </div>
                    <ul class="item"></ul>
                    <video controls class="video"></video>
                </td>
            </tr>
        </tbody>
    </table>`;

    return {
        template
    };
};

export default viewVideo;
