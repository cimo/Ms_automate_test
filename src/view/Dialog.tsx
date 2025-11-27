import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelDialog from "../model/Dialog";

const viewDialog = (variableObject: modelDialog.Ivariable, methodObject: modelDialog.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-elementHookName="clsDialog" class="view_dialog">
            <div class="cls_dialog_surface">
                <h2 class="cls_dialog_title">{variableObject.title.state}</h2>
                <div class="cls_dialog_content">{variableObject.content.state}</div>
                <div class="cls_dialog_action">
                    <button
                        class="cls_button cls_button_primary"
                        onclick={() => {
                            methodObject.onClickAccept();
                        }}
                    >
                        <span class="cls_button_label">OK</span>
                    </button>
                    <button
                        class={`cls_button_flat ${variableObject.isSingleButton.state ? "hidden" : ""}`}
                        onclick={() => {
                            methodObject.onClickClose();
                        }}
                    >
                        <span class="cls_button_label">Cancel</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default viewDialog;
