# serverless-plugin-crypt [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Serverless Crypt Plugin

A Serverless plugin to easily add CloudWatch alarms to functions

## Installation
`npm i serverless-plugin-crypt`

## Usage

`sls crypt encrypt -v your_secret_text`

`sls crypt decrypt -v your_cipher_text`

## Configuration
```yaml
service: your-service
provider:
  name: aws

custom:
  crypt:
    aws:
      kmsKeyId: YOUR_KMS_KEY_ID

plugins:
  - serverless-plugin-crypt

functions:
  foo:
    handler: foo.handler
    environment:
        YOUR_ENV_VAR: some-cipher-text
```

## License

MIT © [A Cloud Guru](https://acloud.guru/)


[npm-image]: https://badge.fury.io/js/serverless-plugin-crypt.svg
[npm-url]: https://npmjs.org/package/serverless-plugin-crypt
[travis-image]: https://travis-ci.org/ACloudGuru/serverless-plugin-crypt.svg?branch=master
[travis-url]: https://travis-ci.org/ACloudGuru/serverless-plugin-crypt
[daviddm-image]: https://david-dm.org/ACloudGuru/serverless-plugin-crypt.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/ACloudGuru/serverless-plugin-crypt
[coveralls-image]: https://coveralls.io/repos/ACloudGuru/serverless-plugin-crypt/badge.svg
[coveralls-url]: https://coveralls.io/r/ACloudGuru/serverless-plugin-crypt