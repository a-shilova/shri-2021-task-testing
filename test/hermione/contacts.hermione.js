const { helper } = require('./utils/utils');

describe('Contacts', () => {
	const delivery = async (browser) => {
		const Contacts = await browser.$('.Contacts');
		await Contacts.waitForExist();
		await Contacts.scrollIntoView();
		await browser.assertView('plain', '.Contacts', {
			compositeImage: true,
			allowViewportOverflow: true,
		});
	}

    it('should have correct view on desktop', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/contacts');

		await helper(this.browser, delivery, 1000, 1000);
    });

    it('should have correct view on mobile', async function() {
		const browser = this.browser;
		await browser.url('/hw/store/contacts');

		await helper(this.browser, delivery);
    });
});
