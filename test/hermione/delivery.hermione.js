const { helper } = require('./utils/utils');

describe('Delivery', () => {
	const delivery = async (browser) => {
		const Delivery = await browser.$('.Delivery');
		await Delivery.waitForExist();
		await Delivery.scrollIntoView();
		await browser.assertView('plain', '.Delivery', {
			compositeImage: true,
			allowViewportOverflow: true,
		});
	}

    it('should have correct view on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/delivery');

		await helper(this.browser, delivery, 1000, 1000);
    });

    it('should have correct view on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/delivery');

		await helper(this.browser, delivery);
    });
});
