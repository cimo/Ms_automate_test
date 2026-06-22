import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

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
                    const resultList: IvirtualNode[] = [];

                    for (const [key, value] of Object.entries(variableObject.specFileList.state)) {
                        const index = parseInt(key);

                        const outputPhase = variableObject.outputList.state[index] ? variableObject.outputList.state[index].phase : "";
                        const outputTime = variableObject.outputList.state[index] ? variableObject.outputList.state[index].time : "";

                        resultList.push(
                            <tr key={index} class="row">
                                <td class="cell column_id">
                                    <p>{index + 1}</p>
                                </td>
                                <td class="cell column_title">
                                    <p title={value}>{value}</p>
                                </td>
                                <td class="cell column_action">
                                    <div class="field_wrapper">
                                        <label for={`browser_${index}`}></label>
                                        <select
                                            jsmvcfw-elementHookName={`selectBrowserNameList_${index}`}
                                            class="cls_select field_value"
                                            id={`browser_${index}`}
                                            name="browser"
                                        >
                                            <option value="">Select</option>
                                            <option value="desktop_chrome">Desktop - Chrome</option>
                                            <option value="desktop_edge">Desktop - Edge</option>
                                            <option value="desktop_firefox">Desktop - Firefox</option>
                                            <option value="desktop_safari">Desktop - Safari</option>
                                            <option value="mobile_android">Mobile - Android</option>
                                            <option value="mobile_ios">Mobile - Ios</option>
                                        </select>
                                    </div>
                                    {(() => {
                                        const resultList: IvirtualNode[] = [];

                                        const label = outputPhase !== "running" ? "start" : "stop";

                                        resultList.push(
                                            <button
                                                class={`cls_button cls_button_primary ${label}`}
                                                onClick{() => {
                                                    methodObject.onClickRun(index, value);
                                                }}
                                            >
                                                <span class="cls_button_label">
                                                    <i class="cls_icon">{label}</i>
                                                </span>
                                            </button>
                                        );

                                        return resultList;
                                    })()}
                                </td>
                                <td class="cell column_time">
                                    <p>{outputTime}</p>
                                </td>
                                <td class="cell column_status">
                                    {(() => {
                                        const resultList: IvirtualNode[] = [];

                                        if (outputPhase === "running") {
                                            resultList.push(<i class="cls_icon cls_button icon_loading">cached</i>);
                                        } else if (outputPhase !== "" && outputPhase !== "running") {
                                            resultList.push(
                                                <button
                                                    class="cls_button cls_button_flat"
                                                    onClick{() => {
                                                        methodObject.onClickLogRun(index);
                                                    }}
                                                >
                                                    <span class="cls_button_label">
                                                        {(() => {
                                                            const resultList: IvirtualNode[] = [];

                                                            if (outputPhase === "success") {
                                                                resultList.push(<i class="cls_icon cls_button icon_success">done</i>);
                                                            } else if (outputPhase === "error") {
                                                                resultList.push(<i class="cls_icon cls_button icon_fail">priority_high</i>);
                                                            }

                                                            return resultList;
                                                        })()}
                                                    </span>
                                                </button>
                                            );
                                        }

                                        return resultList;
                                    })()}
                                </td>
                            </tr>
                        );
                    }

                    return resultList;
                })()}
            </tbody>
        </table>
    );
};

export default viewSpecFile;
