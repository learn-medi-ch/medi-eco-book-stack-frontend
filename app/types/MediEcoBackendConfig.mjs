/**
 * @typedef {Object} MediEcoBackendConfig
 * @property {Object} server
 * @property {string} token
 * @property {Actions} actions
 */

/**
 * @typedef {Object} Actions
 * @property {{headers:{name:string}}} authenticate
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readPageExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBookExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readShelve
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBook
 */
