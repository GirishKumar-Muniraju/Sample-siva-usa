import dotenv from 'dotenv';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

dotenv.config();

export const CONNECTION_NAME =  process.env.TYPEORM_CONNECTION_NAME || 'WRSUserFeedbackConnection';
export const DS_SCHEMA =  process.env.TYPEORM_CONNECTION_SCHEMA || 'ds_transactional';

export function getDSConfig() {
    return {
        type: 'postgres',
        host: process.env.TYPEORM_HOST,
        name: CONNECTION_NAME,
        port: Number(process.env.TYPEORM_PORT),
        username: process.env.TYPEORM_USERNAME,
        password: process.env.TYPEORM_PASSWORD,
        database: process.env.TYPEORM_DATABASE,
        synchronize: false,
        logging: process.env.TYPEORM_LOGGING ? Boolean(process.env.TYPEORM_LOGGING) : false,
        entities:  [
          path.join(__dirname, '../core/typeorm/entities/*.ts'),
          path.join(__dirname, '../core/typeorm/entities/*.js'), // in Lambda, we use the compiled js files
        ],
        migrations: [
          path.join(__dirname, '../core/typeorm/migrations/*.ts'),
          path.join(__dirname, '../core/typeorm/migrations/*.js'), // in Lambda, we use the compiled js files
        ],
        migrationsRun: Boolean(process.env.TYPEORM_MIGRATIONS_RUN) || false,
        migrationsTableName: 'wrs_ufl_migrations',
        schema: DS_SCHEMA,
    } as DataSourceOptions;
}
