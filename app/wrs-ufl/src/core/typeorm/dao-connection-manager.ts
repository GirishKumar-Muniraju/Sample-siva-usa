import { DataSource, DataSourceOptions } from 'typeorm';
import { getDSConfig } from '../../config/datasource-config';
import { Logger } from '../../utils/logger';

/**
 * For future use
 * Currently, SSM/Parameter Store is not being used
 * import { SsmConfigProvider } from '../models/ssm-config-provider';
 */

export class DaoConnectionManager {
    private constructor() {}
    private static instance: DaoConnectionManager;

    /**
     * For future use
     * Currently, SSM/Parameter Store is not being used
     * static ssmConfigProvider = new SsmConfigProvider(120, process.env.SSM_PARAMS ? JSON.parse(process.env.SSM_PARAMS) : {});
     */
    private connection: DataSource;

    public static async getConnection(connectionName: string): Promise<DataSource> {
        if (!DaoConnectionManager.instance) {
            DaoConnectionManager.instance = new DaoConnectionManager();
        }
        return await DaoConnectionManager.instance.establishConnection(connectionName);
    }

    private async establishConnection(connectionName: string) {
        try {
            if (!this.connection || !this.connection.isInitialized) {
                const defaultOptions: DataSourceOptions = getDSConfig();

                this.connection = new DataSource({ ...defaultOptions, name: connectionName });

                await this.connection.initialize();
            }

            return this.connection;
        } catch (err) {
            Logger.error('[dao-connection-manager]::daoConnectionManager', err);
            throw err;
        }
    }
}
