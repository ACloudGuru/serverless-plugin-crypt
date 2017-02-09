'use strict';

const encrypt = (provider, stage, region, value, kmsKeyId, log) => {
    if(!kmsKeyId) {
        throw new Error(`Missing KMS key please set custom.crypt.kmsKeyId`);
    }

    const params = {
        KeyId: kmsKeyId,
        Plaintext: value,
    };

    return provider.request(
        'KMS',
        'encrypt',
        params,
        stage, 
        region
    ).then((ret) => {
        const ciperText = ret.CiphertextBlob.toString('base64');
        log(`Cipher text is Base64 encoded.`);
        log(ciperText)
    });
}

const decrypt = (provider, stage, region, value, log) => {
    const params = {
        // eslint-disable-next-line node/no-deprecated-api
        CiphertextBlob: new Buffer(value, 'base64'),
    };

    return provider.request(
        'KMS',
        'decrypt',
        params,
        stage,
        region
    ).then((ret) => {
        log(`Decrypted text`);
        log(ret.Plaintext.toString('utf-8'))
    });
}

module.exports = {
    encrypt,
    decrypt
}