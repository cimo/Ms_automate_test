import { Iview } from "../jsmvcfw/JsMvcFwInterface";

// Source

const viewDialog = (): Iview => {
    const template = String.raw`<aside class="mdc-dialog view_dialog">
        <div class="mdc-dialog__container">
            <div class="mdc-dialog__surface"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="my-dialog-title"
                aria-describedby="my-dialog-content">
                <h2 class="mdc-dialog__title"></h2>
                <div class="mdc-dialog__content"></div>
                <div class="mdc-dialog__actions">
                    <button type="button"
                        class="mdc-button mdc-dialog__button button_primary"
                        data-mdc-dialog-action="accept">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">OK</span>
                    </button>
                    <button type="button"
                        class="mdc-button mdc-dialog__button button_flat"
                        data-mdc-dialog-action="close">
                        <div class="mdc-button__ripple"></div>
                        <span class="mdc-button__label">Cancel</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="mdc-dialog__scrim"></div>
    </aside>`;

    return {
        template
    };
};

export default viewDialog;
