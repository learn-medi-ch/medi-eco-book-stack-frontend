/**
 * @typedef {Object} MediEcoBackendSettings
 * @property {BookStackSettings} bookStackSettings
 * @property {BookStackDefinition} bookStackDefinition
 */

/**
 * @typedef {Object} BookStackSettings
 * @property {Object} server
 * @property {string} token
 */

/**
 * @typedef {Object} BookStackDefinition
 * @property {{headers:{name:string}}} authenticate
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readPageExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBookExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readShelve
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBook
 */
