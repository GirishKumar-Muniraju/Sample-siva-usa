import { ALBResult } from 'aws-lambda';
import { LambdaResponseHelper } from './lambda-response-helper';
import { Logger } from './logger';
import { ApiError } from '../models/api-error';
import { SchemaError } from '../models/request-body-schema-error';

export class ErrorHandlingHelper {
    /**
     * Converts error object to API response object
     * @param err Input error object
     * @returns API response corresponding to error
     */
    static handle(err: Error): ALBResult {
        let response = null;

        // Log error message
        Logger.error(err);

        // Send response to the caller
        if (err instanceof ApiError) {
            response = LambdaResponseHelper.sendApiResponse(err.statusCode, null, err.message);
        } else if (err instanceof SchemaError) {
            response = LambdaResponseHelper.sendApiResponse(err.statusCode, err.validationResult, err.message);
        } else {
            response = LambdaResponseHelper.sendApiResponse(500, null, err.message);
        }
        return response;
    }
}
