import { JwksProviderParameter } from './jwks-provider-paremeter.interface';
import { IJwksProvider } from './jwks-provider.interface';
import { Jwks } from './jwks.interface';
import AWSSdk from 'aws-sdk';
import AWSXray from 'aws-xray-sdk-core';
import dotenv from 'dotenv';
dotenv.config();
// Enable XRay tracing
const AWS = process.env.API_SERVER ? AWSSdk : AWSXray.captureAWS(AWSSdk);

export class SsmAwsCognitoJwksProvider implements IJwksProvider {
    isInitialized = false;
    ssmClient: AWS.SSM;
    jwks: Jwks = null;
    private lastCachedTimestamp: number;
    constructor(public parameters?: JwksProviderParameter[]) {
    }

    async initialize() {
        if (this.isInitialized) { return; }
        const region = this.getRegion();
        this.ssmClient = process.env.SSM_ENDPOINT ?
            new AWS.SSM({ region, endpoint: process.env.SSM_ENDPOINT }) :
            new AWS.SSM({ region });
        this.lastCachedTimestamp = new Date().getTime();
        this.isInitialized = true;
    }

    async provide(): Promise<Jwks> {
        if (!this.isInitialized) {
            await this.initialize();
        }
        const currentTimestamp = (new Date().getTime()) / 1000;
        const duration = currentTimestamp - this.lastCachedTimestamp;
        const cacheTimeoutInSeconds = this.getCacheTimeoutInSeconds();
        if (this.jwks === null || duration > cacheTimeoutInSeconds) {
            this.jwks = await this.getJwks();
            this.lastCachedTimestamp = currentTimestamp;
        }

        return this.jwks;
    }

    private async getJwks(): Promise<Jwks> {

        const ssmParameter = process.env.DEBUG_COGNITO_JWKS ? JSON.parse(process.env.DEBUG_COGNITO_JWKS) :
            await this.ssmClient.getParameter({
                Name: process.env.COGNITO_JWKS,
                WithDecryption: this.getWithDecryption(),
            }).promise();
        return typeof ssmParameter.Parameter.Value === 'string' ?
            JSON.parse(ssmParameter.Parameter.Value) :
            ssmParameter.Parameter.Value;
    }

    private getRegion() {
        return process.env.ARS_USER_AWS_REGION;
    }

    private getWithDecryption() {
        return true;
    }

    private getCacheTimeoutInSeconds() {
        return  parseInt(process.env.CACHED_TIMEOUT, 10);
    }
}
