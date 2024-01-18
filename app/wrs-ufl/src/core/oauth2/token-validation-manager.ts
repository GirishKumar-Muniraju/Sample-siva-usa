import dotenv from 'dotenv';
import * as jsonwebtoken from 'jsonwebtoken';
import { Utility } from '../../utils/utility';
import { JwtHelper } from './jwt-helper';
import { TokenValidationManagerConfig } from './token-validation-manager-config.interface';
import { TokenValidator } from './token-validator';
dotenv.config();

export class TokenValidationManager {
    isInitialized = false;
    validators = new Map<string, TokenValidator>();
    sharedValidator: TokenValidator;
    jwtHelper = new JwtHelper();

    constructor(public config?: TokenValidationManagerConfig) { }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        if (this.config) {
            for (const tvc of this.config.tokenValidators) {
                const tokenValidator = new TokenValidator(tvc);
                await tokenValidator.initialize();
                this.validators.set(tvc.issuer, tokenValidator);
            }
        }

        this.sharedValidator = new TokenValidator();
        await this.sharedValidator.initialize();
        this.isInitialized = true;
    }

    async validate(token: string) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        // decode jwt token and check if token issuer is registered
        const jwt = this.jwtHelper.decode(token);
        await this.validateJwt(token, jwt);

        // Extracts slid from token
        const slid = Utility.extractSlid(jwt.payload.username);
        return slid;
    }

    private async validateJwt(token: string, jwt: jsonwebtoken.Jwt) {
        if (!jwt) {
            throw new Error('Invalid Json Web token.');
        }

        let tokenValidator = this.sharedValidator;

        if (this.config) {
            if (!this.validators.has(jwt.payload.iss)) {
                throw new Error('Token is not issued by registered issuer.');
            }

            // get token validator instance by issuer
            tokenValidator = this.validators.get(jwt.payload.iss);
        }

        await tokenValidator.validate({
            token,
            jwt,
        });
    }
}
