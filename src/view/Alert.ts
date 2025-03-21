import { Iview } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";

// Source

const viewAlert = (): Iview => {
    const template = String.raw`
    <aside class="mdc-snackbar mdc-snackbar--stacked view_alert">
        <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
            <div class="mdc-snackbar__label" aria-atomic="false"></div>
            <div class="mdc-snackbar__actions" aria-atomic="true">
                <i class="mdc-snackbar__action mdc-button__icon material-icons"
                    aria-hidden="true">
                    close
                </i>
            </div>
        </div>
    </aside>`;

    return {
        template
    };
};

export default viewAlert;
