/**
 * @typedef {Object} BookStackConfig
 * @property {BookStackSchemas} schemas
 * @property {BookStackSettings} settings
 */

/**
 * @typedef {Object} BookStackSettings
 * @property {Object} server
 * @property {string} token
 */

/**
 * @typedef {Object} BookStackSchemas
 * @property {BookStackActionsSchema} actionSchemas
 */

/**
 * @typedef {Object} BookStackActionsSchema
 * @property {{headers:{name:string}}} authenticate
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readPageExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBookExportHtml
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readShelve
 * @property {{path:string,headers:{name:string, type:string},parameters:{id:object}}} readBook
 */
