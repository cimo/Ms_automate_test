import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelDialog from "../model/Dialog";

const viewDialog = (variableObject: modelDialog.Ivariable, methodObject: modelDialog.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-elementHookName="mdcDialog" class="mdc-dialog view_dialog">
            <div class="mdc-dialog__container">
                <div
                    class="mdc-dialog__surface"
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="my-dialog-title"
                    aria-describedby="my-dialog-content"
                >
                    <h2 class="mdc-dialog__title">{variableObject.title.state}</h2>
                    <div class="mdc-dialog__content">{variableObject.content.state}</div>
                    <div class="mdc-dialog__actions">
                        <button
                            type="button"
                            class={`mdc-button mdc-dialog__button button_flat ${variableObject.isSingleButton.state ? "hidden" : ""}`}
                            onclick={() => {
                                methodObject.onClickClose();
                            }}
                        >
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">Cancel</span>
                        </button>
                        <button
                            type="button"
                            class="mdc-button mdc-dialog__button button_primary"
                            onclick={() => {
                                methodObject.onClickAccept();
                            }}
                        >
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">OK</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mdc-dialog__scrim"></div>
        </div>
    );
};

export default viewDialog;
