import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewSpecFile = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_data">
            <colgroup>
                <col class="cell column_id" />
                <col class="cell column_title" />
                <col class="cell column_action" />
                <col class="cell column_time" />
                <col class="cell column_status" />
            </colgroup>
            <thead class="filter">
                <tr className="row filter_action"></tr>
                <tr class="row not_hover">
                    <th class="cell">Id</th>
                    <th class="cell">Filename</th>
                    <th class="cell">Action</th>
                    <th class="cell">Time</th>
                    <th class="cell">Status</th>
                </tr>
            </thead>
            <tbody>
                {(() => {
                    const result: IvirtualNode[] = [];

                    for (const [key, value] of Object.entries(variableObject.specFileList.state)) {
                        const index = parseInt(key);

                        const outputPhase = variableObject.outputList.state[index] ? variableObject.outputList.state[index].phase : "";
                        const outputTime = variableObject.outputList.state[index] ? variableObject.outputList.state[index].time : "";

                        result.push(
                            <tr key={index} class="row">
                                <td class="cell column_id">
                                    <p>{index + 1}</p>
                                </td>
                                <td class="cell column_title">
                                    <p title={value}>{value}</p>
                                </td>
                                <td class="cell column_action">
                                    <div class="field_container">
                                        <label for={`browser_${index}`}></label>
                                        <select
                                            jsmvcfw-elementHookName={`selectBrowserName_${index}`}
                                            class="cls_select field_value"
                                            id={`browser_${index}`}
                                            name="browser"
                                        >
                                            <option value="">Select browser</option>
                                            <option value="desktop_chrome">Desktop - Chrome</option>
                                            <option value="desktop_edge">Desktop - Edge</option>
                                            <option value="desktop_firefox">Desktop - Firefox</option>
                                            <option value="desktop_safari">Desktop - Safari</option>
                                            <option value="mobile_android">Mobile - Android</option>
                                            <option value="mobile_ios">Mobile - Ios</option>
                                        </select>
                                    </div>
                                    {(() => {
                                        const result: IvirtualNode[] = [];

                                        const label = outputPhase !== "running" ? "start" : "stop";

                                        result.push(
                                            <button
                                                class={`cls_button cls_button_primary ${label}`}
                                                onclick={() => {
                                                    methodObject.onClickRun(index, value);
                                                }}
                                            >
                                                <span class="cls_button_label">
                                                    <i class="cls_button_icon">{label}</i>
                                                </span>
                                            </button>
                                        );

                                        return result;
                                    })()}
                                </td>
                                <td class="cell column_time">
                                    <p>{outputTime}</p>
                                </td>
                                <td class="cell column_status">
                                    {(() => {
                                        const result: IvirtualNode[] = [];

                                        if (outputPhase === "running") {
                                            result.push(<i class="cls_button cls_button_icon icon_loading">cached</i>);
                                        } else if (outputPhase !== "" && outputPhase !== "running") {
                                            result.push(
                                                <button
                                                    class="cls_button cls_button_flat"
                                                    onclick={() => {
                                                        methodObject.onClickLogRun(index);
                                                    }}
                                                >
                                                    <span class="cls_button_label">
                                                        {(() => {
                                                            const result: IvirtualNode[] = [];

                                                            if (outputPhase === "success") {
                                                                result.push(<i class="cls_button_icon icon_success">done</i>);
                                                            } else if (outputPhase === "error") {
                                                                result.push(<i class="cls_button_icon icon_fail">priority_high</i>);
                                                            }

                                                            return result;
                                                        })()}
                                                    </span>
                                                </button>
                                            );
                                        }

                                        return result;
                                    })()}
                                </td>
                            </tr>
                        );
                    }

                    return result;
                })()}
            </tbody>
        </table>
    );
};

export default viewSpecFile;
