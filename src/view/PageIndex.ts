import { Iview } from "../jsmvcfw/JsMvcFwInterface";

// Source

const viewPageIndex = (
    viewLoaderTemplate: string,
    viewAlertTemplate: string,
    viewDialogTemplate: string,
    viewSpecFileTemplate: string,
    viewClientTemplate: string,
    viewVideoTemplate: string,
    viewUploadTemplate: string
): Iview => {
    const template = String.raw`
    ${viewLoaderTemplate}
    ${viewAlertTemplate}
    ${viewDialogTemplate}
    <div class="page_container">
        <div class="header"></div>
        <div class="left"></div>
        <div class="right">
            <div class="view_index">
                <div class="left">
                    ${viewSpecFileTemplate}
                </div>
                <div class="right">
                    ${viewClientTemplate}
                    ${viewVideoTemplate}
                    ${viewUploadTemplate}
                </div>
            </div>
        </div>
    </div>`;

    return {
        template
    };
};

export default viewPageIndex;
