import { ALBResult } from 'aws-lambda';

export class LambdaResponseHelper {
    static sendApiResponse(statusCode: number, body: any, statusMessage?: string, headers?: {
        [header: string]: boolean | number | string;
    }, setResponseAsItIs?: boolean, headerOrigin?: {
        [header: string]: boolean | number | string;
    }) {
        const whiteList = process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(','):[''];
        const originPassed = headerOrigin?.origin ? headerOrigin.origin.toString() : whiteList[0];
        const standardHeaders = {
            'Access-Control-Allow-Origin': whiteList.find((origin) => origin.toUpperCase() === originPassed.toUpperCase()) || '',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Content-Type': 'application/json',
        };

        const responseHeaders = headers ? { ...headers, ...standardHeaders } : standardHeaders;
        const bodyArray = !Array.isArray(body) ? [body] : body;
        const response = setResponseAsItIs ? body : {
            resources: body !== null ? bodyArray : null,
            success: statusCode === 200,
            statusMessage: statusMessage || 'Success',
            statusCode,
        };

        const apiResponse: ALBResult = {
            statusCode,
            body: JSON.stringify(response),
            headers: responseHeaders,
            isBase64Encoded: false,
        };
        return apiResponse;
    }
}
