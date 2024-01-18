import { expect } from 'chai';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DaoConnectionManager as DaoConnectionManagerType } from './../../../src/core/typeorm/dao-connection-manager';

class MockDataSource extends DataSource {
    constructor(options: DataSourceOptions) {
        super(options);
    }

    initialize(): Promise<this> {
        Object.assign(this, 'isInitialized', true);
        return Promise.resolve({ ...this, isInitialized: true });
    }
}

// function mockDataSourceClass(options: DataSourceOptions) {
//     const dataSource = new DataSource(options);
//     sinon.stub(dataSource, 'initialize').resolves();
//     return dataSource;
// }

describe('DaoConnectionManager', () => {
    let DaoConnectionManager: typeof DaoConnectionManagerType;
    let getDsConfigStub;
    const mockConfig: DataSourceOptions = {
        type: 'postgres',
        database: 'test.db'
    };

    beforeEach(() => {
        getDsConfigStub = sinon.stub().returns(mockConfig);
        DaoConnectionManager = proxyquire('../../../src/core/typeorm/dao-connection-manager', {
            typeorm: { DataSource: MockDataSource },
            '../../config/datasource-config': { getDSConfig: getDsConfigStub }
        }).DaoConnectionManager;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should create a new instance if not already created', async () => {
        const connection = await DaoConnectionManager.getConnection('default');
        expect(connection).to.be.instanceOf(DataSource);
    });

    it('should initialize a new connection if none exists', async () => {
        await DaoConnectionManager.getConnection('default');
        sinon.assert.calledOnce(getDsConfigStub);
    });
});
