import chai, { expect } from 'chai';
import chaiPromised from 'chai-as-promised';
import { describe, it, afterEach } from 'mocha';
import * as sinon from 'sinon';
import AWS from 'aws-sdk';
import AWSMock from 'aws-sdk-mock';
import { GetParameterRequest } from 'aws-sdk/clients/ssm';
import { SsmAwsCognitoJwksProvider } from '../../src/core/oauth2/ssm-aws-cognito-jwks-provider';

chai.use(chaiPromised);

describe('SSM AWS Cognito Jwks Provider Tests', () => {

    const jwksJson = '{"keys":[{"alg":"RS256","e":"AQAB",' +
        '"kid":"xGwIhT3n2+TiOmRFmfkmD6f8glD7vYPwieM2PIe5ckc=",' +
        '"kty":"RSA","n":"x8VGfmF8lpWDQld4R2R8p5xet3aeoxJYxDQkN9kQpKNc6sxq9vk8gv5OMw8-GfAA_QPemoBNVN6t53eQ84N9Xpw4k5FyTJpKLR0ghmGQcszAUBVWSuaGU2D2I5NPwszFHTtbhdsb4M4Vj1Bk_HSTp1fuofVdle96ZB3CTlW124A3RpiiX4CpYfD836nAiB-e9pK94aiXqg0hRxvOfhzpgfNWMx0XuyjpYzxk4N3lZIu4aBsAR0O9outLXEpG-pSppgKVeZL7sxLxfUDHyhVsV16CCFXCj09CHZdCUwFa-1IE3VEELi6fvaqc-gNTVryuh-pYow42nRBB2Yp3Ulh0Rw",' +
        '"use":"sig"},{"alg":"RS256","e":"AQAB","kid":"/J+Nj/RR5hrPPIUqcbMl1/iGKz17CxUez9KLOmeDVWo=","kty":"RSA",' +
        '"n":"8RUemibkblVoNYTx29QGc4bealJVPkrjqgZNEEKORwRmt3AOBICc5jHhM-XtGRO1YHDtmDmio5dUGEdBcYOzek3YF0imlv7S8M-eEVQaSPOw7VMh9KfM4YJ9wO6Ee88Es6fXdbkkq9p1gCfYyCzUoKa_OQEPbSF2zxK2vGd56aoESxbuOgJHz0Ldq3JGlA_lW0gbNErRGA3drgyMh1VYduc6_Rii5da0Cme4d9At_SXi45aYrfGDfZ1jD6sE8Y3YH0lLwTYjqUctgv7lINSKwCf_ZRsgt_Xtzil0mD7NEBVRZCUti37z-7n_LBth_liDGBx24w6jqeNJpGrCFs0Ftw","use":"sig"}]}';

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize', async () => {
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'region', value: 'us-east-1' },
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
                { name: 'withDecryption', value: 'true' },
                { name: 'cacheTimeoutInSeconds', value: '3600' }
            ],
        };

        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        await jwksProvider.initialize();
        await jwksProvider.initialize();
        expect(jwksProvider.isInitialized).to.be.true;
    });

    it('should initialize with blank region', async () => {
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
                { name: 'withDecryption', value: 'true' },
                { name: 'cacheTimeoutInSeconds', value: '3600' }
            ],
        };

        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        await jwksProvider.initialize();
        await jwksProvider.initialize();
        expect(jwksProvider.isInitialized).to.be.true;
    });

    it('should initialize with SSM endpoint', async () => {
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'region', value: 'us-east-1' },
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
                { name: 'withDecryption', value: 'true' },
                { name: 'cacheTimeoutInSeconds', value: '3600' }
            ],
        };
        process.env.SSM_ENDPOINT = '{}';
        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        await jwksProvider.initialize();
        await jwksProvider.initialize();
        expect(jwksProvider.isInitialized).to.be.true;
        delete process.env.SSM_ENDPOINT;
    });

    it('should provide jwks', async () => {
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'region', value: 'us-east-1' },
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
                { name: 'withDecryption', value: 'true' },
                { name: 'cacheTimeoutInSeconds', value: '3600' }
            ],
        };

        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SSM', 'getParameter', (params: GetParameterRequest, callback: Function) => {
            callback(null, {
                Parameter: {
                    Name: '/cwe-cognito/us-east-1_HFirfqXPg/jwks',
                    Type: 'String',
                    Value: jwksJson,
                    Version: 1
                }
            });
        });
        let jwks = await jwksProvider.provide();
        jwks = await jwksProvider.provide();
        expect(jwks).to.be.not.null;
        AWSMock.restore('SSM');
    });

    it('should provide jwks in debug mode', async () => {
        process.env.DEBUG_COGNITO_JWKS = JSON.stringify({
            Parameter: {
                Value: {
                    region: '',
                    cognitoUserPoolId: '',
                    keys: [],
                },
            },
        });
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'region', value: 'us-east-1' },
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
                { name: 'withDecryption', value: 'true' },
                { name: 'cacheTimeoutInSeconds', value: '3600' }
            ],
        };

        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SSM', 'getParameter', (params: GetParameterRequest, callback: Function) => {
            callback(null, {
                Parameter: {
                    Name: '/cwe-cognito/us-east-1_HFirfqXPg/jwks',
                    Type: 'String',
                    Value: jwksJson,
                    Version: 1
                }
            });
        });
        let jwks = await jwksProvider.provide();
        expect(jwks).to.be.not.null;
        AWSMock.restore('SSM');
        delete process.env.DEBUG_COGNITO_JWKS;
    });

    it('should provide jwks without Decryption and Cachetimout', async () => {
        const config = {
            jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
            parameters: [
                { name: 'region', value: 'us-east-1' },
                { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' }
            ],
        };

        const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
        AWSMock.setSDKInstance(AWS);
        AWSMock.mock('SSM', 'getParameter', (params: GetParameterRequest, callback: Function) => {
            callback(null, {
                Parameter: {
                    Name: '/cwe-cognito/us-east-1_HFirfqXPg/jwks',
                    Type: 'String',
                    Value: jwksJson,
                    Version: 1
                }
            });
        });
        let jwks = await jwksProvider.provide();
        expect(jwks).to.be.not.null;
        AWSMock.restore('SSM');
    });

    // it('should throw invalid cognito issuer error', async () => {
    //     const config = {
    //         jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
    //         parameters: [
    //             { name: 'region', value: 'us-east-1' },
    //             { name: 'issuer', value: 'some issuer' },
    //             { name: 'withDecryption', value: 'true' },
    //             { name: 'cacheTimeoutInSeconds', value: '3600' }
    //         ],
    //     };

    //     const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
    //     await expect(jwksProvider.provide()).to.be.rejectedWith('Invalid AWS Cognito Issuer');
    // });

    // it('should throw invalid AWS region error', async () => {
    //     const config = {
    //         jwksProviderClass: 'nee.security.oauth2.SsmAwsCognitoJwksProvider',
    //         parameters: [
    //             { name: 'region', value: 'us-west-1' },
    //             { name: 'issuer', value: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_HFirfqXPg' },
    //             { name: 'withDecryption', value: 'true' },
    //             { name: 'cacheTimeoutInSeconds', value: '3600' }
    //         ],
    //     };

    //     const jwksProvider = new SsmAwsCognitoJwksProvider(config.parameters);
    //     await expect(jwksProvider.provide()).to.be.rejectedWith('Invalid AWS Region');
    // });
});
