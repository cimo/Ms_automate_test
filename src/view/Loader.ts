import { Iview } from "@cimo/jsmvcfw/dist/JsMvcFwInterface";

// Source

const viewLoader = (): Iview => {
    const template = String.raw`
    <aside class="view_loader">
        <div class="container">
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <p class="text">
                Loading...
            </p>
        </div>
    </aside>`;

    return {
        template
    };
};

export default viewLoader;
