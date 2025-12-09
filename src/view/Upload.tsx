import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as modelIndex from "../model/Index";

const viewUpload = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <table class="table_upload">
            <colgroup>
                <col class="cell" />
            </colgroup>
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
                            <button
                                class="cls_button cls_button_primary"
                                onclick={() => {
                                    methodObject.onClickChooseFile();
                                }}
                            >
                                <span class="cls_button_label">Choose file</span>
                            </button>
                            <button
                                class="cls_button cls_button_primary"
                                onclick={() => {
                                    methodObject.onClickUpload();
                                }}
                            >
                                <span class="cls_button_label">Upload</span>
                            </button>
                        </div>
                        <input jsmvcfw-elementHookName="inputSpecUpload" class="input_upload" name="fileName" type="file" value="" />
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default viewUpload;
