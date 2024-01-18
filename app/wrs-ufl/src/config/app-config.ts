const appConfig = {
    endpointPrefix: process.env.WRS_ENDPOINT_PREFIX || '',
};

// To prevent modification at runtime
Object.freeze(appConfig);

export const config = appConfig;
