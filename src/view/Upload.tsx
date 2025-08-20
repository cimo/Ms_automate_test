import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewUpload = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_upload">
            <thead class="filter">
                <tr className="row filter_action"></tr>
                <tr class="row not_hover">
                    <th class="cell column_title">Upload</th>
                </tr>
            </thead>
            <tbody>
                <tr class="row not_hover">
                    <td class="cell">
                        <ul class="instruction">
                            <li>This is a temporary file and will be delete on deploy phase.</li>
                            <li>If you need a stable file you need create a PR.</li>
                        </ul>
                        <p class="name">{variableObject.uploadFileName.state}</p>
                        <div class="button_container">
                            <div class="mdc-touch-target-wrapper">
                                <button
                                    class="mdc-button mdc-button--raised mdc-button--leading button_primary"
                                    onclick={() => {
                                        methodObject.onClickChooseFile();
                                    }}
                                >
                                    <span class="mdc-button__ripple"></span>
                                    <span class="mdc-button__label">Choose file</span>
                                </button>
                            </div>
                            <div class="mdc-touch-target-wrapper">
                                <button
                                    class="mdc-button mdc-button--raised mdc-button--leading button_primary"
                                    onclick={() => {
                                        methodObject.onClickUpload();
                                    }}
                                >
                                    <span class="mdc-button__ripple"></span>
                                    <span class="mdc-button__label">Upload</span>
                                </button>
                            </div>
                        </div>
                        <input jsmvcfw-elementHook="inputSpecUpload" class="input_upload" name="fileName" type="file" value="" />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default viewUpload;
