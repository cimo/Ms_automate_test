import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewVideo = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_video">
            <thead class="filter">
                <tr className="row filter_action"></tr>
                <tr class="row not_hover">
                    <th class="cell column_title">Video</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row not_hover">
                    <td class="cell">
                        <ul class="instruction">
                            <li>The video are created for each test and will be available when the execution will be completed.</li>
                            <li>For search it write the name, present in the "Filename" table column, inside the input and click on the button.</li>
                            <li>Click on the generated list item for load the specific video.</li>
                        </ul>
                        <div class="button_container">
                            <div class="field_container">
                                <label class="mdc-text-field mdc-text-field--outlined field_value">
                                    <span class="mdc-notched-outline">
                                        <span class="mdc-notched-outline__leading"></span>
                                        <span class="mdc-notched-outline__notch">
                                            <span class="mdc-floating-label">Filename</span>
                                        </span>
                                        <span class="mdc-notched-outline__trailing"></span>
                                    </span>
                                    <input id="mdcTextFieldVideoName" name="videoName" type="text" class="mdc-text-field__input" />
                                </label>
                            </div>
                            <div class="mdc-touch-target-wrapper">
                                <button
                                    class="mdc-button mdc-button--raised mdc-button--leading button_primary"
                                    onclick={() => {
                                        methodObject.onClickVideoLoad();
                                    }}
                                >
                                    <span class="mdc-button__ripple"></span>
                                    <span class="mdc-button__label">
                                        <p>Load</p>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <ul class="item">
                            {(() => {
                                const result: IvirtualNode[] = [];

                                for (const [key, value] of Object.entries(variableObject.videoList.state)) {
                                    result.push(
                                        <li key={key}>
                                            <i
                                                class="mdc-button__icon material-icons"
                                                aria-hidden="true"
                                                onclick={(event: Event) => {
                                                    methodObject.onClickVideoDelete(event, value);
                                                }}
                                            >
                                                delete
                                            </i>
                                            <p
                                                onclick={() => {
                                                    methodObject.onClickVideoShow(value);
                                                }}
                                            >
                                                {value}
                                            </p>
                                        </li>
                                    );
                                }

                                return result;
                            })()}
                        </ul>
                        {(() => {
                            const result: IvirtualNode[] = [];

                            if (variableObject.videoSrc.state !== "") {
                                result.push(
                                    <div>
                                        <p class="video_name">{variableObject.videoSrc.state.split("/").pop()}</p>
                                        <video controls src={variableObject.videoSrc.state}></video>
                                    </div>
                                );
                            }

                            return result;
                        })()}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default viewVideo;
