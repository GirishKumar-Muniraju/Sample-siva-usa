import { expect } from 'chai';
import { LambdaResponseHelper } from '../../src/utils/lambda-response-helper';
describe('Lambda response helper unit tests', async function () {

    const HeaderForMatch =
    {
        origin: 'https://dp684-ops-dev.fpl.com',
        'content-type': 'application/json',
        'user-agent': 'PostmanRuntime/7.29.0',
        accept: '*/*',
        'postman-token': '968c7a25-f164-45da-9677-e69e3881be27',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'content-length': '152'
    }

    const HeaderForNoMatch =
    {
        origin: 'https://google.com',
        'content-type': 'application/json',
        'user-agent': 'PostmanRuntime/7.29.0',
        accept: '*/*',
        'postman-token': '968c7a25-f164-45da-9677-e69e3881be27',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'content-length': '152'
    }

    const HeaderNoOrigin =
    {
        'content-type': 'application/json',
        'user-agent': 'PostmanRuntime/7.29.0',
        accept: '*/*',
        'postman-token': '968c7a25-f164-45da-9677-e69e3881be27',
        host: 'localhost:3000',
        'accept-encoding': 'gzip, deflate, br',
        connection: 'keep-alive',
        'content-length': '152'
    }

    const NormalOutput =
    {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://dp684-ops-dev.fpl.com',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    }
    const NoMatchOutput =
    {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'
    }

    it('should return Access-Control-Allow-Origin when in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, undefined, true, HeaderForMatch);
        expect(output.headers).to.be.not.null;
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);

    });

    it('should return Access-Control-Allow-Origin when second in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'http://www.google.com,https://dp684-ops-dev.fpl.com,https:fms.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, undefined, true, HeaderForMatch);
        expect(output.headers).to.be.not.null;
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);

    });

    it('should return Access-Control-Allow-Origin and regular headers when in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, HeaderForMatch, true, HeaderForMatch);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);
        expect(output.headers['host']).to.be.equal(HeaderForMatch['host']);
        expect(output.headers).to.be.not.null;

    });

    it('should return Access-Control-Allow-Origin with array body and regular headers when in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, ['mybody'], undefined, HeaderForMatch, true, HeaderForMatch);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);
        expect(output.headers).to.be.not.null;

    });

    it('should return Access-Control-Allow-Origin with non-array body and regular headers when in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, 'mybody', undefined, HeaderForMatch, true, HeaderForMatch);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);
        expect(output.headers).to.be.not.null;

    });

    
    it('should return Access-Control-Allow-Origin as first in whitelist when no origin', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com,https:fms.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, undefined, true, HeaderNoOrigin);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NormalOutput['Access-Control-Allow-Origin']);
        expect(output.headers).to.be.not.null;

    });

    it('should return empty Access-Control-Allow-Origin when no whitelist', async () => {
        delete process.env.ALLOWED_ORIGIN
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, undefined, true, HeaderNoOrigin);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NoMatchOutput['Access-Control-Allow-Origin']);
        expect(output.headers).to.be.not.null;

    });
    it('should return empty Access-Control-Allow-Origin when not in whitelist', async () => {
        process.env.ALLOWED_ORIGIN = 'https://dp684-ops-dev.fpl.com,https:fms.fpl.com';
        const output = await LambdaResponseHelper.sendApiResponse(204, undefined, undefined, undefined, true, HeaderForNoMatch);
        expect(output.headers['Access-Control-Allow-Origin']).to.be.equal(NoMatchOutput['Access-Control-Allow-Origin']);
        expect(output.headers).to.be.not.null;

    });

});
