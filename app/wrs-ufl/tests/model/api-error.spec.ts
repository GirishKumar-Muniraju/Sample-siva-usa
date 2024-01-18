import { ApiError } from './../../src/models/api-error';
import { expect } from 'chai';

describe('API Error', () => {

  it('should create an error with given status code and message', () => {
    const statusCode = 400;
    const message = 'Bad Request';
    const apiError = new ApiError(statusCode, message);

    expect(apiError).to.be.an.instanceOf(Error);
    expect(apiError).to.be.an.instanceOf(ApiError);
    expect(apiError.statusCode).to.equal(statusCode);
    expect(apiError.message).to.equal(message);
  });

  it('should have a stack trace', () => {
    const apiError = new ApiError(500, 'Internal Server Error');
    expect(apiError.stack).to.be.a('string');
  });
})