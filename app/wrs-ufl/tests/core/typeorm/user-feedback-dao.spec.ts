import { expect } from 'chai';
import sinon from 'sinon';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { DaoConnectionManager } from '../../../src/core/typeorm/dao-connection-manager';
import { Outage } from '../../../src/core/typeorm/entities/wrs-outage.entity';
import { UserFeedbackDao } from '../../../src/core/typeorm/user-feedback-dao';
import { ApiError } from '../../../src/models/api-error';
import { Logger } from '../../../src/utils/logger';

describe('User Feedback DAO Tests', () => {
    let userFeedbackDao: UserFeedbackDao<Outage>;
    let getConnectionStub: sinon.SinonStub;
    let repositoryStub: sinon.SinonStubbedInstance<any>;
    let mockEntity = {
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
        createUserId: '',
        updateUserId: '',
        createDateTime: new Date(),
        updateDateTime: new Date()
    };

    beforeEach(() => {
        getConnectionStub = sinon.stub(DaoConnectionManager, 'getConnection');
        repositoryStub = sinon.createStubInstance(Repository);
        const mockDataSource = sinon.createStubInstance(DataSource);
        mockDataSource.getRepository.returns(repositoryStub as any);
        getConnectionStub.resolves(mockDataSource);

        userFeedbackDao = new UserFeedbackDao(Outage);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should store feedback and return the result', async () => {
        const mockResponse = { ...mockEntity };
        repositoryStub.save.resolves(mockResponse);

        const result = await userFeedbackDao.storeFeedback(mockEntity);

        sinon.assert.calledOnce(getConnectionStub);
        sinon.assert.calledWith(repositoryStub.save, mockEntity);
        expect(result).to.eql(mockResponse);
    });

    it('should handle QueryFailedError correctly', async () => {
        const error = new QueryFailedError('query', [], 'Error message');
        repositoryStub.save.rejects(error);
        sinon.stub(Logger, 'error');

        try {
            await userFeedbackDao.storeFeedback(mockEntity);
            expect.fail('Error was not thrown');
        } catch (err: any) {
            expect(err).to.be.an.instanceof(ApiError);
            expect(err.statusCode).to.equal(400);
            expect(err.message).to.equal('Error message');
        }
    });

    it('should rethrow non-QueryFailedError errors', async () => {
        const error = new Error('General error');
        repositoryStub.save.rejects(error);
        sinon.stub(Logger, 'error');

        try {
            await userFeedbackDao.storeFeedback(mockEntity);
            expect.fail('Error was not thrown');
        } catch (err) {
            expect(err).to.equal(error);
        }
    });
});
