import { Jwk } from './jwk.interface';

export interface Jwks {
    keys: Jwk[];
    region: string;
    cognitoUserPoolId: string;
}