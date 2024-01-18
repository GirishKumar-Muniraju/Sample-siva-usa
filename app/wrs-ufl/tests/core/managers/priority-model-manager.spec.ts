import { expect } from 'chai';
import sinon from 'sinon';
import { IStoreUserFeedbackPayload } from '../../../src/core/interfaces/store-user-feedback-payload.interface';
import { PriorityUserFeedbackManager } from '../../../src/core/managers/priority-model-manager';
import { UserFeedbackDao } from '../../../src/core/typeorm/user-feedback-dao';
import { Logger } from '../../../src/utils/logger';
import { Priority } from './../../../src/core/typeorm/entities/wrs-priority.entity';

const mockUserFeedback: IStoreUserFeedbackPayload = {
    id: '',
    wrNumber: '',
    facility: '',
    uCode: '',
    workAgainstCode: '',
    troubleBrkdwn: '',
    opsReview: '',
    equipGroupType: '',
    equipClass: '',
    nucApplicableMode: '',
    fid: '',
    spv: '',
    mrule: '',
    ist: '',
    cda: '',
    safeSd: '',
    ePlan: '',
    fireProt: '',
    fireProt2: '',
    apprFire: '',
    flex: '',
    licRenew: '',
    equipBin: '',
    targetOutageInd: '',
    targetPriority: '',
    eCode: '',
    equipmentNumber: '',
    equipmentName: '',
    equipmentType: '',
    systemCode: '',
    locationDesc: '',
    description: '',
    detailedDescription: '',
    eCodeOutageYes: '',
    eCodeOutageNo: '',
    equipTypeOutageYes: '',
    equipTypeOutageNo: '',
    equipGroupIdOutageYes: '',
    equipGroupIdOutageNo: '',
    eCodeTrblBrkYes: '',
    eCodeTrblBrkNo: '',
    eCodeAverageTrblBrk12Mo: '',
    eCodeMaxTrblBrk12Mo: '',
    eCodeMinTrblBrk12Mo: '',
    modelName: '',
    modelVersion: '',
    modelRecommendation: '',
    modelProbability: '',
    userDecision: '',
    slid: 'testSlid'
};

describe('Priority User Feedback Manager', () => {
    let userFeedbackManager: PriorityUserFeedbackManager;
    let userFeedbackDaoStub: sinon.SinonStubbedInstance<UserFeedbackDao<Priority>>;

    beforeEach(() => {
        userFeedbackDaoStub = sinon.createStubInstance(UserFeedbackDao);
        userFeedbackManager = new PriorityUserFeedbackManager();
        userFeedbackManager['userFeedbackDao'] = userFeedbackDaoStub as any;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should store feedback successfully', async () => {
        userFeedbackDaoStub.storeFeedback.resolves(mockUserFeedback as any);

        const result = await userFeedbackManager.storeFeedback(mockUserFeedback);
        expect(result).to.be.an('object');

        sinon.assert.calledOnce(userFeedbackDaoStub.storeFeedback);
        const expectedInput = sinon.match.has('slid', mockUserFeedback.slid);
        sinon.assert.calledWith(userFeedbackDaoStub.storeFeedback, sinon.match(expectedInput));
    });

    it('should log an error and throw if an error occurs', async () => {
        const error = new Error('Test error');
        userFeedbackDaoStub.storeFeedback.rejects(error);
        const loggerSpy = sinon.spy(Logger, 'error');

        try {
            await userFeedbackManager.storeFeedback(mockUserFeedback);
            expect.fail('Error was not thrown');
        } catch (caughtError) {
            expect(caughtError).to.equal(error);
            sinon.assert.calledOnce(loggerSpy);
            sinon.assert.calledWith(loggerSpy, 'An error occurred to store user feedback for Priority: ', error);
        }
    });
});
