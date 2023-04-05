export default class Api {

    /**
     * @type {MediEcoBookStackFrontendDomHandlerConfig}
     */
    #config;

    /**
     * @param {MediEcoBookStackFrontendDomHandlerConfig} config
     */
    constructor(config) {
        this.#config = config
    }

    /**
     * @param {MediEcoBookStackFrontendDomHandlerConfig} config
     */
    static new(config) {
        return new Api(config)
    }

    /**
     * @param {number} pageId
     */
    async renderPage({pageId}) {
        const requestUrlSchemaPath = this.#config.settings.requestHandlerActionsSchema.readPageHtml.path;
        const requestUrl = requestUrlSchemaPath.replace('{pageId}', pageId.toString());
        const response = await this.#handleRequest(requestUrl)
        const bookStackElement = document.createElement("div");
        bookStackElement.innerHTML = response;
        document.body.appendChild(bookStackElement);
    }

    /**
     * @param {number} pageId
     */
    async renderBook({bookId}) {
        const requestUrlSchemaPath = this.#config.settings.requestHandlerActionsSchema.readBookHtml.path;
        const requestUrl = requestUrlSchemaPath.replace('{bookId}', bookId.toString());
        const response = await this.#handleRequest(requestUrl)
        const bookStackElement = document.createElement("div");
        bookStackElement.innerHTML = response;
        document.body.appendChild(bookStackElement);
    }

    async renderShelf({shelfId}) {
        const requestUrlSchemaPath = this.#config.settings.requestHandlerActionsSchema.readShelf.path;
        const requestUrl = requestUrlSchemaPath.replace('{shelfId}', shelfId.toString());
        const response = await this.#handleRequest(requestUrl)
        const bookStackElement = document.createElement("div");
    }



    /**
     *
     * @param requestUrl
     * @return {Promise<any>}
     */

    async #handleRequest(requestUrl) {
        const response = await fetch(requestUrl);
        return await response.json();
    }
}