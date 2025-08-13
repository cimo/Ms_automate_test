import { IvirtualNode, jsxFactory } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelDialog from "../model/Dialog";

const viewDialog = (variableObject: modelDialog.Ivariable, methodObject: modelDialog.Imethod): IvirtualNode => {
    return (
        <div class="mdc-dialog view_dialog">
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
                        {(() => {
                            const result: IvirtualNode[] = [];

                            if (!variableObject.isSingleButton.state) {
                                result.push(
                                    <button type="button" class="mdc-button mdc-dialog__button button_flat" onClick={methodObject.onClickClose}>
                                        <div class="mdc-button__ripple"></div>
                                        <span class="mdc-button__label">Cancel</span>
                                    </button>
                                );
                            }

                            return result;
                        })()}
                        <button type="button" class="mdc-button mdc-dialog__button button_primary" onClick={methodObject.onClickAccept}>
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
