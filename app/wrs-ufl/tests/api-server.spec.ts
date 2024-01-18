import { expect } from 'chai';
import { after, beforeEach, it } from 'mocha';
import proxyquire from 'proxyquire';
import sinon from 'sinon';
import request from 'supertest';

describe('API Server Tests', () => {
    let apiServer: any = null;
    const fakeResponse = {
        statusCode: 200,
        statusDescription: '',
        body: '',
        headers: {
            'access-control-allow-origin': 'http://localhost:4200'
        },
        query: {
            param1: '',
            param2: ''
        }
    };
    beforeEach(function() {
        process.env.API_SERVER = 'true';
        this.timeout(10000);
        apiServer = proxyquire('../src/api-server', {
            './index': {
                handler: sinon.stub().callsFake(() => {
                    return new Promise(resolve => {
                        resolve(fakeResponse);
                    });
                })
            }
        });
    });

    it('should call POST method - 1', async () => {
        const response = await request(apiServer.app)
            .post('/api/ars/v1/user/feedback')
            .set('Accept', 'application/json');
        expect(response.status).to.be.equal(200);
        expect(response.headers['access-control-allow-origin']).to.be.equal(fakeResponse.headers['access-control-allow-origin']);
    });

    after(function() {
        this.timeout(10000);
        if (apiServer && apiServer.server) apiServer.server.close();
        delete process.env.API_SERVER;
    });
});
