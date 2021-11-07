const { helper } = require('./utils/utils');

describe('HomePage', () => {
	const home = async (browser) => {
		const Home = await browser.$('.Home');
		await Home.waitForExist();
		await Home.scrollIntoView();
		await browser.assertView('plain', '.Home', {
			compositeImage: true,
			allowViewportOverflow: true,
		});
	}

    it('should have correct view on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store');

		await helper(this.browser, home, 1000, 1000);
    });

    it('should have correct view on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store');

		await helper(this.browser, home);
    });

    const menu = async (browser) => {
		const navbar = await browser.$('.Application-Menu');
		await navbar.waitForExist();
		await navbar.scrollIntoView();
		await browser.assertView('plain', '.navbar', {
			allowViewportOverflow: false,
			captureElementFromTop: true,
			compositeImage: true,
			ignoreElements: ['.Home']
		});
	}

    it('should have correct menu items on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store');

		await helper(this.browser, menu, 1000, 1000);
	});

    it('should have correct menu items on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store');

		await helper(this.browser, menu);
	});
});
