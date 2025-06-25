// view.ts

export const pageIndex = (vars: Record<string, any>): { template: string } => {
    return {
        template: `
            <div>
                <h1>Benvenuto nel framework!</h1>
                <div>
                    <p>Contatore: <span>${vars.count.state}</span></p>
                    <button id="btn">Incrementa</button>
                    ${(() => {
                        const result: string[] = [];
                        for (const [key, value] of Object.entries(vars.list.state)) {
                            const index = parseInt(key);
                            result.push(`<p>${index} - ${value}</p>`);
                        }
                        return result.join("");
                    })()}
                </div>
            </div>
        `
    };
};
