import { JwksProviderParameter } from './jwks-provider-paremeter.interface';

export interface JwksProviderConfig {
    jwksProviderClass: string;
    parameters: JwksProviderParameter[];
}