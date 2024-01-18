import { LambdaStrategy } from './lambda-strategy.interface';

export interface LambdaStrategyFactoryOutput {
    strategy: LambdaStrategy;
    pathParams: Map<string, string>;
}