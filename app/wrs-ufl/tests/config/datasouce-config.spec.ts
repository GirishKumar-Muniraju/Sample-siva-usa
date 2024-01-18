import { expect } from 'chai';
import sinon from 'sinon';
import { DataSource, DataSourceOptions } from 'typeorm';
import proxyquire from 'proxyquire';

describe('DataSource Module', () => {
    let getDSConfigStub: sinon.SinonStub;
    let dataSourceInstance: DataSource;
    let initializeSpy: sinon.SinonSpy;

    const mockConfig: DataSourceOptions = {
      type: 'postgres',
      database: 'test.db'
    }

    beforeEach(() => {
        getDSConfigStub = sinon.stub().returns(mockConfig);
        dataSourceInstance = new DataSource(mockConfig);
        initializeSpy = sinon.spy(dataSourceInstance, 'initialize');

        proxyquire('../../src/config/migration.config.ts', {
            typeorm: { DataSource: sinon.stub().returns(dataSourceInstance) },
            './datasource-config': { getDSConfig: getDSConfigStub }
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create a new DataSource with the correct configuration', () => {
        expect(dataSourceInstance).to.be.instanceOf(DataSource);
        sinon.assert.calledOnce(getDSConfigStub);
    });

    it('should initialize the DataSource', () => {
        sinon.assert.calledOnce(initializeSpy);
    });
});
