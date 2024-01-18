import { ALBResult } from 'aws-lambda';
import chai from 'chai';
import spies from 'chai-spies';
import { afterEach, beforeEach } from 'mocha';
import sinon from 'sinon';
import { OutageUserFeedbackManager } from '../src/core/managers/outage-model-manager';
import { dbSecretsHelper, handler, strategyFactory } from '../src/index';
import { LambdaStrategyFactoryOutput } from '../src/strategies/lambda-strategy-factory-output.interface';
import { StoreUserFeedbackStrategy } from '../src/strategies/store-user-feedback.strategy';
chai.use(spies);
const expect = chai.expect;

describe('Request manager unit test', () => {
    beforeEach(() => {
        sinon.stub(dbSecretsHelper, 'setDbSecrets').callsFake(() => {
            return new Promise<void>(resolve => {
                resolve();
            });
        });
    });

    afterEach(() => {
        chai.spy.restore();
        sinon.restore();
    });

    it('should not retrieve the null response for store user feedback strategy', async () => {
        const strategy = new StoreUserFeedbackStrategy(new OutageUserFeedbackManager());
        const createSpy = chai.spy.on(strategyFactory, 'create', () => {
            return new Promise<LambdaStrategyFactoryOutput>(resolver => {
                resolver({
                    strategy,
                    pathParams: new Map()
                });
            });
        });

        const validateSpy = chai.spy.on(strategy, 'validate', () => {
            return new Promise<void>(resolve => {
                resolve();
            });
        });

        const getVendorData = {
            requestContext: {
                elb: {
                    targetGroupArn:
                        'arn:aws:elasticloadbalancing:region:123456789012:targetgroup/my-target-group/6d0ecf831eec9f09'
                }
            },
            httpMethod: 'POST',
            path: '/api/ars/v1/user/feedback',
            isBase64Encoded: false,
            body: JSON.stringify({
                arNumber: '',
                modelId: '',
                recommendationCAQ: '',
                recommendationSL: ''
            })
        };

        const executeSpy = chai.spy.on(strategy, 'execute', () => {
            return new Promise<ALBResult>(resolve => {
                resolve({
                    statusCode: 200
                });
            });
        });

        const result = await handler(getVendorData);
        expect(result).to.be.not.null;
        expect(result.statusCode).to.be.equal(200);
        expect(createSpy).to.have.been.called.once;
        expect(executeSpy).to.have.been.called.once;
        expect(validateSpy).to.have.been.called.once;
    });

    it('should retrieve the null response', async () => {
        const create = sinon.stub(strategyFactory, 'create').callsFake(
            (): Promise<LambdaStrategyFactoryOutput> => {
                return new Promise(resolver => {
                    const response = {
                        strategy: null,
                        pathParams: null
                    };
                    resolver((response as unknown) as LambdaStrategyFactoryOutput);
                });
            }
        );

        const getVendorData = {
            requestContext: {
                elb: {
                    targetGroupArn:
                        'arn:aws:elasticloadbalancing:region:123456789012:targetgroup/my-target-group/6d0ecf831eec9f09'
                }
            },
            httpMethod: 'GET',
            path: '/api/edp/v1/equipment/',
            isBase64Encoded: false,
            body: null
        };

        const result = await handler(getVendorData);
        expect(result).to.be.not.null;
        expect(result.statusCode).to.be.equal(500);
        const body = JSON.parse(result.body as string);
        expect(body.statusMessage).to.be.equal('Strategy not found');
        create.restore();
    });

    it('should throw exception for handler', async () => {
        const strategy = new StoreUserFeedbackStrategy(new OutageUserFeedbackManager());
        const create = sinon.stub(strategyFactory, 'create').callsFake(() => {
            return new Promise<LambdaStrategyFactoryOutput>(resolver => {
                resolver({
                    strategy,
                    pathParams: new Map()
                });
            });
        });
        chai.spy.on(strategy, 'validate', () => {
            return new Promise<void>(resolve => {
                resolve();
            });
        });

        const execute = sinon.stub(strategy, 'execute').throws(new Error('Oops !! there is a internal server problem'));
        const getVendorData = {
            requestContext: {
                elb: {
                    targetGroupArn:
                        'arn:aws:elasticloadbalancing:region:123456789012:targetgroup/my-target-group/6d0ecf831eec9f09'
                }
            },
            httpMethod: 'GET',
            path: '/api/edp/v1/equipmenttypes',
            isBase64Encoded: false,
            body: null,
            queryStringParameters: {
                site: ''
            }
        };

        const result = await handler(getVendorData);
        expect(result.statusCode).to.be.equal(500);
        create.restore();
        execute.restore();
    });
});
