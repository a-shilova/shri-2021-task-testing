const { helper } = require('./utils/utils');
const assert = require('assert');

describe('Product', () => {
	const details = async (browser) => {
		const Details = await browser.$('.ProductDetails');
		await Details.waitForExist();
		await browser.assertView('plain', '.ProductDetails', {
			compositeImage: true,
			allowViewportOverflow: true,
		});
	}

	it('should go to Product Detains on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');

		const productItem = await browser.$('.ProductItem');
		await productItem.waitForExist();

		const cardLink = await browser.$('[data-testid="1"] > .card-body > a');
		cardLink.click();

		await helper(this.browser, details, 1000, 1000);
	});

	it('should go to Product Detains on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');

		const productItem = await browser.$('.ProductItem');
		await productItem.waitForExist();

		const cardLink = await browser.$('[data-testid="1"] > .card-body > a');
		cardLink.click();

		await helper(this.browser, details);
	});

	it('should show notice about add to card', async function () {
		const browser = this.browser;
		await browser.url('/hw/store/catalog/0');
		const Details = await browser.$('.ProductDetails');
		await Details.waitForExist();
		const submit = await browser.$('.ProductDetails-AddToCart');

		submit.click();
		const badgeExisting = await browser.$('.CartBadge');
		assert.ok(badgeExisting, 'Add to cart is not appear');

		await browser.url('/hw/store/catalog');
		const badge = await browser.$('[data-testid="0"] > .card-body .CartBadge');
		await badge.waitForExist();
	})
})
