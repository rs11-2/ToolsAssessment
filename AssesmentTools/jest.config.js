const { jestConfig } = require('@salesforce/sfdx-lwc-jest/config');

module.exports = {
    ...jestConfig,
coverageProvider: "v8",



    modulePathIgnorePatterns: ['<rootDir>/.localdevserver']
};
