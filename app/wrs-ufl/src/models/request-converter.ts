import express from 'express';
import { ALBEvent, ALBEventHeaders } from 'aws-lambda';
import { IncomingHttpHeaders } from 'http';

export class RequestConverter {
    static async expressToALB(req: express.Request): Promise<ALBEvent> {
        return {
            body: req.body ? JSON.stringify(req.body) : null,
            httpMethod: req.method,
            isBase64Encoded: false,
            path: req.baseUrl + req.path,
            requestContext: {
                elb: {
                    targetGroupArn: '',
                },
            },
            queryStringParameters: { ...RequestConverter.qsParams(req.query) },
            headers: RequestConverter.getALBHeaders(req.headers),
        };
    }

    static getALBHeaders(headers: IncomingHttpHeaders): ALBEventHeaders {
        const albHeaders = {};
        for (const headerKey of Object.keys(headers)) {
            albHeaders[headerKey] = headers[headerKey];
        }
        return albHeaders;
    }

    private static qsParams(expressQs: any) {
        const queryParams = {};
        if (expressQs) {
            for (const attr of Object.keys(expressQs)) {
                queryParams[attr] = expressQs[attr];
            }
        }

        return queryParams;
    }
}