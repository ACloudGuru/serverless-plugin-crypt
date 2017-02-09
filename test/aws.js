'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const aws = require('../src/aws');

describe('#aws', () => {
    let provider = null;
    let providerRequestStub = null;
    let logStub = null;

    beforeEach(() => {
        providerRequestStub = sinon.stub();
        provider = {
            request: providerRequestStub
        };
        logStub = sinon.stub();
    })

    describe('#encrypt', () => {
        it('should make api request', () => {

            const stage = 'dev';
            const region = 'us-east-1';
            const value = 'val';
            const kmsKeyId = 'test-key';

            providerRequestStub.returns(Promise.resolve({
                // eslint-disable-next-line node/no-deprecated-api
                CiphertextBlob: new Buffer('cipher', 'base64')
            }))

            return aws.encrypt(provider, stage, region, value, kmsKeyId, logStub).then(() => {
                expect(providerRequestStub.calledOnce).to.equal(true);
                expect(providerRequestStub.args[0][0]).to.equal('KMS');
                expect(providerRequestStub.args[0][1]).to.equal('encrypt');
                expect(providerRequestStub.args[0][2]).to.deep.equal({
                    KeyId: kmsKeyId,
                    Plaintext: value,
                });
                expect(providerRequestStub.args[0][3]).to.equal(stage);
                expect(providerRequestStub.args[0][4]).to.equal(region);
            });
        });
    });

    describe('#decrypt', () => {
        it('should make api request', () => {
            const stage = 'dev';
            const region = 'us-east-1';
            const value = 'val';

            providerRequestStub.returns(Promise.resolve({
                // eslint-disable-next-line node/no-deprecated-api
                Plaintext: new Buffer('plain-text', 'utf-8')
            }))

            return aws.decrypt(provider, stage, region, value, logStub).then(() => {
                expect(providerRequestStub.calledOnce).to.equal(true);
                expect(providerRequestStub.args[0][0]).to.equal('KMS');
                expect(providerRequestStub.args[0][1]).to.equal('decrypt');
                expect(providerRequestStub.args[0][2]).to.deep.equal({
                    // eslint-disable-next-line node/no-deprecated-api
                    CiphertextBlob: new Buffer(value, 'base64')
                });
                expect(providerRequestStub.args[0][3]).to.equal(stage);
                expect(providerRequestStub.args[0][4]).to.equal(region);
            });
        });
    });
});