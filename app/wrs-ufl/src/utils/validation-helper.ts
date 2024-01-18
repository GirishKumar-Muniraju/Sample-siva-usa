import { ALBEvent } from 'aws-lambda';
import { ApiError } from '../models/api-error';
import { SchemaError } from '../models/request-body-schema-error';
import Ajv, { Schema } from 'ajv';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv/* ,{singlerror:true} */);

export class ValidationHelper {
    static throwIfParamDoesNotExist(params: Map<string, string>, paramName: string) {
        const param = params.get(paramName);
        if (!param) {
            // Bad Request
            throw new ApiError(400, `${paramName} is missing.`);
        }
        return param;
    }

    static throwIfJsonIsNull(json: string, errCode: number, errMsg: string) {
        if (!json || json === 'null') {
            throw new ApiError(errCode, errMsg);
        }
        return JSON.parse(json);
    }

    static throwIfArrayIsEmpty(arrLength: number, errCode: number, errMsg: string) {
        if (arrLength === 0) {
            throw new ApiError(errCode, errMsg);
        }
    }

    static throwIfObjectIsNull(obj: any, errCode: number, errMsg: string) {
        if (!obj) {
            throw new ApiError(errCode, errMsg);
        }
    }

    static throwIfAuthHeaderMissing(requestHeaders: { [name: string]: string | undefined }) {
        ValidationHelper.throwIfObjectIsNull(requestHeaders, 403, 'Token validation failed');
        ValidationHelper.throwIfObjectIsNull(requestHeaders.Authorization ||
            requestHeaders.authorization, 403, 'Token validation failed');
    }

    static throwIfSchemaNotValid(event: ALBEvent, schema: Schema, errMsg: string) {
        const failedValidations = [];
        const validate = ajv.compile(schema);
        if (!validate(JSON.parse(event.body))) {
            validate.errors.forEach((error) => {
                if (error.keyword === 'additionalProperties' && error.params?.additionalProperty) {
                    error.message = `Property ${error.params.additionalProperty} is not allowed`;
                }
                failedValidations.push({
                    message: error.message,
                });
            });
        }
        if (failedValidations && failedValidations.length > 0) {
            throw new SchemaError(400, errMsg, failedValidations);
        }
    }

    static throwIfQueryParamsNotValid(event: ALBEvent, schema: Schema, errMsg: string) {
        const failedValidations = [];
        const validate = ajv.compile(schema);
        if (!validate(event.queryStringParameters)) {
            validate.errors.forEach((error) => {
                failedValidations.push({
                    message: error.message,
                });
            });
        }
        if (failedValidations && failedValidations.length > 0) {
            throw new SchemaError(400, errMsg, failedValidations);
        }
    }

    static throwIfArrayIsAlreadyExists(array: any, errCode: number, errMsg: string) {
        if (array.length > 0) {
            throw new ApiError(errCode, errMsg);
        }
    }

    static throwIfObjectIsAlreadyExists(obj: any, errCode: number, errMsg: string) {
        if (obj) {
            throw new ApiError(errCode, errMsg);
        }
    }
}