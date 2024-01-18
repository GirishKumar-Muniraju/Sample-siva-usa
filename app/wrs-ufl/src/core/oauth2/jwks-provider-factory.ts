import { JwksProviderConfig } from './jwks-provider-config.interface';
import { SsmAwsCognitoJwksProvider } from './ssm-aws-cognito-jwks-provider';

export class JwksProviderFactory {
    static async create(config?: JwksProviderConfig) {

        return await JwksProviderFactory.getJwksProvider();
    }

    private static async getJwksProvider(config?: JwksProviderConfig) {
        if (config) {
            return new SsmAwsCognitoJwksProvider(config.parameters);
        }

        return new SsmAwsCognitoJwksProvider();
    }
}
