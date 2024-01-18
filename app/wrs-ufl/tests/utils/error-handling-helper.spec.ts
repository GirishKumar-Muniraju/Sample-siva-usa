import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { ApiError } from '../../src/models/api-error';
import { SchemaError } from '../../src/models/request-body-schema-error';
import { ErrorHandlingHelper } from '../../src/utils/error-handling-helper';
chai.use(spies);

describe('Error Factory unit tests', async function () {

    it('Should successfully handles the API Error', async () => {
        const apiError: ApiError = new ApiError(999, 'Error message');
        const result = ErrorHandlingHelper.handle(apiError);
        expect(result).not.to.be.null;
        const response = JSON.parse(result.body as string);
        expect(response.statusCode).to.be.equal(999);
        expect(response.statusMessage).to.be.equal('Error message');
    });

    it('Should successfully handles non-API Error', async () => {
        const err: Error = new Error('Non-Error message');
        const result = ErrorHandlingHelper.handle(err);
        expect(result).not.to.be.null;
        const response = JSON.parse(result.body as string);
        expect(response.statusCode).to.be.equal(500);
        expect(response.statusMessage).to.be.equal('Non-Error message');
    });

    it('Should successfully handles the Schema Error', async () => {
        const schemaError: SchemaError = new SchemaError(400, 'Schema Error message', []);
        const result = ErrorHandlingHelper.handle(schemaError);
        expect(result).not.to.be.null;
        const response = JSON.parse(result.body as string);
        expect(response.statusCode).to.be.equal(400);
        expect(response.statusMessage).to.be.equal('Schema Error message');
    });
});
