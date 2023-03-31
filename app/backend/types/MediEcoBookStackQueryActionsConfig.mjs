/**
 * @typedef {Object} MediEcoBookStackQueryActionsConfig
 * @property {Settings} settings
 */

/**
 * @typedef {Object} Settings
 * @property {BookstackSettings} boockStack
 */

/**
 * @typedef {Object} BookstackSettings
 * @property {Object} server
 * @property {string} token
 * @property {Endpoints} endpoints
 */

/**
 * @typedef {Object} Endpoints
 * @property {{headers:{name:string}}} authenticate
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readPageExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBookExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readShelve
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBook
 */
