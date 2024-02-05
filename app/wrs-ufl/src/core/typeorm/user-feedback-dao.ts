import { CONNECTION_NAME } from '../../config/datasource-config';
import { DataSource, EntityTarget, QueryFailedError, Repository } from 'typeorm';
import { ApiError } from '../../models/api-error';
import { Logger } from '../../utils/logger';
import { DaoConnectionManager } from './dao-connection-manager';

export class NeoReleaseInfoDao<T> {
    private entityTarget: EntityTarget<T>;

    constructor(entity: EntityTarget<T>) {
        this.entityTarget = entity;
    }

    async storeFeedback(entity: T): Promise<T> {
        try {
            const connection: DataSource = await DaoConnectionManager.getConnection(CONNECTION_NAME);
            const repository: Repository<T> = connection.getRepository(this.entityTarget);
            const response = await repository.save(entity);
            Logger.debug(`[user-feedback-dao]::storeFeedback - ${JSON.stringify(response)}`);
            return response;
        } catch (err) {
            this.handleError(err, 'storeFeedback');
        }
    }

    private handleError(err: Error | unknown, methodName: string): void {
        if (err instanceof QueryFailedError) {
            Logger.error(`[user-feedback-dao]::${methodName}`, err.message);
            throw new ApiError(400, err.message);
        }
        Logger.error(`[user-feedback-dao]::${methodName}`, err);
        throw err;
    }
}
