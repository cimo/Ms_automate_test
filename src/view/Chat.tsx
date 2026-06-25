import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as helperSrc from "../HelperSrc";
import * as modelIndex from "../model/Index";

const viewChat = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div>
            <div class={() => `view_chat ${variableObject.isChatVisible.state ? "" : "hidden"}`}>
                <div class="wrapper">
                    <div class="header">
                        <i
                            class="cls_icon cls_button"
                            onClick={() => {
                                methodObject.onClickChatClose();
                            }}
                        >
                            close
                        </i>
                    </div>
                    <p>Client: {() => variableObject.clientIdSelected.state}</p>
                    <div class="message_received_wrapper">
                        {() => {
                            const resultList: IvirtualNode[] = [];

                            const entryList = Object.entries(variableObject.chatMessageList.state);

                            for (const [key, value] of entryList) {
                                resultList.push(
                                    <p key={key}>
                                        <span class="time">{helperSrc.localeFormat(new Date(value.time))}</span>
                                        <span class="text">
                                            {() =>
                                                value.fromClientId === variableObject.clientIdCurrent.state ? `You: ${value.content}` : value.content
                                            }
                                        </span>
                                    </p>
                                );
                            }

                            return resultList;
                        }}
                    </div>
                    <div class="field_wrapper">
                        <label for="messageSend">Message to send</label>
                        <textarea
                            jsmvcfw-elementHookName="inputChatMessageSend"
                            id="messageSend"
                            name="messageSend"
                            class="cls_textarea field_value"
                            rows="4"
                        ></textarea>
                    </div>
                    <div class="button_wrapper">
                        <button
                            class="cls_button cls_button_primary"
                            onClick={() => {
                                methodObject.onSendChatMessage();
                            }}
                        >
                            <span class="cls_button_label">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewChat;
