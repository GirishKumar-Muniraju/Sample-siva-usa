import { ALBEvent, ALBResult } from 'aws-lambda';

export interface LambdaStrategy {
    validate(event: ALBEvent): Promise<void>;
    execute(event: ALBEvent, pathParams: Map<string, string>): Promise<ALBResult>;
}