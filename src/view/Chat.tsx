import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as helperSrc from "../HelperSrc";
import * as modelIndex from "../model/Index";

const viewChat = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div>
            <div class={`view_chat ${variableObject.isChatVisible.state ? "" : "hidden"}`}>
                <div class="container">
                    <div class="header">
                        <i
                            class="cls_button cls_icon"
                            onclick={() => {
                                methodObject.onClickChatClose();
                            }}
                        >
                            close
                        </i>
                    </div>
                    <p>Client: {variableObject.clientIdSelected.state}</p>
                    <div class="message_received_container">
                        {(() => {
                            const result: IvirtualNode[] = [];

                            const list = Object.entries(variableObject.chatMessageList.state);

                            for (const [key, chatMessage] of list) {
                                result.push(
                                    <p key={key}>
                                        <span class="time">{helperSrc.localeFormat(new Date(chatMessage.time))}</span>
                                        <span class="text">
                                            {chatMessage.fromClientId === variableObject.clientIdCurrent.state
                                                ? `You: ${chatMessage.content}`
                                                : chatMessage.content}
                                        </span>
                                    </p>
                                );
                            }

                            return result;
                        })()}
                    </div>
                    <div class="field_container">
                        <label for="messageSend">Message to send</label>
                        <textarea
                            jsmvcfw-elementHookName="inputChatMessageSend"
                            id="messageSend"
                            name="messageSend"
                            class="cls_textarea field_value"
                            rows="4"
                        ></textarea>
                    </div>
                    <div class="button_container">
                        <button
                            class="cls_button cls_button_primary"
                            onclick={() => {
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
