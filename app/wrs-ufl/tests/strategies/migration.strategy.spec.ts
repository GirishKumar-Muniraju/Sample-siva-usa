import { AuthorizationHandler } from './../../src/core/oauth2/authorization-handler';
import { LambdaResponseHelper } from './../../src/utils/lambda-response-helper';
import { ALBEvent, ALBResult } from 'aws-lambda';
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import spies from 'chai-spies';
import { beforeEach } from 'mocha';
import sinon from 'sinon';
import { MigrationManager } from '../../src/core/typeorm/migration-manager';
import { MigrationStrategy } from './../../src/strategies/migration.strategy';
import { CONNECTION_NAME } from '../../src/config/datasource-config';
import { ErrorHandlingHelper } from '../../src/utils/error-handling-helper';
chai.use(spies);
chai.use(chaiPromised);
const expect = chai.expect;

describe('Migration strategy tests', async function() {
    let migrationManagerStub: sinon.SinonStubbedInstance<MigrationManager>;
    let lambdaResponseHelperStub: sinon.SinonStub;
    let authorizationHandlerStub: sinon.SinonStub;
    let errorHandlerHelperStub: sinon.SinonStub;
    let fakeEvent: ALBEvent;
    let migrationStrategy: MigrationStrategy;

    beforeEach(() => {
        migrationManagerStub = sinon.createStubInstance(MigrationManager);
        lambdaResponseHelperStub = sinon.stub(LambdaResponseHelper, 'sendApiResponse');
        errorHandlerHelperStub = sinon.stub(ErrorHandlingHelper, 'handle');
        authorizationHandlerStub = sinon.stub(AuthorizationHandler.prototype, 'handle').resolves();
        fakeEvent = {} as ALBEvent;
        migrationStrategy = new MigrationStrategy(migrationManagerStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should execute validate method without errors', async () => {
        const migrationStrategy = new MigrationStrategy(migrationManagerStub as any);
        await migrationStrategy.validate(fakeEvent);
        expect(true).to.be.true;
    });

    it('should execute a migration and return success response', async () => {
        const expectedResponse: ALBResult = {
          statusCode: 200
        }

        lambdaResponseHelperStub.returns(expectedResponse);

        const response = await migrationStrategy.execute(fakeEvent);

        sinon.assert.calledOnce(authorizationHandlerStub);
        sinon.assert.calledOnceWithExactly(migrationManagerStub.execute, CONNECTION_NAME);
        sinon.assert.calledOnce(lambdaResponseHelperStub);
        expect(response).to.be.deep.equal(expectedResponse);
    });

    it('should execute a migration and return an error response', async () => {
        const error = new Error('Test error message')
        authorizationHandlerStub.rejects(error);
        const expectedResponse: ALBResult = {
          statusCode: 500
        }

        errorHandlerHelperStub.returns(expectedResponse);

        const response = await migrationStrategy.execute(fakeEvent);

        sinon.assert.calledOnce(authorizationHandlerStub);
        sinon.assert.calledOnce(errorHandlerHelperStub);
        expect(response).to.be.deep.equal(expectedResponse);
    });
});
