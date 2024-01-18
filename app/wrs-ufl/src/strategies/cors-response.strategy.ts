import { ALBEvent, ALBResult } from 'aws-lambda';
import { LambdaStrategy } from '../strategies/lambda-strategy.interface';
import { LambdaResponseHelper } from '../utils/lambda-response-helper';
import { ErrorHandlingHelper } from '../utils/error-handling-helper';

export class CorsResponse implements LambdaStrategy {

    corsResponse: void;

    async validate(event: ALBEvent): Promise<void> {
        return;
    }
    async execute(event: ALBEvent, pathParams: Map<string, string>): Promise<ALBResult> {
        let response: ALBResult = null;
        try {
            response = LambdaResponseHelper.sendApiResponse(204, null, null, null, true, event.headers);
        } catch (err) {
            response = ErrorHandlingHelper.handle(err as Error);
        }
        return response;
    }
}
