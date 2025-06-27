// Soruce
import { IvariableListA } from "../model/Test";

const viewTest = (variableList: IvariableListA): string => {
    return `<div>
        <h1>Benvenuto nel framework!</h1>
        <div>
            <p class="${variableList.className.state}">Contatore: <span>${variableList.count.state}</span></p>
            <button id="btn">Incrementa</button>
            ${(() => {
                const result: string[] = [];

                for (const [key, value] of Object.entries(variableList.list.state)) {
                    const index = parseInt(key);

                    result.push(`<p>${index} - ${value}</p>`);
                }

                return result.join("");
            })()}
        </div>
    </div>`;
};

export default viewTest;
