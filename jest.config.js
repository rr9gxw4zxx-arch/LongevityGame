module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: [],
    testMatch: ['**/tests/**/*.test.js']
};
