import { IvirtualNode } from "../JsMvcFwInterface";
import jsxFactory from "../JsMvcFwJsx";

// Source
import * as ModelIndex from "../model/Index";

const viewLoader = (variableList: ModelIndex.IvariableList): IvirtualNode => {
    return (
        <aside class="view_loader" style={`display: ${variableList.isLoading.state ? "block" : "none"}`}>
            <div class="container">
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
                <div class="square"></div>
                <p class="text">Loading...</p>
            </div>
        </aside>
    );
};

export default viewLoader;
