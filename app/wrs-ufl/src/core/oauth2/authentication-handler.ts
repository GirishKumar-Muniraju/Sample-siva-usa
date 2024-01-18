import { Logger } from '../../utils/logger';
import { NextFunction, Request, Response } from 'express';
import { TokenValidationManager } from './token-validation-manager';

export const UNAUTHORIZED_STATUS_CODE = 401;

export class AuthenticationHandler {
    tokenValidationManager: TokenValidationManager;
    isInitialized = false;

    constructor(public region: string) { }

    async initialize() {
        if (this.isInitialized) {
            return;
        }
        this.tokenValidationManager = new TokenValidationManager();
        await this.tokenValidationManager.initialize();
        this.isInitialized = true;
    }

    async handle(req: Request, res: Response, next: NextFunction) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const token = this.extractToken(req);
        if (!token) {
            res.status(UNAUTHORIZED_STATUS_CODE).send('Unauthorized');
            return;
        }

        try {
            const slid = await this.tokenValidationManager.validate(token);
            // API has been authenticated. Proceed.
            if (slid) {
                next();
            } else {
                res.status(UNAUTHORIZED_STATUS_CODE).send('Unauthorized');
            }
        } catch (err) {
            const error = err as Error;
            Logger.error('Error occurred while validating token: ' + error.message);
            // If API is not authenticated, Return 401 with error message.
            res.status(UNAUTHORIZED_STATUS_CODE).send(error.message);
        }
    }

    private extractToken(req: Request) {
        let token = req.headers.authorization;
        token = token ? token.replace('Bearer ', '') : token;
        return token;
    }
}
