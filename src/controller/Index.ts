// controller.ts

import { renderTemplate } from "../JsFw";
import { pageIndex } from "../view/Index";

const vars = {
    count: { state: 0 },
    list: { state: ["uno", "due"] }
};

function renderComponent() {
    const { template } = pageIndex(vars);
    renderTemplate(template);
}

export function startApp() {
    renderComponent();

    document.getElementById("btn")!.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target) {
            // eslint-disable-next-line no-console
            console.log("cimo", vars);

            vars.count.state++;
            vars.list.state = ["uno", "due", "tre"];
            renderComponent();
        }
    });
}
