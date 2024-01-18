import { LambdaStrategyFactory as LambdaStrategyFactoryType } from './../../src/strategies/lambda-strategy-factory';
import { expect } from 'chai';
import { after, before, it } from 'mocha';
import proxyquire from 'proxyquire';

describe('Lambda strategy factory unit tests', async function() {
    let LambdaStrategyFactory: typeof LambdaStrategyFactoryType;

    const sampleDataForNullStrategy = {
        requestContext: {
            elb: {
                targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
            }
        },
        httpMethod: 'GET',
        path: '/api/edp/test',
        isBase64Encoded: false,
        body: null
    };

    const sampleUserFeedback = {
        requestContext: {
            elb: {
                targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
            }
        },
        httpMethod: 'POST',
        path: '/outage',
        isBase64Encoded: false,
        body: JSON.stringify({
            arNumber: '',
            modelId: '',
            recommendationCAQ: '',
            recommendationSL: ''
        })
    };

    const mockConfig = {
        endpointPrefix: ''
    };

    before(() => {
        process.env['WRS_ENDPOINT_PREFIX'] = '';

        LambdaStrategyFactory = proxyquire('../../src/strategies/lambda-strategy-factory', {
            '../config/app-config': { config: mockConfig }
        }).LambdaStrategyFactory;
    });

    it('Should return the null strategy', async () => {
        const strategy = new LambdaStrategyFactory();
        const output = await strategy.create(sampleDataForNullStrategy);
        expect(output.strategy).to.be.null;
    });

    it('should return parsed path parameter and strategy for storing user feedback', async () => {
        const strategy = new LambdaStrategyFactory();
        const output = await strategy.create(sampleUserFeedback);
        expect(output.strategy).to.be.not.null;
        expect(output.pathParams).to.be.not.null;
    });

    after(() => {
        delete process.env['WRS_ENDPOINT_PREFIX'];
    });
});
