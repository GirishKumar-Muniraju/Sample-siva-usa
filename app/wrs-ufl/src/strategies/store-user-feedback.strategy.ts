import { ValidationHelper } from '../utils/validation-helper';
import { ALBEvent, ALBResult } from 'aws-lambda';
import { IStoreUserFeedbackPayload } from '../core/interfaces/store-user-feedback-payload.interface';
import { ErrorHandlingHelper } from '../utils/error-handling-helper';
import { LambdaResponseHelper } from '../utils/lambda-response-helper';
import { UserFeedbackManager } from '../core/managers/_user-feedback-manager.interface';
import { LambdaStrategy } from './lambda-strategy.interface';
import { AuthorizationHandler } from '../core/oauth2/authorization-handler';
import * as schema from '../schema/user-feedback.schema.json';

export const authorizationHandler = new AuthorizationHandler();

export class StoreUserFeedbackStrategy implements LambdaStrategy {
    userFeedbackManager: UserFeedbackManager;

    constructor(userFeedbackManager: UserFeedbackManager) {
        this.userFeedbackManager = userFeedbackManager;
    }

    async validate(event: ALBEvent): Promise<void> {
        ValidationHelper.throwIfSchemaNotValid(event, schema, 'Bad Request');
    }

    async execute(event: ALBEvent, pathParams: Map<string, string>): Promise<ALBResult> {
        let response: ALBResult = null;
        try {
            await authorizationHandler.handle(event.headers);
            const result = await this.userFeedbackManager.storeFeedback(JSON.parse(event.body) as IStoreUserFeedbackPayload);
            response = LambdaResponseHelper.sendApiResponse(200, result, null, null, false, event.headers);
        } catch (err) {
            response = ErrorHandlingHelper.handle(err as Error);
        }
        return response;
    }
}
