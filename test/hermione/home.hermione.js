const { assert } = require('chai');

describe('start page', function() {
    it('should has title', async function() {
        await this.browser.url('/hw/store/');

        const title = await this.browser.$('.display-3').getText();
        assert.equal(title, 'Welcome to Example store!');
    });
});