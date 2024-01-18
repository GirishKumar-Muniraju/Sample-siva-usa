import { ALBEvent, ALBResult } from 'aws-lambda';
import { CONNECTION_NAME } from '../config/datasource-config';
import { AuthorizationHandler } from '../core/oauth2/authorization-handler';
import { MigrationManager } from '../core/typeorm/migration-manager';
import { ErrorHandlingHelper } from '../utils/error-handling-helper';
import { LambdaResponseHelper } from '../utils/lambda-response-helper';
import { LambdaStrategy } from './lambda-strategy.interface';

export const authorizationHandler = new AuthorizationHandler();

export class MigrationStrategy implements LambdaStrategy {
    private migrationManager: MigrationManager;

    constructor(migrationManager: MigrationManager) {
        this.migrationManager = migrationManager;
    }

    async validate(event: ALBEvent): Promise<void> {
        return;
    }

    async execute(event: ALBEvent): Promise<any> {
        let response: ALBResult = null;
        try {
            await authorizationHandler.handle(event.headers);

            await this.migrationManager.execute(CONNECTION_NAME);
            
            const message = `[${this.migrationManager.action}] executed successfully`;
            response = LambdaResponseHelper.sendApiResponse(200, { message }, null, null, false, event.headers);
        } catch (error) {
            response = ErrorHandlingHelper.handle(error as Error);
        }
        return response;
    }
}
