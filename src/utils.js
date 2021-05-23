export const getAppVersion = () => {
    const suffix = process.env.REACT_APP_VERSION_NAME_SUFFIX || "";
    return process.env.REACT_APP_VERSION + suffix;
};

export const clamp = (val, min, max) => Math.min(Math.max(min, val), max);

export const getCallerInfo = () => {
    // TODO maybe achieve to return line numbers of original files (not bundle)
    const callerLine = (new Error()).stack.split('\n')[3];
    const idx = callerLine.indexOf("at ");
    return callerLine.slice(idx + 3, callerLine.length);
};

export const getCommandControlBackendUrl = () => {
    return window.runtimeEnv.REACT_APP_COMMAND_CONTROL_BACKEND_URL;
};

export const getWorkflowRegistryUrl = () => {
    return window.runtimeEnv.REACT_APP_WORKFLOW_REGISTRY_URL;
};

export const getPackageRegistryUrl = () => {
    return window.runtimeEnv.REACT_APP_PACKAGE_REGISTRY_URL;
};

// also works with URLs
export const pathJoin = (base, ...parts) => {
    const trimSepRight = /\/+$/g;
    const trimSepLeftRight = /^\/+|\/+$/g;
    const partsTrimmed = parts.map(p => p.replace(trimSepLeftRight, ''));
    return [base.replace(trimSepRight, '')].concat(partsTrimmed).join('/');
};