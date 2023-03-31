import https from "node:https";

export default class Api {

    /**
     * @type {MediEcoBookStackQueryActionsConfig}
     */
    #config;

    constructor(config) {
        this.#config = this.#resolveEnvVariables(config)
    }

    static new(config) {
        return new Api(config)
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
        const book = await(this.readBook({bookId}));

        const linkToBookHtml = "<div><a target='_blank' href='https://wissen.medi.ch/books/" + book.slug + "'>...öffne in wissen.medi.ch</a></div>";
        const bookHtml = await this.#handleRequest(options);

        return [linkToBookHtml, bookHtml].join("");
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

        //todo static side with custom elements
        let html = `<div style="max-width: 940px;
                                margin: auto;">
                    <div 
                        style="grid-template-columns: 1fr 1fr 1fr;
                        display: grid;
                        grid-column-gap: 24px;
                        grid-row-gap: 24px">`;

        for (const book of shelve.books) {
            const bookId = book.id;
            const bookCoverHtml = await this.readBookCoverHtml({bookId});
            html += bookCoverHtml;
        }

        html +=  `</div></div>`
        return html;
    }

    async readBookCoverHtml({bookId}) {
        const book = await (this.readBook({bookId}));

        return `<style>
                  a:hover {
                    color: #666;
                    box-shadow: 0 2px 6px -1px rgb(0 0 0 / 20%);
                  }
                </style>
                <a target='_blank' href="https://wissen.medi.ch/books/${book.slug}" 
                     style="font-family: Univers57, Arial, sans-serif;
                            text-decoration: none;
                            display: flex;
                            flex-direction: column;
                            border: 1px solid #ddd;
                            margin-bottom: 24px;
                            border-radius: 4px;
                            overflow: hidden;
                            min-width: 100px;
                            color: #444;
                            transition: border-color ease-in-out 120ms,box-shadow ease-in-out 120ms">
            <div>
                <div style="position: relative;
                            overflow: hidden;
                            min-height: 140px;
                            background-size: cover;
                            background-position: 50% 50%;
                            transition: opacity ease-in-out 240ms;
                            background-image: url('${book.cover.url}')">
                </div>
            </div>
            <div style="padding: 24px">
                <h2 style="font-size: 12px">${book.name}</h2>
                <p style="font-size: 10px">${book.description}</p>
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
