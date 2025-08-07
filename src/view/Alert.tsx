import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as modelAlert from "../model/Alert";

const viewAlert = (variableList: modelAlert.Ivariable, methodList: modelAlert.Imethod): IvirtualNode => {
    return (
        <div class={`mdc-snackbar mdc-snackbar--stacked view_alert ${variableList.className.state}`}>
            <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div class="mdc-snackbar__label" aria-atomic="false">
                    {variableList.label.state}
                </div>
                <div class="mdc-snackbar__actions" aria-atomic="true">
                    <i class="mdc-snackbar__action mdc-button__icon material-icons" aria-hidden="true" onClick={methodList.onClickClose}>
                        close
                    </i>
                </div>
            </div>
        </div>
    );
};

export default viewAlert;
