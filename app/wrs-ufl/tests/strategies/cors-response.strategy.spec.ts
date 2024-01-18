import chai from 'chai';
import spies from 'chai-spies';
import chaiPromised from 'chai-as-promised';
chai.use(spies);
chai.use(chaiPromised);
import Sinon from 'sinon';
import { CorsResponse } from '../../src/strategies/cors-response.strategy';
import { LambdaResponseHelper } from '../../src/utils/lambda-response-helper';
const expect = chai.expect;

describe('CORS response strategy tests', async function () {
    const corsResponse = new CorsResponse();
    const sampleCorsResponseRequest = {
        'requestContext': {
            'elb': {
                'targetGroupArn': 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
            }
        },
        'httpMethod': 'OPTIONS',
        'path': '/user-feedback',
        'isBase64Encoded': false,
        'queryStringParameters': {
            'site': ''
        },
        'body': JSON.stringify({
            arNumber: '1',
            modelId: '1',
            recommendationCaq: '1',
            userDecisionCaq: '1',
            recommendationSignif: '1',
            userDecisionSignif: '1',
            slid: 'myslid'
        }),
    };
    const samplePathParams: Map<string, string> = new Map();

    afterEach(() => {
        chai.spy.restore();
        Sinon.restore();
    });

    it('Should respond with headers, no content', async () => {
        const response = null;
        const corsResponseSpy = chai.spy.on(corsResponse, 'corsResponse', async () => {
            return response;
        });

        const result = await corsResponse.execute(sampleCorsResponseRequest, samplePathParams);
        expect(result).to.be.not.null;
        expect(result.statusCode).to.be.equal(204);
        expect(result.body).to.be.equal('null');
        expect(result.headers).to.not.be.null;
        expect(corsResponseSpy).to.have.been.called;
    });

    it('Should throw an exception for an sentApiResponse Error',async () => {
        Sinon.stub(LambdaResponseHelper, 'sendApiResponse').throws(new Error('Internal Server Error'))
        await expect(corsResponse.execute(sampleCorsResponseRequest, samplePathParams)).to.be.rejectedWith(
            'Internal Server Error'
        );
    });

    it('should not throw exception returning preflight header', async () => {
        await expect(corsResponse.validate(sampleCorsResponseRequest)).to.be.fulfilled;
    });
});
