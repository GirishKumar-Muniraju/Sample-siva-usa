import { expect } from 'chai';
import sinon from 'sinon';
import { DaoConnectionManager } from '../../../src/core/typeorm/dao-connection-manager';
import { MigrationManager } from '../../../src/core/typeorm/migration-manager';
import { Logger } from '../../../src/utils/logger';

describe('Migration Manager Tests', () => {
    let daoConnectionManagerStub: sinon.SinonStub;
    let loggerInfoSpy: sinon.SinonSpy;
    let runMigrationsStub: sinon.SinonStub;
    let undoLastMigrationStub: sinon.SinonStub;
    
    beforeEach(() => {
        daoConnectionManagerStub = sinon.stub(DaoConnectionManager, 'getConnection');
        loggerInfoSpy = sinon.spy(Logger, 'info');
        runMigrationsStub = sinon.stub().resolves();
        undoLastMigrationStub = sinon.stub().resolves();
        const mockConnection = {
            runMigrations: runMigrationsStub,
            undoLastMigration: undoLastMigrationStub
        };
        daoConnectionManagerStub.resolves(mockConnection);
    });
    
    afterEach(() => {
        sinon.restore();
    });
    
    it('should execute runMigrations when action is RUN', async () => {
        process.env.TYPEORM_MIGRATIONS_RUN = 'true';
        const migrationManager = new MigrationManager(MigrationManager.RUN);
        await migrationManager.execute('testConnection');
        sinon.assert.calledOnce(runMigrationsStub);
        sinon.assert.calledWith(loggerInfoSpy, 'Running migrations for connection testConnection');
    });
    
    it('should execute revertLastMigration when action is REVERT', async () => {
        process.env.TYPEORM_MIGRATIONS_RUN = 'true';
        const migrationManager = new MigrationManager(MigrationManager.REVERT);
        await migrationManager.execute('testConnection');
        sinon.assert.calledOnce(undoLastMigrationStub);
        sinon.assert.calledWith(loggerInfoSpy, 'Reverting last migration for connection testConnection');
    });
    
    it('should throw an error if migrations are not enabled', async () => {
        process.env.TYPEORM_MIGRATIONS_RUN = 'false';
        const migrationManager = new MigrationManager(MigrationManager.RUN);
        try {
            await migrationManager.execute('testConnection');
            expect.fail('Error was not thrown');
        } catch (error: any) {
            expect(error.message).to.equal('Migrations are not enabled');
        }
    });

    it('should throw an error for invalid migration action', async () => {
        process.env.TYPEORM_MIGRATIONS_RUN = 'true';
        const invalidAction = 'INVALID_ACTION' as any;
        const migrationManager = new MigrationManager(invalidAction);
        try {
            await migrationManager.execute('testConnection');
            expect.fail('Error was not thrown');
        } catch (error: any) {
            expect(error.message).to.equal(`Invalid migration action: ${invalidAction}`);
        }
    });
});
 