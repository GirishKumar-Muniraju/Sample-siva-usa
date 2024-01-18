import { OutageUserFeedbackManager } from './../../src/core/managers/outage-model-manager';
import chai from 'chai';
import spies from 'chai-spies';
import chaiPromised from 'chai-as-promised';
chai.use(spies);
chai.use(chaiPromised);
import Sinon from 'sinon';
import {
    StoreUserFeedbackStrategy as StoreUserFeedback,
    authorizationHandler
} from '../../src/strategies/store-user-feedback.strategy';
const expect = chai.expect;

describe('Store User Feedback strategy tests', async function() {
    const storeUserFeedback = new StoreUserFeedback(new OutageUserFeedbackManager());
    const sampleStoreUserFeedbackRequest = {
        requestContext: {
            elb: {
                targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
            }
        },
        httpMethod: 'POST',
        path: '/user-feedback',
        isBase64Encoded: false,
        queryStringParameters: {
            site: ''
        },
        body: JSON.stringify({
            wrNumber: '123',
            facility: 'SEA',
            uCode: 'x',
            workAgainstCode: 'x',
            troubleBrkdwn: 'x',
            opsReview: 'x',
            equipGroupType: 'x',
            equipClass: 'x',
            nucApplicableMode: 'x',
            fid: 'x',
            spv: 'x',
            mrule: 'x',
            ist: 'x',
            cda: 'x',
            safeSd: 'x',
            ePlan: 'x',
            fireProt: 'x',
            fireProt2: 'x',
            apprFire: 'x',
            flex: 'x',
            licRenew: 'x',
            equipBin: 'x',
            targetOutageInd: 'x',
            targetPriority: 'x',
            eCode: 'x',
            equipmentNumber: 'x',
            equipmentName: 'x',
            equipmentType: 'x',
            systemCode: 'x',
            locationDesc: 'x',
            description: 'x',
            detailedDescription: 'x',
            eCodeOutageYes: 'x',
            eCodeOutageNo: 'x',
            equipTypeOutageYes: 'x',
            equipTypeOutageNo: 'x',
            equipGroupIdOutageYes: 'x',
            equipGroupIdOutageNo: 'x',
            eCodeTrblBrkYes: 'x',
            eCodeTrblBrkNo: 'x',
            eCodeAverageTrblBrk12Mo: 'x',
            eCodeMaxTrblBrk12Mo: 'x',
            eCodeMinTrblBrk12Mo: 'x',
            modelName: 'x',
            modelVersion: 'x',
            modelRecommendation: 'x',
            modelProbability: 'x',
            userDecision: 'x',
            slid: 'slidTest'
        })
    };
    const samplePathParams: Map<string, string> = new Map();

    afterEach(() => {
        chai.spy.restore();
        Sinon.restore();
    });

    it('Should store user feedback', async () => {
        const response = {
            equipmentTypes: []
        };
        const userFeedbackSpy = chai.spy.on(storeUserFeedback.userFeedbackManager, 'storeFeedback', async () => {
            return response;
        });

        const authorizationHandlerSpy = chai.spy.on(authorizationHandler, 'handle', () => {
            return new Promise<void>(resolver => {
                resolver();
            });
        });
        const result = await storeUserFeedback.execute(sampleStoreUserFeedbackRequest, samplePathParams);
        expect(result).to.be.not.null;
        expect(result.statusCode).to.be.equal(200);
        const body = JSON.parse(result.body as string);
        expect(body).to.be.deep.equal({
            resources: [response],
            statusCode: 200,
            statusMessage: 'Success',
            success: true
        });
        expect(authorizationHandlerSpy).to.have.been.called.once;
        expect(userFeedbackSpy).to.have.been.called.once;
    });

    it('should throw exception while storing user feedback details', async () => {
        const authorizationHandlerSpy = chai.spy.on(authorizationHandler, 'handle', () => {
            return new Promise<void>(resolver => {
                resolver();
            });
        });
        Sinon.stub(storeUserFeedback.userFeedbackManager, 'storeFeedback').throws(new Error('Internal Server Error'));
        const result = await storeUserFeedback.execute(sampleStoreUserFeedbackRequest, samplePathParams);
        expect(result).to.be.not.null;
        expect(result.statusCode).to.be.equal(500);
        const body = JSON.parse(result.body as string);
        expect(body.statusCode).to.be.equal(500);
        expect(body.statusMessage).to.be.equal('Internal Server Error');
        expect(body.resources).to.be.null;
        expect(authorizationHandlerSpy).to.have.been.called.once;
    });

    it('should not throw exception for storing userFeedback request validate', async () => {
        await expect(storeUserFeedback.validate(sampleStoreUserFeedbackRequest)).to.be.fulfilled;
    });

    it('should throw an exception for storing userFeedback request validate', async () => {
        const payload = {
            ...sampleStoreUserFeedbackRequest,
            anotherProperty: true
        }
        await expect(storeUserFeedback.validate(payload)).to.be.fulfilled;
    });
});
