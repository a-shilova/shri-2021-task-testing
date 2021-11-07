const { helper } = require('./utils/utils');

describe('Catalog', () => {
	const catalog = async (browser) => {
		const productItem = await browser.$('.ProductItem');
		await productItem.waitForExist();
		await browser.assertView('plain', '.ProductItem', {
			allowViewportOverflow: true,
			compositeImage: true
		});
	}

	it('should have correct ProductItem on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');

		await helper(this.browser, catalog);
	});

	it('should have correct ProductItem on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');

		await helper(this.browser, catalog, 1000, 1000);
	});

	it('should go to Product Detains', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');
		const productItem = await browser.$('.ProductItem');
		await productItem.waitForExist();
		const cardLink = await browser.$('[data-testid="1"] > .card-body > a');

		cardLink.click();
		await browser.assertView('clicked', '[data-testid="1"] > .card-body > a');
	});
});
