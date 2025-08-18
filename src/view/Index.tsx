import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";
import viewLoader from "../view/Loader";
import viewSpecFile from "../view/SpecFile";
import viewClient from "../view/Client";
import viewVideo from "../view/Video";

const viewIndex = (variableObject: modelIndex.Ivariable, methodObject: modelIndex.Imethod): IvirtualNode => {
    return (
        <div data-jsmvcfw-controllerName="Index">
            {viewLoader(variableObject)}
            <aside data-jsmvcfw-controllerName="Alert" />
            <aside data-jsmvcfw-controllerName="Dialog" />
            <div class="page_container view_index">
                <div class="header"></div>
                <div class="left">{viewSpecFile(variableObject, methodObject)}</div>
                <div class="right">
                    {viewClient(variableObject)}
                    {viewVideo(variableObject, methodObject)}
                    {/*viewUploadTemplate(variableObject)*/}
                </div>
            </div>
        </div>
    );
};

export default viewIndex;
