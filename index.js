'use strict';

const aws = require('./src/aws');

class Plugin {
    constructor(serverless, options) {
        this.serverless = serverless;
        this.options = options;
        this.providerName = serverless.service.provider.name;
        this.provider = this.serverless.getProvider(this.providerName);

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

    getCryptConfig() {
        const customConfig = this.serverless.service.custom;

        if (!customConfig) return null;

        const cryptConfig = customConfig.crypt;

        if (!cryptConfig) return null;

        return cryptConfig[this.providerName]
    }

    encrypt() {
        const value = this.options.value;
        this.serverless.cli.log(`Encrypting the text: ${value}`);

        const cryptConfig = this.getCryptConfig();

        if (!cryptConfig) {
            this.serverless.cli.log(`Please set the crypt plugin config`);
        }

        switch(this.providerName) {
            case 'aws':
                aws.encrypt(
                    this.provider,
                    this.options.stage,
                    this.options.region,
                    value,
                    cryptConfig.kmsKeyId,
                    (msg) => this.serverless.cli.log(msg)
                );
                break;
            default:
                throw new Error(`Unsupported provider ${this.providerName}`)
        }
    }

    decrypt() {
        const value = this.options.value;
        this.serverless.cli.log(`Decrypting the text: ${value}`);

        const cryptConfig = this.getCryptConfig();

        if (!cryptConfig) {
            this.serverless.cli.log(`Please set the crypt plugin config`);
        }

        switch(this.providerName) {
            case 'aws':
                aws.decrypt(
                    this.provider,
                    this.options.stage,
                    this.options.region,
                    value,
                    (msg) => this.serverless.cli.log(msg)
                );
                break;
            default:
                throw new Error(`Unsupported provider ${this.providerName}`)
        }
    }
}

module.exports = Plugin;