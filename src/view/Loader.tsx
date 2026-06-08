import { jsxFactory, IvirtualNode } from "@cimo/jsmvcfw/dist/src/Main.js";

// Source
import * as modelIndex from "../model/Index";

const viewLoader = (variableObject: modelIndex.Ivariable): IvirtualNode => {
    return (
        <div>
            {(() => {
                const resultList: IvirtualNode[] = [];

                if (variableObject.isLoading.state) {
                    resultList.push(
                        <aside class="view_loader">
                            <div class="wrapper">
                                <div class="square"></div>
                                <div class="square"></div>
                                <div class="square"></div>
                                <div class="square"></div>
                                <p class="text">Loading...</p>
                            </div>
                        </aside>
                    );
                }

                return resultList;
            })()}
        </div>
    );
};

export default viewLoader;
