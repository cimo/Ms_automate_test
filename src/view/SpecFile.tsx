import { IvirtualNode, jsxFactory } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewSpecFile = (variableList: modelIndex.Ivariable): IvirtualNode => {
    /*const specFileListState = variableList.specFileList.state;
    const serverDataOutputState = variableList.outputList.state;

    return `<table class="table_data">
        <thead class="filter">
            <tr className="row filter_action"></tr>
            <tr class="row not_hover">
                <th class="cell column_id">
                    Id
                </th>
                <th class="cell column_title">
                    Filename
                </th>
                <th class="cell column_action">
                    Action
                </th>
                <th class="cell column_time">
                    Time
                </th>
                <th class="cell column_status">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            ${(() => {
                const result: string[] = [];

                for (const [key, value] of Object.entries(specFileListState)) {
                    const index = parseInt(key);

                    const serverDataOutputStateTime = serverDataOutputState[index] ? serverDataOutputState[index].time : "";
                    const serverDataOutputStateStatus = serverDataOutputState[index] ? serverDataOutputState[index].status : "";

                    result.push(`<tr class="row"
                        data-index="${index}">
                        <td class="cell column_id">
                            <p>
                                ${index + 1}
                            </p>
                        </td>
                        <td class="cell column_title">
                            <p>
                                <span class="name">${value}</span>
                            </p>
                        </td>
                        <td class="cell column_action">
                            <div class="field_container">
                                <div class="mdc-select mdc-select--outlined field_value select_browser">
                                    <div class="mdc-select__anchor">
                                        <span class="mdc-notched-outline">
                                            <span class="mdc-notched-outline__leading">

                                            </span>
                                            <span class="mdc-notched-outline__notch">
                                                <span class="mdc-floating-label">
                                                    Browser
                                                </span>
                                            </span>
                                            <span class="mdc-notched-outline__trailing">

                                            </span>
                                        </span>
                                        <span class="mdc-select__selected-text-container">
                                            <span class="mdc-select__selected-text">

                                            </span>
                                        </span>
                                        <span class="mdc-select__dropdown-icon">
                                            <svg class="mdc-select__dropdown-icon-graphic"
                                                viewBox="7 10 10 5"
                                                focusable="false">
                                                <polygon class="mdc-select__dropdown-icon-inactive"
                                                    stroke="none"
                                                    fill-rule="evenodd"
                                                    points="7 10 12 15 17 10"></polygon>
                                                <polygon class="mdc-select__dropdown-icon-active"
                                                    stroke="none"
                                                    fill-rule="evenodd"
                                                    points="7 15 12 10 17 15"></polygon>
                                            </svg>
                                        </span>
                                    </div>
                                    <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                                        <ul class="mdc-deprecated-list"
                                            role="listbox">
                                            <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected"
                                                aria-selected="true"
                                                data-value=""
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="desktop_chrome"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Desktop - Chrome
                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="desktop_edge"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Desktop - Edge
                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="desktop_firefox"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Desktop - Firefox
                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="desktop_safari"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Desktop - Safari
                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="mobile_android"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Mobile - Android
                                                </span>
                                            </li>
                                            <li class="mdc-deprecated-list-item"
                                                aria-selected="false"
                                                data-value="mobile_ios"
                                                role="option">
                                                <span class="mdc-deprecated-list-item__ripple">

                                                </span>
                                                <span class="mdc-deprecated-list-item__text">
                                                    Mobile - Ios
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="mdc-touch-target-wrapper" data-bind="serverDataOutput">
                                 ${(() => {
                                     const result: string[] = [];

                                     const label = serverDataOutputStateStatus !== "running" ? "start" : "stop";

                                     result.push(`<button class="mdc-button mdc-button--raised mdc-button--leading button_primary button_execute ${label}">
                                        <span class="mdc-button__ripple"></span>
                                        <span class="mdc-button__label">
                                            <i class="mdc-button__icon material-icons" aria-hidden="true">${label}</i>
                                        </span>
                                    </button>`);

                                     return result.join("");
                                 })()}
                            </div>
                        </td>
                        <td class="cell column_time">
                            <p data-bind="serverDataOutput">${serverDataOutputStateTime}</p>
                        </td>
                        <td class="cell column_status" data-bind="serverDataOutput">
                            ${(() => {
                                const result: string[] = [];

                                if (serverDataOutputStateStatus === "running") {
                                    result.push(`<i class="mdc-button__icon material-icons icon_loading" aria-hidden="true">cached</i>`);
                                } else if (serverDataOutputStateStatus !== "" && serverDataOutputStateStatus !== "running") {
                                    result.push(`<button class="mdc-button mdc-button--raised mdc-button--leading button_flat">
                                        <span class="mdc-button__ripple"></span>
                                        <span class="mdc-button__label">`);

                                    if (serverDataOutputStateStatus === "success") {
                                        result.push(`<i class="mdc-button__icon material-icons icon_success" aria-hidden="true">done</i>`);
                                    } else if (serverDataOutputStateStatus === "error") {
                                        result.push(`<i class="mdc-button__icon material-icons icon_fail" aria-hidden="true">priority_high</i>`);
                                    }

                                    result.push(`</span>
                                    </button>`);
                                }

                                return result.join("");
                            })()}
                        </td>
                    </tr>`);
                }

                return result.join("");
            })()}
        </tbody>
    </table>`;*/

    return (
        <table class="table_data">
            <thead class="filter">
                <tr className="row filter_action"></tr>
                <tr class="row not_hover">
                    <th class="cell column_id">Id</th>
                    <th class="cell column_title">Filename</th>
                    <th class="cell column_action">Action</th>
                    <th class="cell column_time">Time</th>
                    <th class="cell column_status">Status</th>
                </tr>
            </thead>
            <tbody>
                {(() => {
                    const result: IvirtualNode[] = [];

                    for (const [key, value] of Object.entries(variableList.specFileList.state)) {
                        const index = parseInt(key);

                        const serverDataOutputStateTime = variableList.outputList.state[index] ? variableList.outputList.state[index].time : "";
                        const serverDataOutputStateStatus = variableList.outputList.state[index] ? variableList.outputList.state[index].status : "";

                        result.push(
                            <tr key={index} data-index={index} class="row">
                                <td class="cell column_id">
                                    <p>{index + 1}</p>
                                </td>
                                <td class="cell column_title">
                                    <p class="name">{value}</p>
                                </td>
                                <td class="cell column_action">
                                    <div class="field_container">
                                        <div class="mdc-select mdc-select--outlined field_value select_browser">
                                            <div class="mdc-select__anchor">
                                                <span class="mdc-notched-outline">
                                                    <span class="mdc-notched-outline__leading"></span>
                                                    <span class="mdc-notched-outline__notch">
                                                        <span class="mdc-floating-label">Browser</span>
                                                    </span>
                                                    <span class="mdc-notched-outline__trailing"></span>
                                                </span>
                                                <span class="mdc-select__selected-text-container">
                                                    <span class="mdc-select__selected-text"></span>
                                                </span>
                                                <span class="mdc-select__dropdown-icon">
                                                    <svg class="mdc-select__dropdown-icon-graphic" viewBox="7 10 10 5" focusable="false">
                                                        <polygon
                                                            class="mdc-select__dropdown-icon-inactive"
                                                            stroke="none"
                                                            fill-rule="evenodd"
                                                            points="7 10 12 15 17 10"
                                                        ></polygon>
                                                        <polygon
                                                            class="mdc-select__dropdown-icon-active"
                                                            stroke="none"
                                                            fill-rule="evenodd"
                                                            points="7 15 12 10 17 15"
                                                        ></polygon>
                                                    </svg>
                                                </span>
                                            </div>
                                            <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
                                                <ul class="mdc-deprecated-list" role="listbox">
                                                    <li
                                                        data-value=""
                                                        class="mdc-deprecated-list-item mdc-deprecated-list-item--selected"
                                                        aria-selected="true"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                    </li>
                                                    <li
                                                        data-value="desktop_chrome"
                                                        class="mdc-deprecated-list-item"
                                                        aria-selected="false"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Desktop - Chrome</span>
                                                    </li>
                                                    <li
                                                        data-value="desktop_edge"
                                                        class="mdc-deprecated-list-item"
                                                        aria-selected="false"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Desktop - Edge</span>
                                                    </li>
                                                    <li
                                                        data-value="desktop_firefox"
                                                        class="mdc-deprecated-list-item"
                                                        aria-selected="false"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Desktop - Firefox</span>
                                                    </li>
                                                    <li
                                                        data-value="desktop_safari"
                                                        class="mdc-deprecated-list-item"
                                                        aria-selected="false"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Desktop - Safari</span>
                                                    </li>
                                                    <li
                                                        data-value="mobile_android"
                                                        class="mdc-deprecated-list-item"
                                                        aria-selected="false"
                                                        role="option"
                                                    >
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Mobile - Android</span>
                                                    </li>
                                                    <li data-value="mobile_ios" class="mdc-deprecated-list-item" aria-selected="false" role="option">
                                                        <span class="mdc-deprecated-list-item__ripple"></span>
                                                        <span class="mdc-deprecated-list-item__text">Mobile - Ios</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mdc-touch-target-wrapper">
                                        {(() => {
                                            const result: IvirtualNode[] = [];

                                            const label = serverDataOutputStateStatus !== "running" ? "start" : "stop";

                                            result.push(
                                                <button
                                                    class={`mdc-button mdc-button--raised mdc-button--leading button_primary button_execute ${label}`}
                                                >
                                                    <span class="mdc-button__ripple"></span>
                                                    <span class="mdc-button__label">
                                                        <i class="mdc-button__icon material-icons" aria-hidden="true">
                                                            {label}
                                                        </i>
                                                    </span>
                                                </button>
                                            );

                                            return result;
                                        })()}
                                    </div>
                                </td>
                                <td class="cell column_time">
                                    <p>{serverDataOutputStateTime}</p>
                                </td>
                                <td class="cell column_status">
                                    {(() => {
                                        const result: IvirtualNode[] = [];

                                        if (serverDataOutputStateStatus === "running") {
                                            result.push(
                                                <i class="mdc-button__icon material-icons icon_loading" aria-hidden="true">
                                                    cached
                                                </i>
                                            );
                                        } else if (serverDataOutputStateStatus !== "" && serverDataOutputStateStatus !== "running") {
                                            result.push(
                                                <button class="mdc-button mdc-button--raised mdc-button--leading button_flat">
                                                    <span class="mdc-button__ripple"></span>
                                                    <span class="mdc-button__label">
                                                        {(() => {
                                                            const result: IvirtualNode[] = [];

                                                            if (serverDataOutputStateStatus === "success") {
                                                                result.push(
                                                                    <i class="mdc-button__icon material-icons icon_success" aria-hidden="true">
                                                                        done
                                                                    </i>
                                                                );
                                                            } else if (serverDataOutputStateStatus === "error") {
                                                                result.push(
                                                                    <i class="mdc-button__icon material-icons icon_fail" aria-hidden="true">
                                                                        priority_high
                                                                    </i>
                                                                );
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
