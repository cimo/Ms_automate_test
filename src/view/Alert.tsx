import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelAlert from "../model/Alert";

const viewAlert = (variableObject: modelAlert.Ivariable, methodObject: modelAlert.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-elementHookName="mdcSnackbar" class={`mdc-snackbar mdc-snackbar--stacked view_alert ${variableObject.className.state}`}>
            <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div class="mdc-snackbar__label" aria-atomic="false">
                    {variableObject.label.state}
                </div>
                <div class="mdc-snackbar__actions" aria-atomic="true">
                    <i
                        class="mdc-snackbar__action mdc-button__icon material-icons"
                        aria-hidden="true"
                        onclick={() => {
                            methodObject.onClickClose();
                        }}
                    >
                        close
                    </i>
                </div>
            </div>
        </div>
    );
};

export default viewAlert;
