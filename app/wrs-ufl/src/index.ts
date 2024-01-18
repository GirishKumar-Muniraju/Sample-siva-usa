import { ALBEvent, ALBResult } from 'aws-lambda';
import AWSSdk from 'aws-sdk';
import AWSXray from 'aws-xray-sdk-core';
import dotenv from 'dotenv';
import { LambdaStrategyFactory } from './strategies/lambda-strategy-factory';
import { DbSecretsHelper } from './utils/db-secrets-helper';
import { ErrorHandlingHelper } from './utils/error-handling-helper';
import { LambdaResponseHelper } from './utils/lambda-response-helper';
import { Logger } from './utils/logger';

dotenv.config();
// Enable XRay tracing.
const AWS = process.env.API_SERVER ? AWSSdk : AWSXray.captureAWS(AWSSdk);

AWS.config.update({
    region: process.env.ARS_USER_AWS_REGION
});

export const strategyFactory = new LambdaStrategyFactory();
export const dbSecretsHelper = new DbSecretsHelper();

/**
 * A lambda handler
 * @param  event - An ALBEvent
 * @returns Promise which returns ALBResult
 */
export const handler = async (event: ALBEvent): Promise<ALBResult> => {
    let response: ALBResult = null;
    Logger.info(JSON.stringify(event));
    try {

        // Load Database secrets
        await dbSecretsHelper.setDbSecrets();

        /**
         * Creates a strategy method and path parameters based on the ALBEvent
         * @param  event - An ALBEvent
         */
        const output = await strategyFactory.create(event);
        if (output.strategy) {
            // Validate event. It throws ValidationError exception
            await output.strategy.validate(event);
            // Execute the strategy method
            response = await output.strategy.execute(event, output.pathParams);
        } else {
            Logger.info(`[lambda-index]::handler Strategy not found for event - ${JSON.stringify(event)}`);
            // Send API Response as Strategy not found
            response = LambdaResponseHelper.sendApiResponse(500, null, 'Strategy not found');
        }
    } catch (ex) {
        Logger.info(`[lambda-index]::handler Error for event - ${JSON.stringify(event)} is ${ex}`);
        // Send API Response for exceptions
        response = ErrorHandlingHelper.handle(ex as Error);
    }
    return response;
};
