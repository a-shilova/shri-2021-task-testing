module.exports = {
    baseUrl: 'http://localhost:3000/',
    gridUrl: 'http://172.18.0.1:4444',

    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    },
    sets: {
        common: {
            files: 'test/hermione'
        },
        desktop: {
            files: [
                'test/hermione/*.hermione.js',
            ]
        }
    }
};
