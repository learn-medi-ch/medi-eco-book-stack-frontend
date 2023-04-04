/**
 * @typedef {Object} BookStackConfig
 * @property {BookStackSchemas} schemas
 * @property {BookStackSettings} settings
 */

/**
 * @typedef {Object} BookStackSchemas
 * @property {BookStackSchemasActionsSchema} actionsSchema
 */

/**
 * @typedef {FluxEcoActionsSchema} BookStackSchemasActionsSchema
 * @property {FluxEcoActionSchema} readPageExportHtml
 * @property {FluxEcoActionSchema} readBookExportHtml
 * @property {FluxEcoActionSchema} readBook
 * @property {FluxEcoActionSchema} readShelve
 */

/**
 * @typedef {Object} BookStackSettings
 * @property {Object} server
 * @property {string} token
 */