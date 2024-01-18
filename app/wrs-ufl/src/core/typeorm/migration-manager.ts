import { Logger } from './../../utils/logger';
import { DaoConnectionManager } from './dao-connection-manager';

type ACTION = 'RUN' | 'REVERT';
export class MigrationManager {
    static RUN: ACTION = 'RUN';
    static REVERT: ACTION = 'REVERT';
    action: ACTION;

    constructor(action: ACTION) {
        this.action = action;
    }

    async execute(connectionName: string): Promise<void> {
        if (process.env.TYPEORM_MIGRATIONS_RUN !== 'true') {
            throw new Error('Migrations are not enabled');
        }

        const executor = {
            [MigrationManager.RUN]: () => this.runMigrations(connectionName),
            [MigrationManager.REVERT]: () => this.revertLastMigration(connectionName)
        };

        if (!executor[this.action]) {
            throw new Error(`Invalid migration action: ${this.action}`);
        }

        await executor[this.action]();
    }

    private async runMigrations(connectionName: string): Promise<void> {
        Logger.info('Initializing migration execution');
        Logger.info(`Running migrations for connection ${connectionName}`);

        if (process.env.TYPEORM_MIGRATIONS_RUN !== 'true') {
            throw new Error('Migrations are not enabled');
        }

        const connection = await DaoConnectionManager.getConnection(connectionName);
        await connection.runMigrations();

        Logger.info(`Migrations completed for connection ${connectionName}`);
    }

    private async revertLastMigration(connectionName: string): Promise<void> {
        Logger.info('Initializing revert migration execution');
        Logger.info(`Reverting last migration for connection ${connectionName}`);

        if (process.env.TYPEORM_MIGRATIONS_RUN !== 'true') {
            throw new Error('Migrations are not enabled');
        }

        const connection = await DaoConnectionManager.getConnection(connectionName);
        await connection.undoLastMigration();

        Logger.info(`Reverting last migration completed for connection ${connectionName}`);
    }
}
