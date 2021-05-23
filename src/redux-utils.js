
export const createActionTypesForModule = (moduleName) => new Proxy({}, {
    get: (_, name) => moduleName + '/' + name
});
