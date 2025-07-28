import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelDialog from "../model/Dialog";

const viewDialog = (variableList: ModelDialog.IvariableList, methodList: ModelDialog.ImethodList): IvirtualNode => {
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
                    <h2 class="mdc-dialog__title">{variableList.title.state}</h2>
                    <div class="mdc-dialog__content">{variableList.content.state}</div>
                    <div class="mdc-dialog__actions">
                        <button type="button" class="mdc-button mdc-dialog__button button_primary" onClick={methodList.onClickAccept}>
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">OK</span>
                        </button>
                        <button type="button" class="mdc-button mdc-dialog__button button_flat" onClick={methodList.onClickClose}>
                            <div class="mdc-button__ripple"></div>
                            <span class="mdc-button__label">Cancel</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mdc-dialog__scrim"></div>
        </div>
    );
};

export default viewDialog;
