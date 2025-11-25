import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";
import viewClient from "../view/Client";
import viewVideo from "../view/Video";
import viewUpload from "../view/Upload";
import viewChat from "../view/Chat";

const viewIndex = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div jsmvcfw-controllerName="Index">
            {viewLoader(variableObject)}
            <aside jsmvcfw-controllerName="Alert" />
            <aside jsmvcfw-controllerName="Dialog" />
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">{viewSpecFile(variableObject, methodObject)}</div>
                <div class="right">
                    {viewClient(variableObject, methodObject)}
                    {viewVideo(variableObject, methodObject)}
                    {viewUpload(variableObject, methodObject)}
                </div>
                <div class="footer"></div>
            </div>
            {viewChat(variableObject, methodObject)}
        </div>
    );
};

export default viewIndex;
