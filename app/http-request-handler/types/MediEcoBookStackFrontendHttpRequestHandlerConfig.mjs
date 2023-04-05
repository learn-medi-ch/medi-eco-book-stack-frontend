/**
 * @typedef {Object} MediEcoBookStackFrontendHttpRequestHandlerConfig
 * @property {MediEcoBookStackFrontendHttpRequestHandlerSchemas} schemas
 * @property {MediEcoBookStackFrontendHttpRequestHandlerSettings} settings
 */

/**
 * @typedef {Object} MediEcoBookStackFrontendHttpRequestHandlerSchemas
 * @property {MediEcoBookStackFrontendHttpRequestHandlerActionsSchema} actionsSchema
 */

/**
 * @typedef {Object} MediEcoBookStackFrontendHttpRequestHandlerActionsSchema
 * @property {FluxEcoActionSchema} readPageHtml
 * @property {FluxEcoActionSchema} readBookHtml
 * @property {FluxEcoActionSchema} readShelf
 */

/**
 * @typedef {Object} MediEcoBookStackFrontendHttpRequestHandlerSettings
 * @property {BookStackConfig} bookstackConfig
 */