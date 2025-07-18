import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelAlert from "../model/Alert";

const viewAlert = (variableList: ModelAlert.IvariableList, methodList: ModelAlert.ImethodList): IvirtualNode => {
    return (
        <aside class={`mdc-snackbar mdc-snackbar--stacked view_alert ${variableList.className.state}`} data-jsMvcFw_skip data-jsMvcFw_state>
            <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div class="mdc-snackbar__label" aria-atomic="false" data-jsMvcFw_state>
                    {variableList.label.state}
                </div>
                <div class="mdc-snackbar__actions" aria-atomic="true">
                    <i class="mdc-snackbar__action mdc-button__icon material-icons" aria-hidden="true" onClick={methodList.onClickClose}>
                        close
                    </i>
                </div>
            </div>
        </aside>
    );
};

export default viewAlert;
