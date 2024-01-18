import { expect } from 'chai';
import { afterEach, beforeEach } from 'mocha';
import sinon from 'sinon';
import { transports } from 'winston';
import { Logger } from '../../src/utils/logger';

describe('Logger unit tests', function() {
    let consoleLogSpy;

    beforeEach(() => {
        consoleLogSpy = sinon.spy(transports.Console.prototype, 'log');
    });

    afterEach(() => {
        consoleLogSpy.restore();
    });

    it('should correctly log an info message', function() {
        const testMessage = 'Test Info Message';
        Logger.info(testMessage);

        expect(consoleLogSpy.calledOnce).to.be.true;
        const logArgs = consoleLogSpy.getCall(0).args[0];
        expect(logArgs).to.have.property('level', 'info');
        expect(logArgs).to.have.property('message', testMessage);
        expect(logArgs).to.have.property('label', 'nuc-wrs-user-feedback');
        expect(logArgs[Symbol.for('message')]).to.include(`[nuc-wrs-user-feedback] Nuclear_App_Info: ${testMessage}`);
    });

    it('should correctly log a warning message', function() {
        const testMessage = 'Test Warning Message';
        Logger.warn(testMessage);

        expect(consoleLogSpy.calledOnce).to.be.true;
        const logArgs = consoleLogSpy.getCall(0).args[0];
        expect(logArgs).to.have.property('level', 'warn');
        expect(logArgs).to.have.property('message', testMessage);
        expect(logArgs).to.have.property('label', 'nuc-wrs-user-feedback');
        expect(logArgs[Symbol.for('message')]).to.include(`[nuc-wrs-user-feedback] Nuclear_App_Warning: ${testMessage}`);
    });

    it('should correctly log a Error message', function() {
        const testMessage = 'Test Error Message';
        Logger.error(testMessage);

        expect(consoleLogSpy.calledOnce).to.be.true;
        const logArgs = consoleLogSpy.getCall(0).args[0];
        expect(logArgs).to.have.property('level', 'error');
        expect(logArgs).to.have.property('message', testMessage);
        expect(logArgs).to.have.property('label', 'nuc-wrs-user-feedback');
        expect(logArgs[Symbol.for('message')]).to.include(`[nuc-wrs-user-feedback] Nuclear_App_Error: ${testMessage}`);
    });

    it('should correctly log a Debug message', function() {
        const testMessage = 'Test Debug Message';
        Logger.debug(testMessage);

        expect(consoleLogSpy.calledOnce).to.be.true;
        const logArgs = consoleLogSpy.getCall(0).args[0];
        expect(logArgs).to.have.property('level', 'debug');
        expect(logArgs).to.have.property('message', testMessage);
        expect(logArgs).to.have.property('label', 'nuc-wrs-user-feedback');
        expect(logArgs[Symbol.for('message')]).to.include(`[nuc-wrs-user-feedback] Nuclear_App_Debug: ${testMessage}`);
    });
});
