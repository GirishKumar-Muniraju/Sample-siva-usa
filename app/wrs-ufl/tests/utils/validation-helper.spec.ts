import { ValidationHelper } from './../../src/utils/validation-helper';
import chai, { expect } from 'chai';
import spies from 'chai-spies';
chai.use(spies);
import * as schema from '../../src/schema/user-feedback.schema.json';
import { SchemaError } from '../../src/models/request-body-schema-error';

const userFeedbackInput = {
    wrNumber: '123',
    facility: 'SEA',
    uCode: 'x',
    workAgainstCode: 'x',
    troubleBrkdwn: 'x',
    opsReview: 'x',
    equipGroupType: 'x',
    equipClass: 'x',
    nucApplicableMode: 'x',
    fid: 'x',
    spv: 'x',
    mrule: 'x',
    ist: 'x',
    cda: 'x',
    safeSd: 'x',
    ePlan: 'x',
    fireProt: 'x',
    fireProt2: 'x',
    apprFire: 'x',
    flex: 'x',
    licRenew: 'x',
    equipBin: 'x',
    targetOutageInd: 'x',
    targetPriority: 'x',
    eCode: 'x',
    equipmentNumber: 'x',
    equipmentName: 'x',
    equipmentType: 'x',
    systemCode: 'x',
    locationDesc: 'x',
    description: 'x',
    detailedDescription: 'x',
    eCodeOutageYes: 'x',
    eCodeOutageNo: 'x',
    equipTypeOutageYes: 'x',
    equipTypeOutageNo: 'x',
    equipGroupIdOutageYes: 'x',
    equipGroupIdOutageNo: 'x',
    eCodeTrblBrkYes: 'x',
    eCodeTrblBrkNo: 'x',
    eCodeAverageTrblBrk12Mo: 'x',
    eCodeMaxTrblBrk12Mo: 'x',
    eCodeMinTrblBrk12Mo: 'x',
    modelName: 'x',
    modelVersion: 'x',
    modelRecommendation: 'x',
    modelProbability: 'x',
    userDecision: 'x',
    slid: 'slidTest'
};

