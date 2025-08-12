import { IvirtualNode, jsxFactory } from "@cimo/jsmvcfw/dist/src/Main";

// Source
import * as modelIndex from "../model/Index";

const viewLoader = (variableList: modelIndex.Ivariable): IvirtualNode => {
    return (
        <div>
            {(() => {
                const result: IvirtualNode[] = [];

                if (variableList.isLoading.state) {
                    result.push(
                        <aside class="view_loader">
                            <div class="container">
                                <div class="square"></div>
                                <div class="square"></div>
                                <div class="square"></div>
                                <div class="square"></div>
                                <p class="text">Loading...</p>
                            </div>
                        </aside>
                    );
                }

                return result;
            })()}
        </div>
    );
};

export default viewLoader;
