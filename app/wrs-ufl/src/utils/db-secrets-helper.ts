import AWSSdk from 'aws-sdk';
import AWSXray from 'aws-xray-sdk-core';
import { Logger } from './logger';
import dotenv from 'dotenv';
dotenv.config();

// Enable XRay tracing
const AWS = process.env.API_SERVER ? AWSSdk : AWSXray.captureAWS(AWSSdk);

AWS.config.update({
    region: process.env.ARS_USER_AWS_REGION
});

export class DbSecretsHelper {
    secretsManager = new AWS.SecretsManager();
    secretsLoaded = false;

    async setDbSecrets() {
        if (this.secretsLoaded || process.env.API_SERVER === 'true' || process.env.IS_TESTING === 'true') {
            return;
        }

        const data = await this.secretsManager.getSecretValue({ SecretId: process.env.DB_SECRET_NAME }).promise();

        const secretJsonString = data.SecretBinary
            ? Buffer.from(data.SecretBinary.toString(), 'base64').toString()
            : data.SecretString;

        const secrets = JSON.parse(secretJsonString);
        process.env.TYPEORM_HOST = secrets.HOST;
        process.env.TYPEORM_USERNAME = secrets.USERID;
        process.env.TYPEORM_PASSWORD = secrets.PASSWORD;
        process.env.TYPEORM_DATABASE = secrets.DBNAME;
        process.env.TYPEORM_PORT = secrets.PORT;
        this.secretsLoaded = true;
        Logger.info(
            JSON.stringify(
                {
                    TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
                    TYPEORM_PASSWORD: typeof process.env.TYPEORM_PASSWORD !== 'undefined' ? '******' : undefined,
                    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
                    TYPEORM_PORT: process.env.TYPEORM_PORT,
                    TYPEORM_HOST: process.env.TYPEORM_HOST
                },
                null,
                2
            )
        );
    }
}