describe('Validation Helper unit tests', async () => {
    it('Should not retrieve null as response for throwIfParamDoesNotExist', async () => {
        const params: Map<string, string> = new Map([
            ['key1', 'value1'],
            ['key2', 'value2']
        ]);
        const result = ValidationHelper.throwIfParamDoesNotExist(params, 'key2');
        // tslint:disable-next-line: no-unused-expression
        expect(result).not.to.be.null;
        expect(result).to.be.equal('value2');
    });

    it('Should throw exception for throwIfParamDoesNotExist', async () => {
        const params: Map<string, string> = new Map([
            ['key1', 'value1'],
            ['key2', 'value2']
        ]);

        expect(() => {
            ValidationHelper.throwIfParamDoesNotExist(params, 'key3');
        }).throw('key3 is missing.');
    });

    it('Should not retrieve null as response for throwIfJsonIsNull', async () => {
        const jsonObj = {
            id: 1,
            name: 'George Washington'
        };

        const result = ValidationHelper.throwIfJsonIsNull(JSON.stringify(jsonObj), 400, 'Object is null');
        // tslint:disable-next-line: no-unused-expression
        expect(result).not.to.be.null;
        expect(result).to.be.deep.equal(jsonObj);
    });

    it('Should throw exception for throwIfJsonIsNull', async () => {
        const jsonObj = null;
        expect(() => {
            ValidationHelper.throwIfJsonIsNull(JSON.stringify(jsonObj), 400, 'Object is null');
        }).throw('Object is null');
    });

    it('Should not retrieve null as response for throwIfArrayIsEmpty', async () => {
        const arrLength = 10;
        const result = ValidationHelper.throwIfArrayIsEmpty(arrLength, 400, 'Object is null');
        // tslint:disable-next-line: no-unused-expression
        expect(result).not.to.null;
    });

    it('Should throw exception for throwIfArrayIsEmpty', async () => {
        expect(() => {
            ValidationHelper.throwIfArrayIsEmpty(0, 400, 'Array is empty');
        }).throw('Array is empty');
    });

    it('Should throw exception for throwIfObjectIsNull', async () => {
        expect(() => {
            ValidationHelper.throwIfObjectIsNull(null, 200, 'some error');
        }).throw('some error');
    });

    it('Should throw exception for throwIfAuthHeaderMissing - 1', async () => {
        expect(() => {
            ValidationHelper.throwIfAuthHeaderMissing({});
        }).throw('Token validation failed');
    });

    it('Should throw exception for throwIfAuthHeaderMissing - 2', async () => {
        expect(() => {
            ValidationHelper.throwIfAuthHeaderMissing({
                Authorization: ''
            });
        }).throw('Token validation failed');
    });

    it('Should throw exception for throwIfAuthHeaderMissing - 3', async () => {
        expect(() => {
            ValidationHelper.throwIfAuthHeaderMissing({
                authorization: ''
            });
        }).throw('Token validation failed');
    });

    it('Should not retrieve null as response for throwIfSchemaNotValid', async () => {
        const sampleAssignDocRequest = {
            requestContext: {
                elb: {
                    targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
                }
            },
            httpMethod: 'POST',
            path: '/api/ars',
            isBase64Encoded: false,
            body: JSON.stringify({
                wrNumber: '12345678',
                modelId: '123456',
                recommendation: 'Yes',
                userDecision: 'No'
            })
        };
        expect(() => {
            ValidationHelper.throwIfSchemaNotValid(sampleAssignDocRequest, schema, 'Invalid Request');
        }).throw('Invalid Request');
    });

    it('Should throw exception for as response for throwIfSchemaNotValid', async () => {
        const notAllowPropertyName = 'unknownProperty';
        const sampleAssignDocRequest = {
            requestContext: {
                elb: {
                    targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
                }
            },
            httpMethod: 'POST',
            path: '/api/ars',
            isBase64Encoded: false,
            body: JSON.stringify({
                ...userFeedbackInput,
                [notAllowPropertyName]: 'some value'
            })
        };

        try {
            ValidationHelper.throwIfSchemaNotValid(sampleAssignDocRequest, schema, 'Invalid Request');
            expect.fail('Error was not thrown');
        } catch (error) {
            expect(error).to.be.an.instanceof(SchemaError);
            expect((error as SchemaError).statusCode).to.equal(400);
            expect((error as SchemaError).message).to.equal('Invalid Request');
            expect((error as SchemaError).validationResult[0].message).to.equal(`Property ${notAllowPropertyName} is not allowed`);
        }
    });

    it('Should not retrieve null as response for throwIfQueryParamsNotValid', async () => {
        const sampleAssignDocRequest = {
            requestContext: {
                elb: {
                    targetGroupArn: 'arn:aws:elasticloadbalancing:region:accountId:targetgroup/my-target-group/groupId'
                }
            },
            httpMethod: 'POST',
            path: '/api/ars',
            isBase64Encoded: false,
            body: JSON.stringify({
                wrNumber: '12345678',
                modelId: '123456',
                recommendation: 'Yes',
                userDecision: 'No'
            })
        };
        expect(() => {
            ValidationHelper.throwIfQueryParamsNotValid(sampleAssignDocRequest, schema, 'Invalid Request');
        }).throw('Invalid Request');
    });

    it('Should throw exception for throwIfArrayIsAlreadyExists', async () => {
        expect(() => {
            ValidationHelper.throwIfArrayIsAlreadyExists(['1'], 400, 'Array is empty');
        }).throw('Array is empty');
    });

    it('Should throw exception for throwIfObjectIsAlreadyExists', async () => {
        expect(() => {
            ValidationHelper.throwIfObjectIsAlreadyExists({}, 400, 'some error');
        }).throw('some error');
    });
});
