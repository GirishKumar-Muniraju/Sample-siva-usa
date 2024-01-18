import { TokenValidatorConfig } from './token-validator-config.interface';

export interface TokenValidationManagerConfig {
    tokenValidators: TokenValidatorConfig[];
}