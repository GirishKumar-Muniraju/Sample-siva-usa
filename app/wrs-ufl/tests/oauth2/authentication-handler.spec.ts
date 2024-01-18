import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import { TokenValidationManager } from '../../src/core/oauth2/token-validation-manager';
import { Logger } from '../../src/utils/logger';
import { AuthenticationHandler, UNAUTHORIZED_STATUS_CODE } from './../../src/core/oauth2/authentication-handler';

describe('Authentication Handler', () => {
    let authenticationHandler: AuthenticationHandler;
    let req: Partial<Request> & { headers: any };
    let res: Partial<Response>;
    let next: any;
    let validateTokenMock: sinon.SinonStub;

    beforeEach(() => {
        validateTokenMock = sinon.stub(TokenValidationManager.prototype, 'validate');
        authenticationHandler = new AuthenticationHandler('some-region');
        
        req = { headers: {} } as Partial<Request> & { headers: any };
        res = {
            status: sinon.stub().returnsThis(),
            send: sinon.stub()
        } as Partial<Response> & { status: sinon.SinonStub; send: sinon.SinonStub };
        next = sinon.stub();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should initialize token validation manager', async () => {
        await authenticationHandler.initialize();
        expect(authenticationHandler.isInitialized).to.be.true;
    });

    it('should extract token and call next if token is valid', async () => {
        req.headers.authorization = 'Bearer valid-token';
        validateTokenMock.resolves(true);
       
        await authenticationHandler.handle(req as Request, res as Response, next);
       
        sinon.assert.calledOnce(validateTokenMock);
        sinon.assert.calledWith(validateTokenMock, 'valid-token');
        sinon.assert.calledOnce(next);
    });

    it('should return 401 if token is invalid', async () => {
        req.headers.authorization = 'Bearer invalid-token';

        validateTokenMock.resolves(false);

        await authenticationHandler.handle(req as Request, res as Response, next);

        sinon.assert.calledWith(res.status as sinon.SinonStub, UNAUTHORIZED_STATUS_CODE);
        sinon.assert.calledWith(res.send as sinon.SinonStub, 'Unauthorized');
    });

    it('should return 401 and log error if token validation fails', async () => {
        req.headers.authorization = 'Bearer invalid-token';
        
        const error = new Error('Validation error');
        validateTokenMock.rejects(error);
        const loggerSpy = sinon.spy(Logger, 'error');
        
        await authenticationHandler.handle(req as Request, res as Response, next);
        
        sinon.assert.calledWith(res.status as sinon.SinonStub, UNAUTHORIZED_STATUS_CODE);
        sinon.assert.calledWith(res.send as sinon.SinonStub, error.message);
        sinon.assert.calledWith(loggerSpy, `Error occurred while validating token: ${error.message}`);
    });
});
