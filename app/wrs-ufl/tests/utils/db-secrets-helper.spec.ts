import * as AWSMock from 'aws-sdk-mock';
import { GetSecretValueRequest, GetSecretValueResponse } from 'aws-sdk/clients/secretsmanager';
import { expect } from 'chai';
import { DbSecretsHelper } from './../../src/utils/db-secrets-helper';

describe('DB Secrets Helper Tests', () => {
    beforeEach(() => {
        process.env.DB_SECRET_NAME = 'secret_name';
        process.env.SES_CONFIG_SET = 'ConfigSet';

        if (process.env.API_SERVER) {
            delete process.env.API_SERVER;
        }

        if (process.env.IS_TESTING) {
            delete process.env.IS_TESTING;
        }
    });

    afterEach(() => {
        AWSMock.restore();
        process.env.IS_TESTING = 'true';
    });

    it('should set db secrets', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', async (params: GetSecretValueRequest) => {
            return {
                SecretString: JSON.stringify({
                    HOST: 'host',
                    USERID: 'username',
                    PASSWORD: 'password',
                    DBNAME: 'database',
                    PORT: 'port'
                })
            };
        });
        const dbSecretsHelper = new DbSecretsHelper();
        await dbSecretsHelper.setDbSecrets();
        expect(process.env.TYPEORM_HOST).to.equal('host');
        expect(process.env.TYPEORM_USERNAME).to.equal('username');
        expect(process.env.TYPEORM_PASSWORD).to.equal('password');
        expect(process.env.TYPEORM_DATABASE).to.equal('database');
        expect(process.env.TYPEORM_PORT).to.equal('port');
    });

    it('should have db secrets set already', async () => {
        AWSMock.mock('SecretsManager', 'getSecretValue', async (params: GetSecretValueRequest) => {
            return {
                SecretString: JSON.stringify({
                    HOST: 'host',
                    USERID: 'username',
                    PASSWORD: 'password',
                    DBNAME: 'database',
                    PORT: 'port'
                })
            };
        });
        const dbSecretsHelper = new DbSecretsHelper();
        await dbSecretsHelper.setDbSecrets();
        await dbSecretsHelper.setDbSecrets();
        expect(process.env.TYPEORM_HOST).to.equal('host');
        expect(process.env.TYPEORM_USERNAME).to.equal('username');
        expect(process.env.TYPEORM_PASSWORD).to.equal('password');
        expect(process.env.TYPEORM_DATABASE).to.equal('database');
        expect(process.env.TYPEORM_PORT).to.equal('port');
    });

    it('should set db secrets - 2', async () => {
        AWSMock.mock(
            'SecretsManager',
            'getSecretValue',
            async (params: GetSecretValueRequest): Promise<GetSecretValueResponse> => {
                return {
                    SecretBinary: Buffer.from(
                        JSON.stringify({
                            HOST: 'host',
                            USERID: 'username',
                            PASSWORD: 'password',
                            DBNAME: 'database',
                            PORT: 'port'
                        })
                    ).toString('base64')
                };
            }
        );
        const dbSecretsHelper = new DbSecretsHelper();
        await dbSecretsHelper.setDbSecrets();
        expect(process.env.TYPEORM_HOST).to.equal('host');
        expect(process.env.TYPEORM_USERNAME).to.equal('username');
        expect(process.env.TYPEORM_PASSWORD).to.equal('password');
        expect(process.env.TYPEORM_DATABASE).to.equal('database');
        expect(process.env.TYPEORM_PORT).to.equal('port');
    });
});
