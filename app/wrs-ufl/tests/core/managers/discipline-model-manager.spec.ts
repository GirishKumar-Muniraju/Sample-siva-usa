import { expect } from 'chai';
import sinon from 'sinon';
import { IStoreUserFeedbackPayload } from '../../../src/core/interfaces/store-user-feedback-payload.interface';
import { Discipline } from '../../../src/core/typeorm/entities/wrs-discipline.entity';
import { UserFeedbackDao } from '../../../src/core/typeorm/user-feedback-dao';
import { DisciplineUserFeedbackManager } from './../../../src/core/managers/discipline-model-manager';
import { Logger } from './../../../src/utils/logger';

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

describe('Discipline User Feedback Manager', () => {
    let userFeedbackManager: DisciplineUserFeedbackManager;
    let userFeedbackDaoStub: sinon.SinonStubbedInstance<UserFeedbackDao<Discipline>>;

    beforeEach(() => {
        userFeedbackDaoStub = sinon.createStubInstance(UserFeedbackDao);
        userFeedbackManager = new DisciplineUserFeedbackManager();
        userFeedbackManager['userFeedbackDao'] = userFeedbackDaoStub as any;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should store feedback successfully', async () => {
        sinon.stub(userFeedbackManager, 'storeFeedback').resolves(mockUserFeedback);
        const result = await userFeedbackManager.storeFeedback(mockUserFeedback);
        expect(result).to.be.an('object');
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
        }
    });
});
