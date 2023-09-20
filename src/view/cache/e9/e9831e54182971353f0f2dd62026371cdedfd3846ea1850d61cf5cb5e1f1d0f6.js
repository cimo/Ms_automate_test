module.exports = (TwingTemplate) => {
    return new Map([
        [0, class extends TwingTemplate {
            constructor(environment) {
                super(environment);

                this._source = new this.Source(``, `/home/root/src/view/index.twig`);

                let aliases = new this.Context();
                aliases.proxy[`_self`] = this.aliases.proxy[`_self`] = this;
            }

            async doDisplay(context, outputBuffer, blocks = new Map()) {
                let aliases = this.aliases.clone();

                outputBuffer.echo(`<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'self'; script-src 'self'"
        />
        <meta
            http-equiv="X-Content-Security-Policy"
            content="default-src 'self'; script-src 'self'"
        />
        <link rel="icon" href="./image/logo.ico" />
        <link rel="stylesheet" href="./style/main.css" type="text/css" />
        <title>ms_automate_test</title>
    </head>
    <body>
        <p>Test list:</p>
        <ul>
            `);
                context.set('_parent', context.clone());

                await (async () => {
                    let c = this.ensureTraversable((context.has(`testList`) ? context.get(`testList`) : null));

                    if (c === context) {
                        context.set('_seq', context.clone());
                    }
                    else {
                        context.set('_seq', c);
                    }
                })();

                context.set('loop', new Map([
                  ['parent', context.get('_parent')],
                  ['index0', 0],
                  ['index', 1],
                  ['first', true]
                ]));
                if ((typeof context.get('_seq') === 'object') && this.isCountable(context.get('_seq'))) {
                    let length = this.count(context.get('_seq'));
                    let loop = context.get('loop');
                    loop.set('revindex0', length - 1);
                    loop.set('revindex', length);
                    loop.set('length', length);
                    loop.set('last', (length === 1));
                }
                await this.iterate(context.get('_seq'), async (__key__, __value__) => {
                    context.proxy[`key`] = __key__;
                    context.proxy[`item`] = __value__;
                    outputBuffer.echo(`            <li>
                <p>`);
                    outputBuffer.echo(await this.environment.getFilter('escape').traceableCallable(22, this.source)(...[this, ((context.has(`key`) ? context.get(`key`) : null) + 1), `html`, null, true]));
                    outputBuffer.echo(` - `);
                    outputBuffer.echo(await this.environment.getFilter('escape').traceableCallable(22, this.source)(...[this, (context.has(`item`) ? context.get(`item`) : null), `html`, null, true]));
                    outputBuffer.echo(`</p>
                <button class="execute_test_`);
                    outputBuffer.echo(await this.environment.getFilter('escape').traceableCallable(23, this.source)(...[this, (context.has(`key`) ? context.get(`key`) : null), `html`, null, true]));
                    outputBuffer.echo(`">Execute test</button>
            </li>
            `);
                    (() => {
                        let loop = context.get('loop');
                        loop.set('index0', loop.get('index0') + 1);
                        loop.set('index', loop.get('index') + 1);
                        loop.set('first', false);
                        if (loop.has('length')) {
                            loop.set('revindex0', loop.get('revindex0') - 1);
                            loop.set('revindex', loop.get('revindex') - 1);
                            loop.set('last', loop.get('revindex0') === 0);
                        }
                    })();
                });
                (() => {
                    let parent = context.get('_parent');
                    context.delete('_seq');
                    context.delete('_iterated');
                    context.delete('key');
                    context.delete('item');
                    context.delete('_parent');
                    context.delete('loop');
                    for (let [k, v] of parent) {
                        if (!context.has(k)) {
                            context.set(k, v);
                        }
                    }
                })();
                outputBuffer.echo(`        </ul>
    </body>
</html>
`);
            }

            get isTraitable() {
                return false;
            }

        }],
    ]);
};