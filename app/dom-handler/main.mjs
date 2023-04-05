import Api from "./Api.mjs";

const getActionName = () => {
    const currentUrl = new URL(window.location.href);
    const params = currentUrl.searchParams;
    let action = params.get("action");
    if (action) {
        return action
    }
    return null;
}

const actionName = getActionName();
if (actionName) {
    //todo by service which resolves refs / links

    const actionsSchemaResponse = await fetch("/schemas/actions-schema.json");
    /** @type {MediEcoBookStackFrontendDomHandlerActionsSchema} actionsSchema */
    const actionsSchema = await (await actionsSchemaResponse.json());

    const filePathsSchemaResponse = await fetch("/schemas/file-paths-schema.json");
    const filePathsSchema = await (await filePathsSchemaResponse.json());

    const requestHandlerActionsSchemaResponse = await fetch("api/readActionsSchema");
    const requestHandlerActionsSchema = await JSON.parse(await requestHandlerActionsSchemaResponse.json());

    const api = Api.new(
        {
            schemas: {
                actionsSchema: actionsSchema,
                filePathsSchema: filePathsSchema
            },
            settings: {
                requestHandlerActionsSchema: requestHandlerActionsSchema
            }
        }
    );

    const currentUrl = new URL(window.location.href);
    const queryParams = await currentUrl.searchParams;
    //todo - extract to separate service, assert parameter types, assert required parameters
    const handleActionParameters = {};
    await Object.entries(actionsSchema[actionName].parameters).forEach(([parameterName, parameterSchema]) => {
        if (queryParams.has(parameterName)) {
            handleActionParameters[parameterName] = queryParams.get(parameterName);
        }
    });
    api[actionName](handleActionParameters)
}