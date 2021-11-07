const helper = async (browser, test, w1 = 500, h1 = 1000) => {
	const {width, height} = await browser.getWindowSize();
	await browser.setWindowSize(w1, h1);
	try {
		await test(browser);
	} finally {
		await browser.setWindowSize(width, height);
	}
}
exports.helper = helper;
