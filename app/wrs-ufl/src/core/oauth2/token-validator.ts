import { JwksProviderFactory } from './jwks-provider-factory';
import { IJwksProvider } from './jwks-provider.interface';
import { TokenValidatorConfig } from './token-validator-config.interface';
import { Jwks } from './jwks.interface';
import moment from 'moment';
import jwt2Pem from 'jwk-to-pem';
import { JwtHelper } from './jwt-helper';
import * as jsonwebtoken from 'jsonwebtoken';

export class TokenValidator {
    jwksProvider: IJwksProvider;
    jwks: Jwks;
    private pems: { [key: string]: string } = {};
    jwtHelper = new JwtHelper();
    isInitialized = false;

    constructor(public config?: TokenValidatorConfig) { }

    async initialize() {
        if (this.isInitialized) { return; }

        this.jwksProvider = await JwksProviderFactory.create();
        await this.jwksProvider.initialize();
        this.isInitialized = true;
    }

    async validate(token: { jwt: jsonwebtoken.Jwt, token: string }) {
        if (!this.isInitialized) { await this.initialize(); }

        // Get JSON Web Key Set
        try {
            const jwks = await this.jwksProvider.provide();
            if (jwks != null && this.jwks !== jwks) {
                if (jwks.keys) {
                    jwks.keys.forEach((k) => {
                        this.pems[k.kid] = jwt2Pem({
                            kty: 'RSA',
                            n: k.n,
                            e: k.e,
                        });
                    });
                }
            }
            this.jwks = jwks;
        } catch (ex) {
            throw new Error('Error occured while loading JWKS');
        }

        // Check if JWKS found
        if (!this.jwks || !this.jwks.keys) {
            throw new Error('Json Web Keys are not found');
        }

        // Verify Key
        const jwk = this.jwks.keys.find(k => k.kid === token.jwt.header.kid);
        if (!jwk) {
            throw new Error('Token is not issued by valid issuer.');
        }

        // Check expiration
        const currentTimestamp = moment.utc().unix();
        if (token.jwt.payload.exp < currentTimestamp) {
            throw new Error('Expired Token');
        }

        const pem = this.pems[token.jwt.header.kid];
        const result = await this.jwtHelper.verify(token.token, pem,
            token.jwt.payload.iss);

        if (!result) {
            throw new Error('Invalid Token');
        }
    }
}
