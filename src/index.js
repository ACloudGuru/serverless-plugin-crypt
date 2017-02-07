'use strict';

class Plugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = this.serverless.getProvider('aws');

        this.commands = {
            encrypt: {
                lifecycleEvents: [
                    'encrypt',
                ],
                options: {
                    value: {
                        usage: 'Specify the value you want to encrypt (e.g. "--value test")',
                        shortcut: 'v',
                        required: true
                    }
                }
            },
            decrypt: {
                lifecycleEvents: [
                    'decrypt',
                ],
                options: {
                    value: {
                        usage: 'Specify the value you want to decrypt (e.g. "--value test")',
                        shortcut: 'v',
                        required: true
                    }
                }
            },
        };

        this.hooks = {
            'encrypt:encrypt': this.encrypt.bind(this),
            'encrypt:decrypt': this.encrypt.bind(this),
        };
    }

    encrypt() {
        const value = this.options.value;
        this.serverless.cli.log(`Encrypting the text: ${value}`);

        const params = {
            KeyId: this.serverless.service.custom.cryptKeyId,
            Plaintext: value,
        };

        return this.provider.request(
            'KMS',
            'encrypt',
            params,
            this.options.stage, this.options.region
        ).then((ret) => {
            const ciperText = ret.CiphertextBlob.toString('base64');
            this.serverless.cli.log(`Cipher text: ${ciperText}. Base64 encoded.`);
        });
    }

    decrypt() {
        const value = this.options.value;
        this.serverless.cli.log(`Decrypting the text: ${value}`);

        const params = {
            CiphertextBlob: new Buffer(value, 'base64'),
        };

        return this.provider.request(
            'KMS',
            'decrypt',
            params,
            this.options.stage, this.options.region
        ).then((ret) => {
            this.serverless.cli.log(`Decrypted text: ${ret.Plaintext.toString('utf-8')}`);
        });
    }
}

module.exports = Plugin;