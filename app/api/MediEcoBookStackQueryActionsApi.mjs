import https from "node:https";

export default class MediEcoBookStackQueryActionsApi {

    /**
     * @type {MediEcoBookStackQueryActionsConfig}
     */
    #config;

    constructor(config) {
        this.#config = this.#resolveEnvVariables(config)
    }

    static new(config) {
        return new MediEcoBookStackQueryActionsApi(config)
    }

    async readPageHtml({pageId}) {
        const {server, endpoints, token} = this.#config.settings.boockStack;
        let url = endpoints.readPageExportHtml.path;
        url = url.replace("{" + endpoints.readPageExportHtml.parameters.id.name + "}", pageId);

        const options = this.#createOptions(server, url, token)

        return await this.#handleRequest(options);
    }

    async readBookHtml({bookId}) {
        const {server, endpoints, token} = this.#config.settings.boockStack;
        let url = endpoints.readBookExportHtml.path;
        url = url.replace("{" + endpoints.readBookExportHtml.parameters.id.name + "}", bookId);

        const options = this.#createOptions(server, url, token)
        const book = this.readBook({bookId});

        const linkToBookHtml = "<div><a target='_blank' href='https://wissen.medi.ch/books/" + book.slug + "'>...öffne in wissen.medi.ch</a></div>";
        const bookHtml = await this.#handleRequest(options);

        return [linkToBookHtml, bookHtml].join();
    }

    /**
     * @param bookId
     * @return {Promise<{Book}>}
     */
    async readBook({bookId}) {
        const {server, endpoints, token} = this.#config.settings.boockStack;
        let url = endpoints.readBook.path;
        url = url.replace("{" + endpoints.readBook.parameters.id.name + "}", bookId);

        const options = this.#createOptions(server, url, token)
        return await (JSON.parse(await this.#handleRequest(options)));
    }

    /**
     * @param shelveId
     * @return {Promise<{Shelve}>}
     */
    async readShelve({shelveId}) {
        const {server, endpoints, token} = this.#config.settings.boockStack;
        let url = endpoints.readShelve.path;
        url = url.replace("{" + endpoints.readShelve.parameters.id.name + "}", shelveId);

        const options = this.#createOptions(server, url, token)
        return await (JSON.parse(await this.#handleRequest(options)));
    }


    async readShelveHtml({shelveId}) {
        const shelve = await (this.readShelve({shelveId}));

        console.log(shelve)

        let html = "";

        for (const book of shelve.books) {
            const bookId = book.id;
            const bookCoverHtml = await this.readBookCoverHtml({bookId});
            html += bookCoverHtml;
        }

        return html;
    }

    async readBookCoverHtml({bookId}) {
        const book = await (this.readBook({bookId}));

       //todo
        return `<a href="https://wissen.medi.ch/books/${book.slug}" class="grid-card" data-eclassName-type="book"
           data-entity-id="15">
            <div class="bg-book featured-className-container-wrap">
                <div class="featured-image-coclassNameer"
                     style="background-image: url('${book.cover.url}')">
                </div>
            </div>
            <div class="grid-card-content"><h2 class="text-limit-lines-2">${book.name}</h2>
                <p class="text-muted">${book.description}</p>
            </div>
    </a>`
    }

    async #handleRequest(options) {
        return new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                let data = "";
                res.on('data', d => {
                    data += d;
                });
                res.on('end', () => {
                    resolve(data);
                });
            });

            req.on('error', error => {
                reject(error);
            });

            req.end();
        });
    }


    #createOptions(server, url, token) {
        return {
            hostname: server.hostname,
            port: server.port,
            path: url,
            method: 'GET',
            headers: {
                'Content-Type': 'text/html',
                'Authorization': 'Token ' + token
            }
        }
    }

    #resolveEnvVariables(object) {
        if (object === null) {
            return object;
        }
        if (typeof object !== 'object') {
            return object;
        }
        const resolved = Array.isArray(object) ? [] : {};
        for (const [key, value] of Object.entries(object)) {
            if (typeof value === 'string' && value.startsWith('$')) {
                const envVar = value.slice(1);
                const envVarName = envVar.replace(/[{}]/g, '');
                resolved[key] = process.env[envVarName];
            } else {
                resolved[key] = this.#resolveEnvVariables(value);
            }
        }
        return resolved;
    }
}
