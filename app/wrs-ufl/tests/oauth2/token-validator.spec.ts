import chai, { expect } from 'chai';
import chaiPromised from 'chai-as-promised';
import { afterEach, beforeEach, describe, it } from 'mocha';
import moment from 'moment';
import { of } from 'rxjs';
import * as sinon from 'sinon';
import { TokenValidator } from '../../src/core/oauth2/token-validator';
import { TokenValidatorConfig } from '../../src/core/oauth2/token-validator-config.interface';

chai.use(chaiPromised);

describe('Token Validator Tests', () => {

    let validator: TokenValidator;
    let config: TokenValidatorConfig;
    const jwksJson = '{"keys":[{"alg":"RS256","e":"AQAB",' +
        '"kid":"xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=",' +
        '"kty":"RSA","n":"x8VGfmF8lpWDQld4R2R8p5xet3aeoxJYxDQkN9kQpKNc6sxq9vk8gv5OMw8-GfAA_QPemoBNVN6t53eQ84N9Xpw4k5FyTJpKLR0ghmGQcszAUBVWSuaGU2D2I5NPwszFHTtbhdsb4M4Vj1Bk_HSTp1fuofVdle96ZB3CTlW124A3RpiiX4CpYfD836nAiB-e9pK94aiXqg0hRxvOfhzpgfNWMx0XuyjpYzxk4N3lZIu4aBsAR0O9outLXEpG-pSppgKVeZL7sxLxfUDHyhVsV16CCFXCj09CHZdCUwFa-1IE3VEELi6fvaqc-gNTVryuh-pYow42nRBB2Yp3Ulh0Rw",' +
        '"use":"sig"},{"alg":"RS256","e":"AQAB","kid":"/J+Nj/RR5hrPPIUqcbMl1/iGKz17CxUez9KLOmeDVWo=","kty":"RSA",' +
        '"n":"8RUemibkblVoNYTx29QGc4bealJVPkrjqgZNEEKORwRmt3AOBICc5jHhM-XtGRO1YHDtmDmio5dUGEdBcYOzek3YF0imlv7S8M-eEVQaSPOw7VMh9KfM4YJ9wO6Ee88Es6fXdbkkq9p1gCfYyCzUoKa_OQEPbSF2zxK2vGd56aoESxbuOgJHz0Ldq3JGlA_lW0gbNErRGA3drgyMh1VYduc6_Rii5da0Cme4d9At_SXi45aYrfGDfZ1jD6sE8Y3YH0lLwTYjqUctgv7lINSKwCf_ZRsgt_Xtzil0mD7NEBVRZCUti37z-7n_LBth_liDGBx24w6jqeNJpGrCFs0Ftw","use":"sig"}]}';

    beforeEach(() => {
        config = {
            issuer: 'issuer',
            jwksProviderConfig: {
                jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
                parameters: [
                    { name: 'region', value: 'us-east-1' },
                    { name: 'issuer', value: 'issuer' },
                    { name: 'withDecryption', value: 'true' },
                    { name: 'cacheTimeoutInSeconds', value: '3600' }
                ],
            },
            tokenExpiration: 3600,
        };

        validator = new TokenValidator(config);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize', async () => {
        await validator.initialize();
        await validator.initialize();
        expect(validator.isInitialized).to.be.true;
    });

    // it('should throw invalid issuer error while calling validate', async () => {
    //     await expect(validator.validate({
    //         jwt: {
    //             payload: {
    //                 iss: 'issuer1',
    //             },
    //             header: null,
    //             signature: null,
    //         },
    //         token: 'token',
    //     })).to.be.rejectedWith('Token is not issued by valid issuer.');
    // });

    it('should validate', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').returns(of(JSON.parse(jwksJson)).toPromise());
        sinon.stub(validator.jwtHelper, 'verify').returns(of(true).toPromise());
        const jwtPayload = await validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        });

        expect(jwtPayload).to.be.not.null;
    });

    it('should throw json web keys not found - 1', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').returns(of(null).toPromise());
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Json Web Keys are not found');
    });

    it('should throw json web keys not found - 2', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').returns(of({
            keys: null,
            region: null,
            cognitoUserPoolId: null,
        }).toPromise());
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Json Web Keys are not found');
    });

    it('should throw jwks loading error', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').throws();
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Error occured while loading JWKS');
    });

    it('should throw invalid token issuer', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').returns(of(JSON.parse(jwksJson)).toPromise());
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'some key',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Token is not issued by valid issuer.');
    });

    it('should throw expired token error', async () => {
        await validator.initialize();
        sinon.stub(validator.jwksProvider, 'provide').returns(of(JSON.parse(jwksJson)).toPromise());
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().subtract(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Expired Token');
    });

    it('should throw invalid token error', async () => {
        await validator.initialize();
        config.tokenExpiration = null;
        sinon.stub(validator.jwksProvider, 'provide').returns(of(JSON.parse(jwksJson)).toPromise());
        sinon.stub(validator.jwtHelper, 'verify').returns(of(null).toPromise());
        await expect(validator.validate({
            jwt: {
                payload: {
                    iss: 'issuer',
                    exp: moment.utc().add(1, 'hours').unix(),
                },
                header: {
                    kid: 'xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=',
                    alg: 'RS256',
                },
                signature: null,
            },
            token: 'token',
        })).to.be.rejectedWith('Invalid Token');
    });
});
