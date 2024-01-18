import { JwksProviderConfig } from './jwks-provider-config.interface';

export interface TokenValidatorConfig {
    tokenExpiration: number;
    issuer: string;
    jwksProviderConfig: JwksProviderConfig;
}