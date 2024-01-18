import { TokenValidationManager } from '../oauth2/token-validation-manager';
import { ApiError } from '../../models/api-error';
import { ValidationHelper } from '../../utils/validation-helper';

export class AuthorizationHandler {
    private initialized = false;
    manager: TokenValidationManager;
    async initialize() {
        if (this.initialized) {
            return;
        }

        this.manager = new TokenValidationManager();
        await this.manager.initialize();
        this.initialized = true;
    }

    async handle(requestHeaders: { [name: string]: string | undefined }) {
        if (!this.initialized) {
            await this.initialize();
        }

        ValidationHelper.throwIfAuthHeaderMissing(requestHeaders);
        let token = requestHeaders.Authorization || requestHeaders.authorization;
        token = token ? token.replace('Bearer ', '') : token;
        try {
            await this.manager.validate(token);
        } catch (ex) {
            const error = ex as Error;
            throw new ApiError(403, error.message);
        }
    }
}