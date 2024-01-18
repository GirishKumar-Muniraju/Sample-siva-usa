import chai, { expect } from 'chai';
import spies from 'chai-spies';
import { Utility } from '../../src/utils/utility';
chai.use(spies);

describe('Date Conversions utils unit tests', async function() {
    it('Should convert keyValue to object', async () => {
        const keyValues = ['workerSlid:SXK0JIJ', 'reqId:234'];
        const expResult = {
            workerSlid: 'SXK0JIJ',
            reqId: '234'
        };
        const result = Utility.toKeyValuesObject(keyValues);
        expect(result).not.to.be.null;
        expect(result).to.be.deep.equal(expResult);
    });

    it('Should convert object to keyValue', async () => {
        const expResult = ['workerSlid:SXK0JIJ', 'reqId:234'];
        const keyValues = {
            workerSlid: 'SXK0JIJ',
            reqId: '234'
        };
        const result = Utility.toKeyValuesStrArray(keyValues);
        expect(result).not.to.be.null;
        expect(result).to.be.deep.equal(expResult);
    });

    it('Should convert reqId to padding reqId', async () => {
        const result = Utility.formReqNumber(12);
        expect(result).not.to.be.null;
        expect(result).to.be.equal('REQ00000012');
    });

    it('Should convert object to keyValue', async () => {
        const result = Utility.toKeyValuesObject([]);
        expect(result).not.to.be.null;
        expect(result).to.be.deep.equal({});
    });

    it('should return boolean value for parseBoolean', async () => {
        const retVal = Utility.parseBoolean('true');
        expect(retVal).to.be.equal(true);
    });

    it('should return boolean value for parseBoolean', async () => {
        const retVal = Utility.parseBoolean('1');
        expect(retVal).to.be.equal(true);
    });

    it('should return value for extractSlid - non-null username', async () => {
        const retVal = Utility.extractSlid('userid_username');
        expect(retVal).to.be.equal('username');
    });

    it('should return value for extractSlid - null username', async () => {
        const retVal = Utility.extractSlid("");
        expect(retVal).to.be.equal(null);
    });
});
