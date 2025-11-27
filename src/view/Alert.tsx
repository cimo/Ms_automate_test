import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelAlert from "../model/Alert";

const viewAlert = (variableObject: modelAlert.Ivariable, methodObject: modelAlert.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-elementHookName="clsAlert" class={`view_alert ${variableObject.className.state}`}>
            <div class="cls_alert_surface">
                <div class="cls_alert_label">{variableObject.label.state}</div>
                <div class="cls_alert_action">
                    <i
                        class="cls_alert_icon"
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
