import chai, { expect } from 'chai';
import chaiPromised from 'chai-as-promised';
import 'mocha';
import { JwksProviderFactory } from '../../src/core/oauth2/jwks-provider-factory';
import { SsmAwsCognitoJwksProvider } from '../../src/core/oauth2/ssm-aws-cognito-jwks-provider';

chai.use(chaiPromised);
describe('JwksProviderFactory Tests', () => {
    it('should create instance of SsmAwsCognitoJwksProvider class', async () => {
        const jwksProvider = await JwksProviderFactory.create();
        expect(jwksProvider).to.be.an.instanceof(SsmAwsCognitoJwksProvider);
    });
});