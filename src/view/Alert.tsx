import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelAlert from "../model/Alert";

const viewAlert = (variableList: ModelAlert.IvariableList): IvirtualNode => {
    return (
        /*<aside class="mdc-snackbar mdc-snackbar--stacked view_alert">
            <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
                <div class="mdc-snackbar__label" aria-atomic="false"></div>
                <div class="mdc-snackbar__actions" aria-atomic="true">
                    <i class="mdc-snackbar__action mdc-button__icon material-icons" aria-hidden="true">
                        close
                    </i>
                </div>
            </div>
        </aside>*/
        <p>{variableList.test.state}</p>
    );
};

export default viewAlert;
