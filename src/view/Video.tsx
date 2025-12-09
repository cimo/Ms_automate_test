import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as modelIndex from "../model/Index";

const viewVideo = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_video">
            <colgroup>
                <col class="cell" />
            </colgroup>
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
                        <div class="field_container">
                            <label for="videoName">Filename</label>
                            <input
                                jsmvcfw-elementHookName="inputVideoName"
                                id="videoName"
                                name="videoName"
                                type="text"
                                class="cls_input_text field_value"
                                value=""
                            />
                        </div>
                        <div class="button_container">
                            <button
                                class="cls_button cls_button_primary"
                                onclick={() => {
                                    methodObject.onClickVideoLoad();
                                }}
                            >
                                <span class="cls_button_label">Load</span>
                            </button>
                        </div>
                        <ul class="item">
                            {(() => {
                                const result: IvirtualNode[] = [];

                                for (const [key, value] of Object.entries(variableObject.videoList.state)) {
                                    const index = parseInt(key);

                                    result.push(
                                        <li key={key}>
                                            <i
                                                class="cls_button cls_button_remove cls_icon"
                                                onclick={() => {
                                                    methodObject.onClickVideoDelete(index, value);
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
                                        <p class="name">{variableObject.videoSrc.state.split("/").pop()}</p>
                                        <video
                                            controls
                                            src={`${variableObject.videoSrc.state}?nocache=${Date.now()}`}
                                            onerror={() => {
                                                methodObject.onErrorVideo();
                                            }}
                                        ></video>
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
