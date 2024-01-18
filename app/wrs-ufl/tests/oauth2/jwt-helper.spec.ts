import chai, { expect } from 'chai';
import { createSandbox } from 'sinon';
import proxyquire from 'proxyquire';
import chaiPromised from 'chai-as-promised';
import { after, before } from 'mocha';

chai.use(chaiPromised);

describe('Jwt Helper Tests', () => {
    const sandbox = createSandbox();
    const token = 'token';
    const decodedToken = 'decodedToken';

    let jwt = null;
    let jwtHelper = null;
    let jwtVerifyErrFlag = false;

    before(() => {
        jwt = proxyquire('../../src/core/oauth2/jwt-helper', {
            jsonwebtoken: {
                decode: sandbox.stub().returns(decodedToken),
                verify: sandbox.stub().callsFake((token, pem, options, callback) => {
                    callback(jwtVerifyErrFlag, {});
                }),
            },
        });
        jwtHelper = new jwt.JwtHelper();
    });

    after(() => {
        sandbox.restore();
    });

    it('should return decoded token for decode', async () => {
        const retVal = jwtHelper.decode(token);
        expect(retVal).to.be.equal(decodedToken);
    });

    it('should return token verification success for verify', async () => {
        const pem = 'pem_value';
        const iss = 'iss_value';
        jwtVerifyErrFlag = false;
        const retVal = await jwtHelper.verify(token, pem, iss);
        expect(retVal).to.be.equal(true);
    });

    it('should return token verification failed for verify', async () => {
        const pem = 'pem_value';
        const iss = 'iss_value';
        jwtVerifyErrFlag = true;
        await expect(jwtHelper.verify(token, pem, iss)).to.be.rejected;
    });
});
