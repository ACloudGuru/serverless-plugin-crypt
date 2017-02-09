'use strict';

class Plugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.provider = this.serverless.getProvider('aws');

        this.commands = {
            crypt: {
                usage: 'Encrypt and Decrypt secrets',
                lifecycleEvents: [
                    'run',
                ],
                commands: {
                    encrypt: {
                        usage: 'Encrypt a value',
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
                        usage: 'Decrypt a value',
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
                },
            },
            
        };

        this.hooks = {
            'crypt:encrypt:encrypt': this.encrypt.bind(this),
            'crypt:decrypt:decrypt': this.decrypt.bind(this),
        };
    }

    encrypt() {
        const value = this.options.value;
        this.serverless.cli.log(`Encrypting the text: ${value}`);

        const cryptConfig = this.serverless.service.custom.crypt;
        const kmsKeyId = cryptConfig.aws.kmsKeyId;

        if(!kmsKeyId) {
            throw new Error(`Missing KMS key please set custom.crypt.kmsKeyId`);
        }

        const params = {
            KeyId: kmsKeyId,
            Plaintext: value,
        };

        return this.provider.request(
            'KMS',
            'encrypt',
            params,
            this.options.stage, this.options.region
        ).then((ret) => {
            const ciperText = ret.CiphertextBlob.toString('base64');
            this.serverless.cli.log(`Cipher text is Base64 encoded.`);
            this.serverless.cli.log(ciperText)
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
            this.serverless.cli.log(`Decrypted text`);
            this.serverless.cli.log(ret.Plaintext.toString('utf-8'))
        });
    }
}

module.exports = Plugin;