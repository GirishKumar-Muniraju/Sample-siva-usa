import chai, { expect } from 'chai';
import chaiPromised from 'chai-as-promised';
import { afterEach, beforeEach, describe, it } from 'mocha';
import * as sinon from 'sinon';
import { TokenValidationManagerConfig } from '../../src/core/oauth2/token-validation-manager-config.interface';
import { TokenValidationManager } from './../../src/core/oauth2/token-validation-manager';

chai.use(chaiPromised);

describe('Token Validation Manager Tests', () => {

    let manager: TokenValidationManager;
    let config: TokenValidationManagerConfig;

    beforeEach(() => {
        config = {
            tokenValidators: [
                {
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
                }
            ],
        };
        manager = new TokenValidationManager(config);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize', async () => {
        await manager.initialize();
        expect(manager.isInitialized).to.be.true;
        expect(manager.validators.size).to.be.equal(1);
    });

    it('should initilize without validators when no config', async () => {
        let manager = new TokenValidationManager();
        await manager.initialize();        
        expect(manager.isInitialized).to.be.true;
        expect(manager.validators.size).to.be.equal(0);
    });

    it('should not initialize if already initialized', async () => {
        await manager.initialize();
        await manager.initialize();
        expect(manager.isInitialized).to.be.true;
        expect(manager.validators.size).to.be.equal(1);
    });

    it('should validate and return slid', async () => {
        sinon.stub(manager.jwtHelper, 'decode').returns({
            payload: {
                iss: 'issuer',
                username: 'slid_SLID',
            },
            header: null,
            signature: null,
        });
        await manager.initialize();
        const tokenValidator = manager.validators.get('issuer');
        sinon.stub(tokenValidator, 'validate');
        const slid = await manager.validate('token');
        expect(slid).to.be.not.null;
        expect(slid).to.be.equal('SLID');
    });

    it('should throw invalid token error', async () => {
        sinon.stub(manager.jwtHelper, 'decode').returns(null);
        await expect(manager.validate('token'))
            .to.be.rejectedWith('Invalid Json Web token.');
    });


    it('should throw invalid issuer error', async () => {
        sinon.stub(manager.jwtHelper, 'decode').returns({
            payload: {
                iss: 'issuer1',
                username: 'slid_SLID',
            },
            header: null,
            signature: null,
        });
        await expect(manager.validate('token'))
            .to.be.rejectedWith('Token is not issued by registered issuer.');
    });

});
