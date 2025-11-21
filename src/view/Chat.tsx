import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

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
                            class="mdc-button__icon material-icons"
                            aria-hidden="true"
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

                            const list = Object.entries(variableObject.chatMessageReceivedList.state);

                            for (const [key, chatMessageReceived] of list) {
                                const date = new Date(chatMessageReceived.time);

                                result.push(
                                    <p key={key}>
                                        <span class="time">{helperSrc.localeFormat(date)}</span>
                                        <span class="text">{chatMessageReceived.content}</span>
                                    </p>
                                );
                            }

                            return result;
                        })()}
                    </div>
                    <div class="field_container">
                        <label class="mdc-text-field mdc-text-field--outlined mdc-text-field--textarea field_value">
                            <span class="mdc-notched-outline">
                                <span class="mdc-notched-outline__leading"></span>
                                <span class="mdc-notched-outline__notch">
                                    <span class="mdc-floating-label">Message to send</span>
                                </span>
                                <span class="mdc-notched-outline__trailing"></span>
                            </span>
                            <textarea
                                jsmvcfw-elementHookName="inputChatMessageSend"
                                name="messageSend"
                                class="mdc-text-field__input"
                                rows="2"
                                cols="40"
                                aria-label="Label"
                            ></textarea>
                        </label>
                    </div>
                    <div class="mdc-touch-target-wrapper">
                        <button
                            class="mdc-button mdc-button--raised mdc-button--leading button_primary"
                            onclick={() => {
                                methodObject.onSendChatMessage();
                            }}
                        >
                            <span class="mdc-button__ripple"></span>
                            <span class="mdc-button__label">Send</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default viewChat;
