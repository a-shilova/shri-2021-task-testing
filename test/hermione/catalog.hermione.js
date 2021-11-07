describe('Catalog', () => {
	const helper = async (browser, test, w1 = 500, h1 = 1000) => {
		const {width, height} = await browser.getWindowSize();
		await browser.setWindowSize(w1, h1);
		try {
			await test();
		} finally {
			await browser.setWindowSize(width, height);
		}
	}

	it('should have correct ProductItem on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');
		const test = async () => {
			const productItem = await browser.$('.ProductItem');
			await productItem.waitForExist();
			await browser.assertView('plain', '.ProductItem', {
				allowViewportOverflow: true,
				compositeImage: true
			});
		}
		await helper(this.browser, test);
	});

	it('should have correct ProductItem on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/catalog');
		const test = async () => {
			const productItem = await browser.$('.ProductItem');
			await productItem.waitForExist();
			await browser.assertView('plain', '.ProductItem', {
				allowViewportOverflow: true,
				compositeImage: true
			});
		}
		await helper(this.browser, test, 1000, 1000);
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
