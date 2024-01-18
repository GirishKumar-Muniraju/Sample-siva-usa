import { Jwks } from './jwks.interface';

export interface IJwksProvider {
    initialize(): Promise<void>;
    provide(): Promise<Jwks>;
}